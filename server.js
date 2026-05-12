/**
 * DUBIMOTORS AI API Server
 * Handles: /api/agent, /api/analyze-photos, /api/vin-lookup, /api/price-estimate, /api/verify-listing
 * Also serves static files from the same directory.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const OpenAI = require('openai');

// ── Lazy OpenAI client ──
// Initialize only when first needed. This prevents the server from crashing
// on startup if OPENAI_API_KEY is missing — instead, individual AI endpoints
// return a clean 503 and the rest of the static site keeps working.
let _openai = null;
function getOpenAI() {
  if (_openai) return _openai;
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error('OPENAI_API_KEY is not configured');
    err.code = 'OPENAI_KEY_MISSING';
    throw err;
  }
  _openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
  return _openai;
}

// Model selection. Defaults assume the OPENAI_API_KEY is for OpenAI (not
// a Gemini compat endpoint). If you wire OPENAI_BASE_URL to Google's
// generativelanguage endpoint, set AI_VISION_MODEL=gemini-2.5-flash etc.
const AI_TEXT_MODEL   = process.env.AI_TEXT_MODEL   || 'gpt-4.1-mini';
const AI_VISION_MODEL = process.env.AI_VISION_MODEL || 'gpt-4o-mini';

// Backwards-compat shim so existing handlers using `openai.chat.completions.create(...)` still work.
const openai = new Proxy({}, {
  get(_, prop) {
    const client = getOpenAI();
    return client[prop];
  }
});

const PORT = process.env.PORT || 8080;
const STATIC_DIR = __dirname;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Listings catalog (used by Dubi Agent so it can answer with real data) ──
// Loaded once at startup. Replace this with a Supabase query in Phase 3.
const DM = require('./shared.js');

/**
 * Build a compact, token-efficient catalog string for injection into the
 * agent's system prompt. Format: one line per listing with the fields
 * the AI is most likely to reason about. Keeps the prompt under ~2000 tokens
 * even with 200+ listings.
 */
function buildAgentCatalog() {
  if (!DM || !DM.listings) return '(catalog unavailable)';
  const lines = DM.listings.map(l => {
    const parts = [
      `id=${l.id}`,
      `${l.year || '?'} ${l.make || ''} ${l.model || ''}${l.trim ? ' ' + l.trim : ''}`.trim(),
      `cat=${l.category}`,
      `AED ${l.price?.toLocaleString() || '?'}`,
      l.km !== undefined ? `${l.km.toLocaleString()}km` : null,
      l.condition ? `cond=${l.condition}` : null,
      l.location ? `in ${l.location}` : null,
      l.seller ? `seller=${l.seller}` : null,
      l.featured ? 'FEATURED' : null,
    ].filter(Boolean);
    return '- ' + parts.join(' | ');
  });
  return lines.join('\n');
}

// Build once at boot. If you add listings without restart, this becomes stale.
const AGENT_CATALOG = buildAgentCatalog();
console.log(`Loaded ${DM?.listings?.length || 0} listings into agent catalog`);

// ── MIME types ──
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff',
};

// ── Parse JSON body ──
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

// ── Parse multipart form (for photo upload) ──
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      const ct = req.headers['content-type'] || '';
      const boundaryMatch = ct.match(/boundary=(.+)$/);
      if (!boundaryMatch) return resolve({ files: [] });
      const boundary = '--' + boundaryMatch[1];
      const parts = buf.toString('binary').split(boundary).slice(1, -1);
      const files = [];
      parts.forEach(part => {
        const [headerPart, ...bodyParts] = part.split('\r\n\r\n');
        const body = bodyParts.join('\r\n\r\n').replace(/\r\n$/, '');
        const nameMatch = headerPart.match(/name="([^"]+)"/);
        const typeMatch = headerPart.match(/Content-Type: ([^\r\n]+)/);
        if (typeMatch && typeMatch[1].startsWith('image/')) {
          files.push({
            name: nameMatch ? nameMatch[1] : 'file',
            type: typeMatch[1].trim(),
            data: Buffer.from(body, 'binary').toString('base64'),
          });
        }
      });
      resolve({ files });
    });
    req.on('error', reject);
  });
}

// ── JSON response helper ──
function jsonRes(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

// ── AI availability guard ──
// Call at the top of each AI handler. Returns true (and writes 503) if AI is unavailable,
// so the caller can simply: `if (!aiAvailable(res)) return;`
function aiAvailable(res) {
  if (!process.env.OPENAI_API_KEY) {
    jsonRes(res, {
      error: 'AI service unavailable',
      reply: 'The AI assistant is temporarily offline. Please try again later or contact support.',
    }, 503);
    return false;
  }
  return true;
}

// ══════════════════════════════════════════════════════════════════════════
// API HANDLERS
// ══════════════════════════════════════════════════════════════════════════

/* ── /api/agent — Dubi Agent chat ── */
async function handleAgent(req, res) {
  if (!aiAvailable(res)) return;
  const { message, history = [] } = await parseBody(req);
  if (!message) return jsonRes(res, { reply: 'Please send a message.' }, 400);

  const systemPrompt = `You are Dubi Agent, a friendly and knowledgeable AI assistant for DUBIMOTORS — the UAE's leading marketplace for buying and selling cars, boats, motorcycles, and jet skis.

Your role is to:
- Help users find the right vehicle from the LIVE LISTINGS below based on their needs and budget
- Explain how to place ads, listing packages (Basic: Free 30 days, Featured: AED 99 30 days, Premium: AED 249 60 days)
- Explain how to contact sellers (Call or WhatsApp buttons on listings)
- Answer questions about car finance, insurance, and inspections in the UAE
- Provide general advice about buying/selling vehicles in the UAE
- Help with understanding listing details, specs, and prices
- Be concise, warm, and professional. Use short paragraphs.
- Always respond in the same language the user writes in.

CRITICAL RULES FOR LISTINGS:
- When the user asks about prices, cheapest/most expensive, specific cars, or what's available, ALWAYS answer using the LIVE LISTINGS catalog below — never invent vehicles or prices.
- When recommending a specific vehicle, mention the make, model, year, and price exactly as listed.
- If you mention a specific vehicle, also tell the user they can click "Details" on the listing card to see full info, photos, and contact the seller.
- If asked something the catalog doesn't cover (e.g. "do you have a 2020 BMW 3 Series?"), say so honestly and offer to help them browse a category.
- For general UAE market questions ("how much does insurance cost?"), use your general knowledge — these aren't about listings.

LIVE LISTINGS CATALOG (${DM?.listings?.length || 0} active listings):
${AGENT_CATALOG}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-8).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      max_tokens: 400,
      temperature: 0.7,
    });
    const reply = completion.choices[0].message.content;
    jsonRes(res, { reply });
  } catch (e) {
    console.error('Agent error:', e.message);
    jsonRes(res, { reply: "I'm having a moment — please try again shortly!" });
  }
}

/* ── /api/analyze-photos — AI photo vehicle detection ── */
async function handleAnalyzePhotos(req, res) {
  if (!aiAvailable(res)) return;
  const { files } = await parseMultipart(req);
  if (!files.length) return jsonRes(res, { error: 'No photos received.' }, 400);

  const imageContent = files.slice(0, 4).map(f => ({
    type: 'image_url',
    image_url: { url: `data:${f.type};base64,${f.data}`, detail: 'high' }
  }));

  const prompt = `You are an elite automotive identification AI with encyclopedic knowledge of every vehicle make, model, trim, and variant ever produced. Analyze ALL provided photos with extreme attention to detail.

Your PRIMARY OBJECTIVE is to identify the EXACT TRIM LEVEL. This is the most important field. Look for:
- Badges on the grille, trunk lid, side panels, steering wheel, and door sills
- Wheel design (AMG multi-spoke, M star-spoke, RS mesh, etc.)
- Brake caliper color (red = AMG/M/Brembo, yellow = Porsche/Lambo)
- Body kit differences (AMG has wider arches, M has flared fenders)
- Interior details (M stitching, AMG carbon trim, RS Alcantara)
- Exhaust tip shape and count
- Headlight/taillight design generation

TRIM IDENTIFICATION EXAMPLES:
- BMW with blue/red M badge on grille + M-specific wheels = M3, M5, M4 etc. Trim = "M Competition" or "M Pure"
- Mercedes with AMG badge + quad exhausts + wide body = C63 AMG, E63 AMG etc. Trim = "AMG C63 S"
- Audi with honeycomb grille + RS badge = RS3, RS5, RS6. Trim = "RS" + model
- VW Golf with red GTI badge on grille = Golf GTI. Trim = "GTI"
- Porsche with GT3 wing = 911 GT3. Trim = "GT3" or "GT3 RS"
- Range Rover with Autobiography badge = Range Rover Autobiography
- Toyota Land Cruiser with GR Sport badge = Land Cruiser GR Sport
- Kia Sportage with GT-Line badge = Sportage GT-Line
- If no performance badge visible, use the highest standard trim for that year: e.g. "EX", "Limited", "Sport", "Prestige"

Return ONLY a valid JSON object with NO markdown:
{
  "brand": "Exact manufacturer — e.g. BMW, Mercedes-Benz, Toyota, Kia",
  "model": "Specific model — e.g. M3, C-Class, Land Cruiser 300, Sportage",
  "trim": "EXACT trim variant — e.g. M Competition, AMG C63 S, GT3 RS, GTI, Limited Edition, EX Premium. NEVER return empty string or null. If uncertain use the most likely trim for this model year.",
  "year": "4-digit model year based on design generation and facelift details",
  "condition": "Brand New or Used",
  "exteriorColor": "Specific paint color — e.g. Obsidian Black, Polar White, Nardo Grey, Misano Red. Use manufacturer color names when identifiable.",
  "interiorColor": "Interior color — e.g. Black, Cognac, Red, Beige, Brown",
  "bodyType": "SUV, Sedan, Coupe, Hatchback, Convertible, Pickup, Van, or Wagon",
  "engine": "Engine spec — e.g. 3.0L Inline-6 TwinPower Turbo, 4.0L V8 Biturbo",
  "transmission": "Automatic or Manual",
  "fuelType": "Petrol, Diesel, Hybrid, or Electric — based on the engine type and badges",
  "hp": "Horsepower as integer string for this exact trim",
  "cylinders": "Number of cylinders as string (use 0 for electric)",
  "doors": "Number of doors as string",
  "seats": "Number of seats as string",
  "confidence": "high/medium/low"
}

ABSOLUTE RULES:
- TRIM must NEVER be empty. Always provide a specific trim name.
- EXTERIOR COLOR is always determinable from exterior photos.
- BODY TYPE is always determinable from the vehicle shape.
- Do NOT include regionalSpec in your response.
- Return ONLY the raw JSON object.`;

  try {
    const completion = await openai.chat.completions.create({
      model: AI_VISION_MODEL,
      messages: [{
        role: 'user',
        content: [{ type: 'text', text: prompt }, ...imageContent]
      }],
      max_tokens: 600,
    });
    const text = completion.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      jsonRes(res, data);
    } else {
      jsonRes(res, { error: 'Could not parse vehicle data from photos.' }, 422);
    }
  } catch (e) {
    console.error('Photo analysis error:', e.message);
    jsonRes(res, { error: 'Photo analysis failed. Please try again.' }, 500);
  }
}

/* ── /api/vin-lookup — VIN decode ── */
// ── Helper: decode VIN via NHTSA free public API ──
async function decodeVinNHTSA(vin) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;
  const text = await fetchUrl(url);
  if (!text) return null;
  try {
    const data = JSON.parse(text);
    const results = data.Results || [];
    const get = (variable) => {
      const r = results.find(x => x.Variable === variable);
      return (r && r.Value && r.Value !== 'null' && r.Value !== 'Not Applicable') ? r.Value : null;
    };

    const make = get('Make');
    const model = get('Model');
    const year = get('Model Year');
    // Must have at least make + model to be useful
    if (!make || !model) return null;

    const cylinders = get('Engine Number of Cylinders');
    const dispL = get('Displacement (L)');
    const hpFrom = get('Engine Brake (hp) From');
    const hpTo = get('Engine Brake (hp) To');
    const hp = hpFrom ? (hpTo && hpTo !== hpFrom ? `${hpFrom}-${hpTo}` : hpFrom) : null;
    const fuelType = get('Fuel Type - Primary');
    const engineConfig = get('Engine Configuration');
    const turbo = get('Turbo');
    const isTurbo = turbo && turbo.toLowerCase().includes('yes');
    const series = get('Series') || get('Series 2');
    const trim = get('Trim') || get('Trim2') || series || null;
    const bodyClass = get('Body Class');
    const doors = get('Doors');
    const seats = get('Number of Seats');
    const transStyle = get('Transmission Style');
    const transSpeeds = get('Transmission Speeds');
    const transmission = transStyle ? (transSpeeds ? `${transSpeeds}-speed ${transStyle}` : transStyle) : null;
    const driveType = get('Drive Type');
    const country = get('Plant Country');
    const plant = get('Plant City');

    // Build engine description
    let engine = null;
    if (dispL) {
      const dispRound = parseFloat(dispL).toFixed(1);
      const configShort = engineConfig === 'V-Shaped' ? 'V' + cylinders : engineConfig === 'In-Line' ? 'Inline-' + cylinders : (engineConfig || '');
      const turboStr = isTurbo ? ' Turbo' : '';
      const fuelStr = fuelType === 'Gasoline' ? '' : (fuelType ? ` ${fuelType}` : '');
      engine = `${dispRound}L ${configShort}${turboStr}${fuelStr}`.trim();
    }

    return {
      brand: make.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
      model,
      trim: trim || null,
      year: year || null,
      bodyType: bodyClass || null,
      engine: engine || null,
      transmission: transmission || null,
      cylinders: cylinders || null,
      hp: hp || null,
      condition: 'Used',
      country: country || 'Italy',
      plant: plant || null,
      doors: doors || null,
      seats: seats || null,
      source: 'nhtsa'
    };
  } catch (e) {
    return null;
  }
}

async function handleVINLookup(req, res) {
  const { vin } = await parseBody(req);
  if (!vin || vin.length !== 17) return jsonRes(res, { error: 'Invalid VIN. Must be 17 characters.' }, 400);

  // Step 1: Try NHTSA API (free, accurate, no key needed)
  try {
    const nhtsaResult = await decodeVinNHTSA(vin);
    if (nhtsaResult && nhtsaResult.brand && nhtsaResult.model) {
      // NHTSA succeeded — enrich with AI for any missing fields (trim, hp if not in NHTSA)
      const missing = [];
      if (!nhtsaResult.trim) missing.push('trim');
      if (!nhtsaResult.hp) missing.push('hp');
      if (!nhtsaResult.engine) missing.push('engine');

      if (missing.length > 0) {
        // Ask AI to fill in only the missing fields
        const enrichPrompt = `For a ${nhtsaResult.year} ${nhtsaResult.brand} ${nhtsaResult.model} with VIN ${vin}, provide ONLY these missing fields as JSON:
${missing.map(f => `"${f}": "..."`).join(',\n')}
Return ONLY the JSON object with those fields.`;
        try {
          const completion = await openai.chat.completions.create({
            model: AI_TEXT_MODEL,
            messages: [{ role: 'user', content: enrichPrompt }],
            max_tokens: 150,
          });
          const enrichText = completion.choices[0].message.content.trim();
          const enrichMatch = enrichText.match(/\{[\s\S]*\}/);
          if (enrichMatch) {
            const enriched = JSON.parse(enrichMatch[0]);
            for (const f of missing) {
              if (enriched[f]) nhtsaResult[f] = enriched[f];
            }
          }
        } catch (_) { /* enrichment optional */ }
      }

      return jsonRes(res, nhtsaResult);
    }
  } catch (e) {
    console.error('NHTSA lookup error:', e.message);
  }

  // Step 2: Fallback to Gemini 2.5 Flash if NHTSA fails
  const prompt = `You are a professional automotive VIN decoder. Decode this VIN precisely: ${vin}

Return ONLY this JSON object:
{
  "brand": "Exact manufacturer name",
  "model": "Exact model name — be specific (e.g. F8 Spider not just F8)",
  "trim": "Exact trim/variant",
  "year": "Model year as 4-digit string",
  "bodyType": "Body style e.g. Sedan, Coupe, SUV, Convertible",
  "engine": "Engine description e.g. 3.9L V8 Twin-Turbo",
  "transmission": "Automatic or Manual",
  "cylinders": "Number of cylinders as string",
  "hp": "Horsepower as string",
  "condition": "Used",
  "country": "Country of manufacture",
  "doors": "Number of doors as string",
  "seats": "Number of seats as string"
}
If the VIN is invalid: {"error": "VIN not recognized. Please check and try again."}
Return ONLY the raw JSON object.`;

  try {
    const completion = await openai.chat.completions.create({
      model: AI_TEXT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    });
    const text = completion.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonRes(res, JSON.parse(jsonMatch[0]));
    } else {
      jsonRes(res, { error: 'Could not decode VIN.' }, 422);
    }
  } catch (e) {
    console.error('VIN lookup error:', e.message);
    jsonRes(res, { error: 'VIN lookup service unavailable. Please try again.' }, 500);
  }
}

/* ── /api/mulkiya-scan — Scan UAE Mulkiya (registration card) for VIN ── */
async function handleMulkiyaScan(req, res) {
  if (!aiAvailable(res)) return;
  const { files } = await parseMultipart(req);
  if (!files.length) return jsonRes(res, { error: 'No image received.' }, 400);

  const imageContent = [{
    type: 'image_url',
    image_url: { url: `data:${files[0].type};base64,${files[0].data}`, detail: 'high' }
  }];

  const prompt = `You are scanning a UAE vehicle registration card (Mulkiya / \u0645\u0644\u0643\u064a\u0629). The image may be partial, cropped, blurry, or only show part of the card.

YOUR PRIMARY GOAL: Find the Chassis Number at ALL costs. It may be labeled:
- "Chassis No."
- "\u0631\u0642\u0645 \u0627\u0644\u0642\u0627\u0639\u062f\u0629" (Arabic)
- "VIN"
- As a barcode or QR code area
- A 17-character alphanumeric string (e.g. SBM14ACB4RW007241)

Even if the image is half-cut, upside down, or partially visible, scan every character visible and attempt to extract the Chassis Number. A partial chassis number is better than nothing.

Also extract any other visible fields:
{
  "vin": "Chassis Number (17 chars if complete, or partial if only part is visible)",
  "make": "Vehicle brand/make (e.g. MCLAREN, TOYOTA, BMW)",
  "model": "Vehicle model (e.g. 750S, Land Cruiser)",
  "year": "Model year as 4-digit string (from \u0633\u0646\u0629 \u0627\u0644\u0635\u0646\u0639 field)",
  "color": "Vehicle color (from \u0644\u0648\u0646 \u0627\u0644\u0645\u0631\u0643\u0628\u0629 field)",
  "plateNumber": "Plate number if visible",
  "owner": "Owner name if visible"
}

IMPORTANT: Never return an error just because the image is partial. Always attempt to extract the Chassis Number. Return ONLY the raw JSON object.`;

  try {
    const completion = await openai.chat.completions.create({
      model: AI_VISION_MODEL,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, ...imageContent] }],
      max_tokens: 400,
    });
    const text = completion.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Always return whatever we found, even if vin is partial
      jsonRes(res, parsed);
    } else {
      // Try to extract chassis number directly from raw text
      const chassisMatch = text.match(/[A-HJ-NPR-Z0-9]{5,17}/);
      if (chassisMatch) {
        jsonRes(res, { vin: chassisMatch[0] });
      } else {
        jsonRes(res, { error: 'Could not find the Chassis Number in this image. Please upload a clearer photo showing the Chassis No. field.' }, 422);
      }
    }
  } catch (e) {
    console.error('Mulkiya scan error:', e.message);
    jsonRes(res, { error: 'Mulkiya scan failed. Please try again.' }, 500);
  }
}

/* ── /api/price-estimate — AI market price estimation ── */
// ── Scrape live prices from Dubicars ──
// ── Helper: fetch a URL and return body text ──
function fetchUrl(url) {
  const https = require('https');
  const http = require('http');
  const lib = url.startsWith('https') ? https : http;
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 12000,
    };
    lib.get(url, options, (res2) => {
      let data = '';
      res2.on('data', c => data += c);
      res2.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

// ── Extract AED prices from page text, filtered by year ──
function extractAedPrices(text, brand, model, year) {
  const USD_TO_AED = 3.6725;
  const targetYear = parseInt(year);
  const prices = [];

  // Strategy 1: "Brand Model YEAR" followed by AED price (handles multi-word models)
  // Use case-insensitive brand/model matching
  const brandEsc = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const modelEsc = model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const patAed = new RegExp(
    `${brandEsc}\\s+${modelEsc}\\s+(\\d{4})[\\s\\S]{0,600}?AED[\\s]*(\\d[\\d,]+)`,
    'gi'
  );
  for (const m of text.matchAll(patAed)) {
    const yr = parseInt(m[1]);
    const aed = parseInt(m[2].replace(/,/g, ''));
    if (aed > 5000 && aed < 50000000) prices.push({ year: yr, aed });
  }

  // Strategy 2: "Brand Model YEAR" followed by USD price
  const patUsd = new RegExp(
    `${brandEsc}\\s+${modelEsc}\\s+(\\d{4})[\\s\\S]{0,600}?\\$([\\d,]+)`,
    'gi'
  );
  for (const m of text.matchAll(patUsd)) {
    const yr = parseInt(m[1]);
    const usd = parseInt(m[2].replace(/,/g, ''));
    if (usd > 5000 && usd < 15000000) prices.push({ year: yr, aed: Math.round(usd * USD_TO_AED) });
  }

  // Strategy 3: Fallback — all AED prices on the page (used when no year-specific match)
  if (prices.length === 0) {
    const allAed = [...text.matchAll(/AED\s*(\d[\d,]+)/g)]
      .map(m => parseInt(m[1].replace(/,/g, '')))
      .filter(p => p > 5000 && p < 50000000);
    const allUsd = [...text.matchAll(/\$([\d,]+)/g)]
      .map(m => parseInt(m[1].replace(/,/g, '')))
      .filter(p => p > 5000 && p < 15000000)
      .map(p => Math.round(p * USD_TO_AED));
    for (const aed of [...allAed, ...allUsd]) {
      prices.push({ year: targetYear, aed });
    }
  }

  // Filter by year preference
  let filtered = prices.filter(p => p.year === targetYear);
  if (filtered.length < 2) filtered = prices.filter(p => Math.abs(p.year - targetYear) <= 2);
  if (filtered.length === 0) filtered = prices;

  return [...new Set(filtered.map(p => p.aed))].sort((a, b) => a - b);
}

async function scrapeDubicarsPrice(brand, model, year) {
  const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const modelSlug = model.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const url = `https://www.dubicars.com/uae/used/${brandSlug}/${modelSlug}`;

  const text = await fetchUrl(url);
  if (!text) return { prices: [], url, count: 0 };

  const prices = extractAedPrices(text, brand, model, year);
  return { prices, url, count: prices.length };
}

async function handlePriceEstimate(req, res) {
  if (!aiAvailable(res)) return;
  const { brand, model, trim, year, km, condition, regionalSpec } = await parseBody(req);
  if (!brand || !model || !year) return jsonRes(res, { error: 'Brand, model and year are required.' }, 400);

  const vehicleDesc = [year, brand, model, trim].filter(Boolean).join(' ');
  const kmNum = km ? parseInt(km) : null;

  // Step 1: Scrape real live prices from Dubicars (fast, but may fail/rot)
  const scraped = await scrapeDubicarsPrice(brand, model, year);
  const liveData = scraped.prices;

  // Step 2: Also query our OWN listings DB for the same make/model/year ± 2
  // Far more reliable than third-party scraping over time.
  let internalPrices = [];
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const yearNum = parseInt(year);
      const url = new URL(`${process.env.SUPABASE_URL}/rest/v1/listings`);
      url.searchParams.set('select', 'price,year,trim,regional_spec');
      url.searchParams.set('make', `ilike.${brand}`);
      url.searchParams.set('model', `ilike.%${model}%`);
      url.searchParams.set('year', `gte.${yearNum - 2}`);
      url.searchParams.set('status', 'eq.active');
      const dbRes = await fetch(url.toString(), {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      if (dbRes.ok) {
        const rows = await dbRes.json();
        // Filter to within ±2 years and (if regionalSpec given) same spec
        internalPrices = rows
          .filter(r => Math.abs((r.year || 0) - yearNum) <= 2)
          .filter(r => !regionalSpec || !r.regional_spec || r.regional_spec === regionalSpec)
          .map(r => r.price)
          .filter(p => p && p > 5000 && p < 50000000);
      }
    }
  } catch (e) {
    console.warn('Internal price lookup failed:', e.message);
  }

  // Combine all available real-world prices
  const allPrices = [...liveData, ...internalPrices].sort((a, b) => a - b);

  // Step 3: Build AI prompt with real data if available
  let priceContext = '';
  if (allPrices.length > 0) {
    const low = allPrices[0];
    const high = allPrices[allPrices.length - 1];
    const median = allPrices[Math.floor(allPrices.length / 2)];
    priceContext = `REAL CURRENT UAE LISTINGS:\n- ${liveData.length} found on Dubicars, ${internalPrices.length} on DubiMotors\n- Prices range: AED ${low.toLocaleString()} to AED ${high.toLocaleString()}\n- Typical price: AED ${median.toLocaleString()}\n- All prices: ${allPrices.map(p => 'AED ' + p.toLocaleString()).join(', ')}\n\nUse these REAL prices as your base.`;
  } else {
    priceContext = `No live listings found for this exact model. Use your knowledge of UAE market prices for ${vehicleDesc}.`;
  }

  const mileageNote = kmNum
    ? (kmNum > 100000 ? 'High mileage (over 100k km): reduce price by 15-25%'
      : kmNum > 50000 ? 'Moderate mileage (50k-100k km): reduce price by 5-10%'
      : kmNum > 20000 ? 'Normal mileage: minimal impact'
      : 'Very low mileage: slight premium possible')
    : 'Mileage unknown';

  const specNote = regionalSpec
    ? `Regional spec: ${regionalSpec}. ${regionalSpec === 'GCC Specs' ? 'GCC spec commands the highest premium in UAE — full warranty, A/C tuned for region.' : regionalSpec === 'American Specs' ? 'American/US spec sells for ~10-15% less in UAE.' : regionalSpec === 'European Specs' ? 'European spec sells for slightly less than GCC.' : 'Non-GCC spec typically sells for 10-20% less than GCC.'}`
    : 'Regional spec not specified.';

  const prompt = `You are a UAE used car market pricing expert with deep knowledge of current Dubai/UAE market prices.

Vehicle to price:
- Make/Model/Trim: ${vehicleDesc}
- Condition: ${condition || 'Used'}
- Mileage: ${kmNum ? kmNum.toLocaleString() + ' km' : 'unknown'}
- ${specNote}

${priceContext}

IMPORTANT PRICING RULES:
1. ${mileageNote}
2. Give USED market prices (not new/dealer prices) unless condition is "New"
3. Be CONSERVATIVE and REALISTIC — do not overestimate
4. For exotic/luxury cars (Ferrari, Lamborghini, McLaren, Porsche, etc.), used prices in UAE are typically 30-50% below new MSRP
5. A 2023 Ferrari SF90 Stradale used = approx AED 1.4M-1.6M (not 2.8M+)
6. Always factor in the specific trim level — higher trims command 5-20% premium
7. Factor in regional spec impact on the final number

Return ONLY this JSON (no markdown, no explanation):
{
  "low": <lowest realistic AED used price as integer>,
  "high": <highest realistic AED used price as integer>,
  "median": <most likely AED price as integer>,
  "insight": "<2-3 sentences about current UAE market for this specific vehicle, mentioning realistic price range>",
  "demand": "<High/Medium/Low>",
  "source": "${allPrices.length > 0 ? `UAE market data (${allPrices.length} live listings)` : 'UAE market analysis'}"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: AI_TEXT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });
    const text = completion.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      if (data.low > 5000 && data.high < 50000000) {
        jsonRes(res, data);
      } else {
        jsonRes(res, { error: 'Price estimate out of range.' }, 422);
      }
    } else {
      jsonRes(res, { error: 'Could not estimate price.' }, 422);
    }
  } catch (e) {
    console.error('Price estimate error:', e.message);
    jsonRes(res, { error: 'Price estimation unavailable. Please try again.' }, 500);
  }
}

// ══════════════════════════════════════════════════════════════════════════
/* ── /api/suggest-features — AI auto-suggest car feature lists ──
 *
 * Given a vehicle's category/make/model/trim/year, returns three lists of
 * features (Safety, Comfort, Technology) that the trim is COMMONLY equipped
 * with. The seller then unticks anything their specific car doesn't have.
 *
 * Input:  { category, make, model, trim, year, body_type }
 * Output: { features: { safety: string[], comfort: string[], tech: string[] } }
 *
 * Cost: ~$0.003 per call (gpt-4.1-mini, ~600 tokens in/out).
 */
async function handleSuggestFeatures(req, res) {
  if (!aiAvailable(res)) return;

  let body = {};
  try {
    body = await parseBody(req);
  } catch {
    return jsonRes(res, { error: 'Invalid JSON' }, 400);
  }

  const { category, make, model, trim, year, body_type } = body;
  if (!category || !make || !model) {
    return jsonRes(res, { error: 'category, make, and model are required.' }, 400);
  }

  // For non-vehicle categories (plates, accessories), features panel doesn't
  // apply — return empty lists and let the client skip the section.
  if (category === 'plates' || category === 'accessories') {
    return jsonRes(res, { features: { safety: [], comfort: [], tech: [] } });
  }

  const vehicleDescriptor = [year, make, model, trim].filter(Boolean).join(' ');
  const bodyDescriptor = body_type ? ` (${body_type})` : '';

  // Map category to natural-language descriptor for the prompt
  const categoryLabel = {
    cars: 'car',
    bikes: 'motorcycle',
    boats: 'boat',
    jetski: 'jet ski',
    heavy: 'heavy vehicle',
  }[category] || 'vehicle';

  const prompt = `You are an automotive expert. List the features that a ${vehicleDescriptor}${bodyDescriptor} ${categoryLabel} is TYPICALLY equipped with from the factory for its trim level.

Return a JSON object with three arrays:
- "safety": Driver assistance and safety features (e.g. "Adaptive Cruise Control", "Lane Keep Assist", "Blind Spot Monitoring", "360° Camera", "Automatic Emergency Braking")
- "comfort": Comfort and convenience features (e.g. "Heated Seats", "Ventilated Seats", "Panoramic Sunroof", "Power Tailgate", "Memory Seats", "Quad-Zone Climate Control")
- "tech": Technology and infotainment (e.g. "Apple CarPlay", "Android Auto", "Wireless Charging", "Head-Up Display", "Premium Sound System (e.g. Harman Kardon)", "Digital Instrument Cluster")

Rules:
- Be specific to this exact trim level. A base trim should NOT list features only available on top trims.
- Each feature should be 2-6 words. No marketing fluff.
- Include 4-8 items per array. If a category genuinely has fewer relevant features for this vehicle, return what's appropriate — don't pad.
- Use UAE/GCC market trim names if the vehicle is sold in the UAE.
- Respond with ONLY the JSON object, no preamble or commentary.

Example for "2023 BMW X5 xDrive40i M Sport":
{"safety":["Adaptive Cruise Control","Lane Departure Warning","Blind Spot Detection","360° Surround View Camera","Automatic Emergency Braking","Parking Assistant"],"comfort":["Power Sport Seats","Heated Front Seats","Panoramic Sunroof","Power Tailgate","Quad-Zone Climate Control","Ambient Lighting"],"tech":["Apple CarPlay (Wireless)","Android Auto","Wireless Charging","Head-Up Display","Harman Kardon Sound","Digital Instrument Cluster","BMW Live Cockpit Pro"]}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });
    const raw = completion.choices[0].message.content;
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }

    // Normalize: ensure each array is a clean array of strings (defensive parse)
    const clean = (arr) => Array.isArray(arr)
      ? arr.filter(s => typeof s === 'string' && s.trim()).map(s => s.trim()).slice(0, 12)
      : [];

    const features = {
      safety: clean(parsed.safety),
      comfort: clean(parsed.comfort),
      tech: clean(parsed.tech),
    };
    jsonRes(res, { features });
  } catch (e) {
    console.error('Suggest features error:', e.message);
    jsonRes(res, { features: { safety: [], comfort: [], tech: [] } });
  }
}

// ══════════════════════════════════════════════════════════════════════════
//* ── /api/verify-listing — AI listing verification + email confirmation ── */

// Email transporter (uses SMTP env vars; gracefully skips if not configured)
function createMailTransporter() {
  if (!process.env.SMTP_HOST && !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendVerificationEmail(to, listingData) {
  const transporter = createMailTransporter();
  if (!transporter || !to) return false;
  const { brand, model, trim, year, price, name } = listingData;
  const vehicleTitle = [year, brand, model, trim].filter(Boolean).join(' ');
  const priceFormatted = price ? 'AED ' + parseInt(price).toLocaleString() : 'Price not specified';
  try {
    await transporter.sendMail({
      from: `"DubiMotors" <${process.env.SMTP_USER}>`,
      to,
      subject: `Your listing is live: ${vehicleTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          <div style="background:#111;padding:24px 32px;">
            <div style="color:#fff;font-size:22px;font-weight:900;">DUBI<span style="color:#E8450A;">MOTORS</span></div>
          </div>
          <div style="padding:32px;">
            <div style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
              <span style="font-size:24px;">&#x1F916;</span>
              <div>
                <div style="font-size:16px;font-weight:700;color:#2E7D32;">Verified by AI</div>
                <div style="font-size:13px;color:#388E3C;">Your listing has passed our AI verification check</div>
              </div>
            </div>
            <h2 style="font-size:22px;font-weight:900;color:#111;margin:0 0 8px;">Your listing is now live!</h2>
            <p style="color:#666;font-size:15px;margin:0 0 24px;">Hi ${name || 'there'}, your vehicle listing has been verified and published on DubiMotors.</p>
            <div style="background:#F8F8F8;border-radius:12px;padding:20px;margin-bottom:24px;">
              <div style="font-size:18px;font-weight:800;color:#111;margin-bottom:6px;">${vehicleTitle}</div>
              <div style="font-size:20px;font-weight:900;color:#E8450A;">${priceFormatted}</div>
            </div>
            <p style="color:#666;font-size:14px;line-height:1.7;">Buyers can now find your listing on DubiMotors. You will receive inquiries directly to your phone number. Make sure to respond promptly to maximize your chances of a quick sale.</p>
            <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#999;">
              DubiMotors &mdash; UAE's AI-Powered Vehicle Marketplace<br>
              <a href="https://dubimotors.onrender.com" style="color:#E8450A;">dubimotors.onrender.com</a>
            </div>
          </div>
        </div>`,
    });
    return true;
  } catch (e) {
    console.error('Email send error:', e.message);
    return false;
  }
}

async function handleVerifyListing(req, res) {
  if (!aiAvailable(res)) return;
  const body = await parseBody(req);
  const { brand, model, trim, year, price, km, condition, desc, location, name, phone, email } = body;

  if (!brand || !model || !price) {
    return jsonRes(res, { approved: false, reason: 'Brand, model, and price are required.' }, 400);
  }

  const vehicleDesc = [year, brand, model, trim].filter(Boolean).join(' ');
  const priceNum = parseInt(price);

  // Basic sanity checks before AI
  if (priceNum < 100 || priceNum > 100000000) {
    return jsonRes(res, { approved: false, reason: 'The price entered seems unrealistic. Please enter a valid AED price.' });
  }

  const prompt = `You are a listing verification AI for DubiMotors, a UAE vehicle marketplace. Your job is to detect low-quality, irrelevant, or suspicious listings.

Listing details:
- Vehicle: ${vehicleDesc}
- Price: AED ${priceNum.toLocaleString()}
- Mileage: ${km ? km + ' km' : 'not specified'}
- Condition: ${condition || 'not specified'}
- Location: ${location || 'not specified'}
- Description: ${desc ? desc.substring(0, 500) : 'not provided'}
- Seller name: ${name || 'not provided'}
- Phone: ${phone || 'not provided'}

Check for these issues:
1. PRICING: Price seems unrealistic for the vehicle (e.g. AED 500 for a car, AED 1000 for a yacht)
2. WRONG CATEGORY: Item is clearly not a vehicle (e.g. a house, phone, or job listing)
3. SPAM/IRRELEVANT: Description contains unrelated content, excessive links, or promotional spam
4. IMPOSSIBLE SPECS: Year is beyond 2027, mileage is negative, or specs are nonsensical
5. PLACEHOLDER TEXT: Generic placeholder like "test", "aaa", "xxx", "asdf" in title or description
6. MISSING CRITICAL INFO: Brand is unknown or model doesn't exist for that brand

Approve if it looks like a genuine vehicle listing, even if some details are missing.
Reject only if there are clear issues.

IMPORTANT — when writing the rejection reason, use professional, neutral language. Address the seller directly. Do NOT use words like "scam", "fake", or "fraud" — these are accusatory. Instead, describe the issue factually: "the price seems too low for this vehicle", "the listing appears to be missing key details", "the description contains placeholder text", etc.

Return ONLY this JSON:
{
  "approved": true or false,
  "reason": "Brief, neutral explanation if rejected, or empty string if approved",
  "confidence": "high/medium/low"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });
    const text = completion.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      if (result.approved) {
        // Send confirmation email asynchronously (don't block response)
        sendVerificationEmail(email, { brand, model, trim, year, price, name }).catch(() => {});
        return jsonRes(res, {
          approved: true,
          message: `Your ${vehicleDesc} listing has been verified and is now live on DubiMotors. Serious buyers will contact you directly.`,
          verifiedAt: new Date().toISOString(),
        });
      } else {
        return jsonRes(res, {
          approved: false,
          reason: result.reason || 'Your listing did not pass our verification check.',
        });
      }
    } else {
      // If AI response is unclear, approve by default (fail open)
      sendVerificationEmail(email, { brand, model, trim, year, price, name }).catch(() => {});
      return jsonRes(res, {
        approved: true,
        message: `Your ${vehicleDesc} listing has been verified and is now live on DubiMotors.`,
      });
    }
  } catch (e) {
    console.error('Verify listing error:', e.message);
    // On AI error, approve and continue (don't block sellers)
    sendVerificationEmail(email, { brand, model, trim, year, price, name }).catch(() => {});
    return jsonRes(res, {
      approved: true,
      message: `Your ${vehicleDesc} listing has been submitted and is now live on DubiMotors.`,
    });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// EMAIL VERIFICATION & TRANSACTIONAL EMAIL ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════
const crypto = require('crypto');
const emailModule = require('./email-module.js');
const { getSupabaseAdmin } = require('./supabase-admin.js');

function sha256Hex(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

// Generate a fresh URL-safe random token + its SHA-256 hash
function newToken() {
  const raw = crypto.randomBytes(32).toString('base64url'); // url-safe
  return { raw, hash: sha256Hex(raw) };
}

/**
 * Authenticate a request via the Authorization: Bearer <jwt> header.
 * Returns the user object from Supabase auth, or null if invalid.
 *
 * The JWT is the access_token from the user's Supabase session, sent by the
 * frontend in the Authorization header.
 */
async function getUserFromRequest(req) {
  const supa = getSupabaseAdmin();
  if (!supa) return null;
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;
  try {
    const { data, error } = await supa.auth.getUser(token);
    if (error || !data || !data.user) return null;
    return data.user;
  } catch (e) {
    console.warn('[auth] getUserFromRequest failed:', e.message);
    return null;
  }
}

/* ── POST /api/send-welcome-email — fired right after signup ──
   Body: { user_id }
   Auth: requires Authorization Bearer token (the just-signed-up user's session)
*/
async function handleSendWelcomeEmail(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  const user = await getUserFromRequest(req);
  if (!user) return jsonRes(res, { error: 'Not authenticated' }, 401);

  // Generate token, store hash
  const { raw, hash } = newToken();
  const { error: insErr } = await supa
    .from('verification_tokens')
    .insert({ user_id: user.id, token_hash: hash, purpose: 'signup' });
  if (insErr) {
    console.error('[welcome] token insert failed:', insErr.message);
    return jsonRes(res, { error: 'Could not create token' }, 500);
  }

  // Pull display name from profile (trigger created it at signup)
  const { data: profile } = await supa.from('profiles').select('display_name').eq('id', user.id).maybeSingle();
  const displayName = (profile && profile.display_name) || (user.email && user.email.split('@')[0]) || '';

  const verifyUrl = `${emailModule.SITE_URL}/verify-email.html?token=${encodeURIComponent(raw)}`;
  const tpl = emailModule.welcomeEmail({ name: displayName, verifyUrl });
  const result = await emailModule.sendEmail({ to: user.email, ...tpl });

  if (!result.ok) return jsonRes(res, { error: result.error || 'Send failed' }, 500);
  return jsonRes(res, { ok: true, disabled: result.disabled || false });
}

/* ── POST /api/send-verification-email — on-demand (gate-triggered resend) ──
   Body: { reason }       reason: 'place-ad' | 'contact' | (any string)
   Auth: requires Authorization Bearer token
*/
async function handleSendVerificationEmail(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  const user = await getUserFromRequest(req);
  if (!user) return jsonRes(res, { error: 'Not authenticated' }, 401);

  let body = {};
  try { body = await parseBody(req); } catch {}
  const reason = String(body.reason || '').slice(0, 32);

  // Already verified? Don't bother sending.
  const { data: profile } = await supa
    .from('profiles')
    .select('email_verified_at, display_name')
    .eq('id', user.id)
    .maybeSingle();
  if (profile && profile.email_verified_at) {
    return jsonRes(res, { ok: true, alreadyVerified: true });
  }

  const { raw, hash } = newToken();
  const { error: insErr } = await supa
    .from('verification_tokens')
    .insert({ user_id: user.id, token_hash: hash, purpose: 'on_demand' });
  if (insErr) {
    console.error('[verify] token insert failed:', insErr.message);
    return jsonRes(res, { error: 'Could not create token' }, 500);
  }

  const displayName = (profile && profile.display_name) || (user.email && user.email.split('@')[0]) || '';
  const verifyUrl = `${emailModule.SITE_URL}/verify-email.html?token=${encodeURIComponent(raw)}`;
  const tpl = emailModule.verificationEmail({ name: displayName, verifyUrl, reason });
  const result = await emailModule.sendEmail({ to: user.email, ...tpl });

  if (!result.ok) return jsonRes(res, { error: result.error || 'Send failed' }, 500);
  return jsonRes(res, { ok: true, disabled: result.disabled || false });
}

/* ── GET /api/verify-email?token=xxx — public, validates token, marks verified ── */
async function handleVerifyEmailToken(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { ok: false, error: 'Service unavailable' }, 503);

  // Parse token from query string
  const idx = req.url.indexOf('?');
  const qs = idx >= 0 ? req.url.slice(idx + 1) : '';
  const params = new URLSearchParams(qs);
  const raw = params.get('token');
  if (!raw) return jsonRes(res, { ok: false, error: 'Missing token' }, 400);

  const hash = sha256Hex(raw);
  const { data: tokenRow, error: tErr } = await supa
    .from('verification_tokens')
    .select('id, user_id, expires_at, used_at')
    .eq('token_hash', hash)
    .maybeSingle();

  if (tErr) {
    console.error('[verify] token lookup failed:', tErr.message);
    return jsonRes(res, { ok: false, error: 'Server error' }, 500);
  }
  if (!tokenRow) return jsonRes(res, { ok: false, error: 'Invalid or expired link' }, 400);
  if (tokenRow.used_at) return jsonRes(res, { ok: false, error: 'This link has already been used' }, 400);
  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    return jsonRes(res, { ok: false, error: 'This link has expired. Please request a new one.' }, 400);
  }

  // Mark token used + mark profile verified (in parallel — both atomic)
  const now = new Date().toISOString();
  const [tokenUpdate, profileUpdate] = await Promise.all([
    supa.from('verification_tokens').update({ used_at: now }).eq('id', tokenRow.id),
    supa.from('profiles').update({ email_verified_at: now }).eq('id', tokenRow.user_id),
  ]);

  if (tokenUpdate.error || profileUpdate.error) {
    console.error('[verify] update failed:', tokenUpdate.error || profileUpdate.error);
    return jsonRes(res, { ok: false, error: 'Could not complete verification' }, 500);
  }

  // Invalidate any other outstanding tokens for this user
  try {
    await supa.from('verification_tokens')
      .update({ used_at: now })
      .eq('user_id', tokenRow.user_id)
      .is('used_at', null);
  } catch { /* non-fatal */ }

  return jsonRes(res, { ok: true });
}

/* ── POST /api/send-listing-approved-email — internal, fired after AI approves ──
   Body: { listing_id }
   Auth: requires Authorization Bearer token (the listing's owner)
*/
async function handleSendListingApprovedEmail(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  const user = await getUserFromRequest(req);
  if (!user) return jsonRes(res, { error: 'Not authenticated' }, 401);

  let body = {};
  try { body = await parseBody(req); } catch {}
  const listingId = body.listing_id;
  if (!listingId) return jsonRes(res, { error: 'Missing listing_id' }, 400);

  // Confirm the listing belongs to this user and is active
  const { data: listing, error: lErr } = await supa
    .from('listings')
    .select('id, owner_id, title, status')
    .eq('id', listingId)
    .maybeSingle();
  if (lErr || !listing) return jsonRes(res, { error: 'Listing not found' }, 404);
  if (listing.owner_id !== user.id) return jsonRes(res, { error: 'Not owner' }, 403);
  if (listing.status !== 'active') return jsonRes(res, { ok: true, skipped: 'not_active' });

  // Pull display name
  const { data: profile } = await supa.from('profiles').select('display_name').eq('id', user.id).maybeSingle();
  const displayName = (profile && profile.display_name) || (user.email && user.email.split('@')[0]) || '';

  const listingUrl = `${emailModule.SITE_URL}/listing.html?id=${encodeURIComponent(listing.id)}`;
  const tpl = emailModule.listingApprovedEmail({ name: displayName, title: listing.title, listingUrl });
  const result = await emailModule.sendEmail({ to: user.email, ...tpl });

  if (!result.ok) return jsonRes(res, { error: result.error || 'Send failed' }, 500);
  return jsonRes(res, { ok: true, disabled: result.disabled || false });
}

/* ── POST /api/internal/listing-activated — webhook from Postgres trigger ──
   Fires when ANY listing's status flips to 'active' (AI approval, manual SQL,
   admin panel, etc.). Authenticated via X-Webhook-Secret header.

   Body: { listing_id: "<uuid>" }

   Idempotent: checks listings.listing_live_email_sent_at and skips if already sent.
   Marks it on success so it can never be sent twice.
*/
async function handleListingActivatedWebhook(req, res) {
  // ─── Authenticate ───
  const expectedSecret = process.env.WEBHOOK_SECRET;
  if (!expectedSecret) {
    console.warn('[webhook] WEBHOOK_SECRET not configured — refusing to process webhook');
    return jsonRes(res, { error: 'Service not configured' }, 503);
  }
  const providedSecret = req.headers['x-webhook-secret'];
  if (!providedSecret || providedSecret !== expectedSecret) {
    return jsonRes(res, { error: 'Unauthorized' }, 401);
  }

  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  let body = {};
  try { body = await parseBody(req); } catch {}
  const listingId = body.listing_id;
  if (!listingId) return jsonRes(res, { error: 'Missing listing_id' }, 400);

  // Look up listing + owner
  const { data: listing, error: lErr } = await supa
    .from('listings')
    .select('id, owner_id, title, status, listing_live_email_sent_at')
    .eq('id', listingId)
    .maybeSingle();
  if (lErr || !listing) {
    console.warn('[webhook] listing not found:', listingId, lErr && lErr.message);
    return jsonRes(res, { error: 'Listing not found' }, 404);
  }

  // Idempotency: skip if already sent
  if (listing.listing_live_email_sent_at) {
    return jsonRes(res, { ok: true, skipped: 'already_sent' });
  }
  // Defensive: status should be active
  if (listing.status !== 'active') {
    return jsonRes(res, { ok: true, skipped: 'not_active' });
  }

  // Look up owner email + display name. auth.users requires service-role access
  let ownerEmail = null;
  let displayName = '';
  try {
    const { data: userData, error: uErr } = await supa.auth.admin.getUserById(listing.owner_id);
    if (uErr || !userData || !userData.user) {
      console.warn('[webhook] owner user lookup failed:', uErr && uErr.message);
      return jsonRes(res, { error: 'Owner not found' }, 404);
    }
    ownerEmail = userData.user.email;
  } catch (e) {
    console.error('[webhook] auth.admin.getUserById threw:', e.message);
    return jsonRes(res, { error: 'Owner lookup failed' }, 500);
  }
  if (!ownerEmail) {
    console.warn('[webhook] owner has no email:', listing.owner_id);
    return jsonRes(res, { ok: true, skipped: 'no_email' });
  }

  const { data: profile } = await supa
    .from('profiles')
    .select('display_name')
    .eq('id', listing.owner_id)
    .maybeSingle();
  displayName = (profile && profile.display_name) || ownerEmail.split('@')[0];

  const listingUrl = `${emailModule.SITE_URL}/listing.html?id=${encodeURIComponent(listing.id)}`;
  const tpl = emailModule.listingApprovedEmail({ name: displayName, title: listing.title, listingUrl });
  const result = await emailModule.sendEmail({ to: ownerEmail, ...tpl });

  if (!result.ok) {
    console.error('[webhook] email send failed:', result.error);
    return jsonRes(res, { error: result.error || 'Send failed' }, 500);
  }

  // Mark sent for idempotency
  try {
    await supa.from('listings')
      .update({ listing_live_email_sent_at: new Date().toISOString() })
      .eq('id', listing.id);
  } catch (e) {
    console.warn('[webhook] could not mark listing as emailed:', e.message);
  }

  return jsonRes(res, { ok: true });
}

/* ── POST /api/send-password-reset-email — public, sends a reset link ──
   Public endpoint (no auth required — by definition the user can't sign in).
   Body: { email: "user@example.com" }

   Security:
   - ALWAYS returns { ok: true } regardless of whether the email exists. This
     prevents an attacker from enumerating which emails have accounts.
   - Rate-limited per email (1 token per 60 seconds). If a recent token exists,
     we silently no-op rather than send a second email.
   - Token is 32 random bytes, only the SHA-256 hash is stored.
   - 1-hour expiry.
*/
async function handleSendPasswordResetEmail(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  let body = {};
  try { body = await parseBody(req); } catch {}
  const email = String(body.email || '').trim().toLowerCase();

  // Validate email shape (loose) — we don't want to spam the auth.users lookup
  // for obvious garbage like " " or "asdf"
  if (!email || !email.includes('@') || email.length < 5 || email.length > 254) {
    // Pretend everything's fine — same response as success path
    return jsonRes(res, { ok: true });
  }

  // ─── Look up the user. Always pretend success regardless of result. ───
  let user = null;
  try {
    // auth.admin.listUsers supports filtering by email
    const { data, error } = await supa.auth.admin.listUsers({ filter: `email.eq.${email}` });
    if (!error && data && Array.isArray(data.users) && data.users.length > 0) {
      user = data.users[0];
    }
  } catch (e) {
    console.warn('[pwreset] user lookup threw:', e.message);
    // Fall through — pretend everything's fine
  }
  if (!user) {
    // Don't reveal that the email doesn't exist. Same response.
    return jsonRes(res, { ok: true });
  }

  // ─── Rate limit: skip if a token was issued in the last 60 seconds. ───
  try {
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count } = await supa
      .from('password_reset_tokens')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', sixtySecondsAgo);
    if (typeof count === 'number' && count > 0) {
      console.log('[pwreset] rate-limited:', email);
      return jsonRes(res, { ok: true }); // pretend success, no email sent
    }
  } catch (e) {
    console.warn('[pwreset] rate-limit check failed:', e.message);
    // Fall through — better to send the email than block legitimately
  }

  // ─── Generate token, store hash, send email ───
  const { raw, hash } = newToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h

  // Capture IP and UA for audit (truncated)
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim().slice(0, 64);
  const ua = (req.headers['user-agent'] || '').toString().slice(0, 256);

  const { error: insErr } = await supa
    .from('password_reset_tokens')
    .insert({
      user_id: user.id,
      token_hash: hash,
      expires_at: expiresAt,
      ip_address: ip || null,
      user_agent: ua || null,
    });
  if (insErr) {
    console.error('[pwreset] token insert failed:', insErr.message);
    return jsonRes(res, { ok: true }); // still pretend success — don't leak info
  }

  // Look up display name (best-effort)
  let displayName = '';
  try {
    const { data: profile } = await supa
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle();
    displayName = (profile && profile.display_name) || (user.email && user.email.split('@')[0]) || '';
  } catch {}

  const resetUrl = `${emailModule.SITE_URL}/reset-password.html?token=${encodeURIComponent(raw)}`;
  const tpl = emailModule.passwordResetEmail({ name: displayName, resetUrl });
  const result = await emailModule.sendEmail({ to: user.email, ...tpl });

  if (!result.ok) {
    console.error('[pwreset] email send failed:', result.error);
    // Still return ok to avoid leaking that the email exists
  }
  return jsonRes(res, { ok: true });
}

/* ── POST /api/reset-password — public, completes the reset ──
   Body: { token: "...", password: "..." }

   Security:
   - Token must exist, be unused, and not expired.
   - Password must be >= 6 chars.
   - On success: updates user's password, marks token used, invalidates all
     existing sessions (so an attacker with a stolen old session can't keep using it).
*/
async function handleResetPassword(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  let body = {};
  try { body = await parseBody(req); } catch {}
  const rawToken = String(body.token || '').trim();
  const newPassword = String(body.password || '');

  if (!rawToken) return jsonRes(res, { ok: false, error: 'Missing token' }, 400);
  if (!newPassword || newPassword.length < 6) {
    return jsonRes(res, { ok: false, error: 'Password must be at least 6 characters' }, 400);
  }
  if (newPassword.length > 128) {
    return jsonRes(res, { ok: false, error: 'Password is too long' }, 400);
  }

  const hash = sha256Hex(rawToken);
  const { data: tokenRow, error: tErr } = await supa
    .from('password_reset_tokens')
    .select('id, user_id, expires_at, used_at')
    .eq('token_hash', hash)
    .maybeSingle();

  if (tErr || !tokenRow) {
    return jsonRes(res, { ok: false, error: 'This reset link is invalid or has already been used.' }, 400);
  }
  if (tokenRow.used_at) {
    return jsonRes(res, { ok: false, error: 'This reset link has already been used.' }, 400);
  }
  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    return jsonRes(res, { ok: false, error: 'This reset link has expired. Please request a new one.' }, 400);
  }

  // ─── Update the password via admin API ───
  try {
    const { error: updErr } = await supa.auth.admin.updateUserById(
      tokenRow.user_id,
      { password: newPassword }
    );
    if (updErr) {
      console.error('[pwreset] updateUserById failed:', updErr.message);
      return jsonRes(res, { ok: false, error: 'Could not update password. Please try again.' }, 500);
    }
  } catch (e) {
    console.error('[pwreset] updateUserById threw:', e.message);
    return jsonRes(res, { ok: false, error: 'Could not update password. Please try again.' }, 500);
  }

  // ─── Mark token used (one-shot) ───
  try {
    await supa.from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', tokenRow.id);
  } catch (e) {
    console.warn('[pwreset] could not mark token used:', e.message);
    // Password is updated; this is just bookkeeping.
  }

  // ─── Invalidate all existing sessions for this user ───
  // After a password reset, any old session is suspect. signOut on the admin
  // client kills every JWT for this user.
  try {
    await supa.auth.admin.signOut(tokenRow.user_id);
  } catch (e) {
    console.warn('[pwreset] sign-out-all failed:', e.message);
  }

  return jsonRes(res, { ok: true });
}

/* ── POST /api/change-password — authenticated, requires current password ──
   Body: { currentPassword, newPassword }

   Unlike reset-password (which uses an email-link token), this requires the
   user to be signed in and prove they know their current password. This is
   the "change password from settings" flow, not "forgot password."
*/
async function handleChangePassword(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  const user = await getUserFromRequest(req);
  if (!user) return jsonRes(res, { ok: false, error: 'Not authenticated' }, 401);

  let body = {};
  try { body = await parseBody(req); } catch {}
  const currentPassword = String(body.currentPassword || '');
  const newPassword     = String(body.newPassword || '');

  if (!currentPassword || !newPassword) {
    return jsonRes(res, { ok: false, error: 'Both current and new password are required' }, 400);
  }
  if (newPassword.length < 6) {
    return jsonRes(res, { ok: false, error: 'New password must be at least 6 characters' }, 400);
  }
  if (newPassword.length > 128) {
    return jsonRes(res, { ok: false, error: 'New password is too long' }, 400);
  }
  if (currentPassword === newPassword) {
    return jsonRes(res, { ok: false, error: 'New password must be different from the current one' }, 400);
  }

  // ─── Verify current password by attempting to sign in ───
  // We use a fresh anon client (not the admin one) so we get the standard
  // password-verification flow without bypassing it.
  try {
    const { createClient } = require('@supabase/supabase-js');
    const verifyClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { error: signInErr } = await verifyClient.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInErr) {
      return jsonRes(res, { ok: false, error: 'Current password is incorrect' }, 400);
    }
  } catch (e) {
    console.error('[change-password] verify failed:', e.message);
    return jsonRes(res, { ok: false, error: 'Could not verify current password' }, 500);
  }

  // ─── Update password ───
  try {
    const { error: updErr } = await supa.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });
    if (updErr) {
      console.error('[change-password] update failed:', updErr.message);
      return jsonRes(res, { ok: false, error: 'Could not update password' }, 500);
    }
  } catch (e) {
    console.error('[change-password] update threw:', e.message);
    return jsonRes(res, { ok: false, error: 'Could not update password' }, 500);
  }

  // ─── Bookkeeping: record when password was changed ───
  try {
    await supa.from('profiles')
      .update({ password_changed_at: new Date().toISOString() })
      .eq('id', user.id);
  } catch (e) {
    console.warn('[change-password] could not update profiles.password_changed_at:', e.message);
  }

  // Note: we do NOT sign out other sessions here. The user knows the new
  // password and is actively using the app — kicking them out of other
  // devices would be a more aggressive policy than necessary.

  return jsonRes(res, { ok: true });
}

/* ── POST /api/deactivate-account — authenticated ──
   Body: {}

   Soft-disables the account. User is signed out and can't sign back in until
   support re-enables it (which we'll do manually for now — a reactivation
   email-link flow can come later).

   This DOES NOT delete data. Listings stay. Photos stay. Just blocks login.
*/
async function handleDeactivateAccount(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  const user = await getUserFromRequest(req);
  if (!user) return jsonRes(res, { ok: false, error: 'Not authenticated' }, 401);

  try {
    // Mark profile as deactivated for bookkeeping
    await supa.from('profiles')
      .update({ deactivated_at: new Date().toISOString() })
      .eq('id', user.id);

    // Ban the auth user — Supabase supports this via admin API:
    // setting `banned_until` to a future date prevents sign-in.
    // 100 years in the future = effectively permanent until reactivated.
    const farFuture = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString();
    await supa.auth.admin.updateUserById(user.id, {
      ban_duration: '876000h',  // 100 years
    });

    // Pause all their active listings (hide from public)
    await supa.from('listings')
      .update({ status: 'expired' })
      .eq('owner_id', user.id)
      .eq('status', 'active');

    // Kill all sessions
    try { await supa.auth.admin.signOut(user.id); } catch {}

    return jsonRes(res, { ok: true });
  } catch (e) {
    console.error('[deactivate] failed:', e.message);
    return jsonRes(res, { ok: false, error: 'Could not deactivate account' }, 500);
  }
}

/* ── POST /api/delete-account — authenticated, IRREVERSIBLE ──
   Body: { confirmEmail: string }

   Hard-deletes the auth user and cascades:
   - profiles row (FK on delete cascade)
   - listings rows (FK on delete cascade) — and their listing_images
   - favourites rows
   - notifications, saved_searches, etc.

   We require the user to type their email to confirm. Storage files are
   left as orphans (cleaned up by future cron — not worth blocking deletion).
*/
async function handleDeleteAccount(req, res) {
  const supa = getSupabaseAdmin();
  if (!supa) return jsonRes(res, { error: 'Service unavailable' }, 503);

  const user = await getUserFromRequest(req);
  if (!user) return jsonRes(res, { ok: false, error: 'Not authenticated' }, 401);

  let body = {};
  try { body = await parseBody(req); } catch {}
  const confirmEmail = String(body.confirmEmail || '').trim().toLowerCase();
  if (!confirmEmail || confirmEmail !== (user.email || '').toLowerCase()) {
    return jsonRes(res, {
      ok: false,
      error: 'Please type your email address exactly to confirm deletion.',
    }, 400);
  }

  try {
    // Best-effort: enumerate the user's storage objects and remove them.
    // (Cascade deletes the DB rows, but Storage files don't auto-delete.)
    try {
      const { data: imgs } = await supa.from('listing_images')
        .select('storage_path')
        .in('listing_id',
          (await supa.from('listings').select('id').eq('owner_id', user.id)).data?.map(l => l.id) || []
        );
      const paths = (imgs || []).map(i => i.storage_path).filter(Boolean);
      if (paths.length) {
        await supa.storage.from('vehicle-photos').remove(paths);
      }
    } catch (e) {
      console.warn('[delete-account] storage cleanup failed (non-fatal):', e.message);
    }

    // Delete the auth user — this cascades to profiles, listings, etc. via FKs.
    const { error: delErr } = await supa.auth.admin.deleteUser(user.id);
    if (delErr) {
      console.error('[delete-account] auth deletion failed:', delErr.message);
      return jsonRes(res, { ok: false, error: 'Could not delete account: ' + delErr.message }, 500);
    }

    return jsonRes(res, { ok: true });
  } catch (e) {
    console.error('[delete-account] failed:', e.message);
    return jsonRes(res, { ok: false, error: 'Could not delete account' }, 500);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// HTTP SERVER
// ══════════════════════════════════════════════════════════════════════════
const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  // API routes
  if (req.method === 'POST') {
    if (url === '/api/agent') return handleAgent(req, res);
    if (url === '/api/analyze-photos') return handleAnalyzePhotos(req, res);
    if (url === '/api/vin-lookup') return handleVINLookup(req, res);
    if (url === '/api/mulkiya-scan') return handleMulkiyaScan(req, res);
    if (url === '/api/price-estimate') return handlePriceEstimate(req, res);
    if (url === '/api/suggest-features') return handleSuggestFeatures(req, res);
    if (url === '/api/verify-listing') return handleVerifyListing(req, res);
    if (url === '/api/send-welcome-email') return handleSendWelcomeEmail(req, res);
    if (url === '/api/send-verification-email') return handleSendVerificationEmail(req, res);
    if (url === '/api/send-listing-approved-email') return handleSendListingApprovedEmail(req, res);
    if (url === '/api/internal/listing-activated') return handleListingActivatedWebhook(req, res);
    if (url === '/api/send-password-reset-email') return handleSendPasswordResetEmail(req, res);
    if (url === '/api/reset-password') return handleResetPassword(req, res);
    if (url === '/api/change-password') return handleChangePassword(req, res);
    if (url === '/api/deactivate-account') return handleDeactivateAccount(req, res);
    if (url === '/api/delete-account') return handleDeleteAccount(req, res);
  }
  if (req.method === 'GET') {
    if (url === '/api/verify-email') return handleVerifyEmailToken(req, res);
  }

  // Security headers (apply to all non-API responses too)
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(self), camera=(), microphone=()',
  };

  // Static file serving
  let requestedPath = url === '/' ? '/index.html' : url;
  if (!path.extname(requestedPath)) requestedPath += '.html';

  // Path traversal protection: resolve and ensure result stays inside STATIC_DIR
  const filePath = path.join(STATIC_DIR, requestedPath);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(STATIC_DIR))) {
    res.writeHead(403, { 'Content-Type': 'text/plain', ...securityHeaders });
    return res.end('Forbidden');
  }

  fs.readFile(resolved, (err, data) => {
    const ext = path.extname(resolved).toLowerCase();

    if (err) {
      // Real 404 — do NOT fall back to index.html (that would break SEO and mask broken links).
      // Serve a friendly 404 page if it exists, otherwise a plain text 404.
      const notFoundPath = path.join(STATIC_DIR, '404.html');
      fs.readFile(notFoundPath, (e2, d2) => {
        if (e2) {
          res.writeHead(404, { 'Content-Type': 'text/plain', ...securityHeaders });
          return res.end('404 Not Found');
        }
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', ...securityHeaders });
        res.end(d2);
      });
      return;
    }

    // Cache strategy:
    //   - HTML: no-cache (always check for updates, but allow conditional GET)
    //   - Images / fonts: 30 days, immutable hint
    //   - CSS / JS: 1 day (no fingerprinting yet, so don't cache too long)
    let cacheControl;
    if (ext === '.html') {
      cacheControl = 'no-cache, must-revalidate';
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.woff', '.woff2'].includes(ext)) {
      cacheControl = 'public, max-age=2592000, immutable'; // 30 days
    } else if (['.css', '.js'].includes(ext)) {
      cacheControl = 'public, max-age=86400'; // 1 day
    } else {
      cacheControl = 'public, max-age=3600';
    }

    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': cacheControl,
      ...securityHeaders,
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`DUBIMOTORS server running on http://localhost:${PORT} (${NODE_ENV})`);
  // Surface missing env config at boot so it doesn't bite us in production.
  const warnings = [];
  if (!process.env.OPENAI_API_KEY) warnings.push('OPENAI_API_KEY not set — AI endpoints will return 503');
  if (!process.env.SMTP_HOST && !process.env.SMTP_USER) warnings.push('SMTP not configured — listing verification emails will be skipped');
  if (warnings.length) {
    console.warn('\n⚠  Configuration warnings:');
    warnings.forEach(w => console.warn(`   • ${w}`));
    console.warn('');
  }
});
