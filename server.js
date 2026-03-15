/**
 * DUBIMOTORS AI API Server
 * Handles: /api/agent, /api/analyze-photos, /api/vin-lookup, /api/price-estimate
 * Also serves static files from the same directory.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});

const PORT = process.env.PORT || 8080;
const STATIC_DIR = __dirname;

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

// ══════════════════════════════════════════════════════════════════════════
// API HANDLERS
// ══════════════════════════════════════════════════════════════════════════

/* ── /api/agent — Dubi Agent chat ── */
async function handleAgent(req, res) {
  const { message, history = [] } = await parseBody(req);
  if (!message) return jsonRes(res, { reply: 'Please send a message.' }, 400);

  const systemPrompt = `You are Dubi Agent, a friendly and knowledgeable AI assistant for DUBIMOTORS — the UAE's leading marketplace for buying and selling cars, boats, motorcycles, and jet skis.

Your role is to:
- Help users find the right vehicle based on their needs and budget
- Explain how to place ads, listing packages (Basic: Free 30 days, Featured: AED 99 30 days, Premium: AED 249 60 days)
- Explain how to contact sellers (Call or WhatsApp buttons on listings)
- Answer questions about car finance, insurance, and inspections in the UAE
- Provide general advice about buying/selling vehicles in the UAE
- Help with understanding listing details, specs, and prices
- Be concise, warm, and professional. Use short paragraphs.
- Always respond in the same language the user writes in.
- If asked about a specific vehicle price, give a general UAE market range.
- Do NOT make up specific listing details that don't exist.`;

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
  "hp": "Horsepower as integer string for this exact trim",
  "cylinders": "Number of cylinders as string",
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
      model: 'gemini-2.5-flash',
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
async function handleVINLookup(req, res) {
  const { vin } = await parseBody(req);
  if (!vin || vin.length !== 17) return jsonRes(res, { error: 'Invalid VIN. Must be 17 characters.' }, 400);

  const prompt = `You are a professional automotive VIN decoder with access to full WMI/VDS/VIS knowledge. Decode this VIN precisely: ${vin}

The VIN encodes: World Manufacturer Identifier (positions 1-3), Vehicle Descriptor Section (4-9) including model, body, engine, and restraint, and Vehicle Identifier Section (10-17) including model year and plant.

Return a JSON object — every field must be filled accurately:
{
  "brand": "Exact manufacturer name e.g. BMW, Mercedes-Benz, Toyota",
  "model": "Exact model name e.g. M3, C63, Land Cruiser — decode from VDS characters, NOT just the base model family",
  "trim": "Exact trim/variant e.g. Competition, AMG, S-Line, Sport — decode from VDS and cross-reference with known configurations for this VIN pattern",
  "year": "Model year as 4-digit string — decode from position 10",
  "bodyType": "Body style e.g. Sedan, Coupe, SUV, Convertible",
  "engine": "Engine description e.g. 3.0L Inline-6 Twin-Turbo",
  "transmission": "Automatic or Manual",
  "cylinders": "Number of cylinders as string",
  "hp": "Horsepower as string for this specific trim",
  "condition": "Used",
  "country": "Country of manufacture from WMI",
  "plant": "Assembly plant if determinable",
  "doors": "Number of doors as string",
  "seats": "Number of seats as string"
}

CRITICAL: The model field must reflect the SPECIFIC model (e.g. M3, not just 3 Series). The trim must reflect the specific variant. For example WBS = BMW M model. Use your full VIN knowledge.
If the VIN is invalid: {"error": "VIN not recognized. Please check and try again."}
Return ONLY the raw JSON object.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
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
      model: 'gemini-2.5-flash',
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
  const { brand, model, trim, year, km, condition } = await parseBody(req);
  if (!brand || !model || !year) return jsonRes(res, { error: 'Brand, model and year are required.' }, 400);

  const vehicleDesc = [year, brand, model, trim].filter(Boolean).join(' ');
  const kmNum = km ? parseInt(km) : null;

  // Step 1: Scrape real live prices from Dubicars
  const scraped = await scrapeDubicarsPrice(brand, model, year);
  const liveData = scraped.prices;

  // Step 2: Build AI prompt with real data if available
  let priceContext = '';
  if (liveData.length > 0) {
    const sorted = [...liveData].sort((a, b) => a - b);
    const low = sorted[0];
    const high = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length / 2)];
    priceContext = `REAL CURRENT UAE LISTINGS FOUND ON DUBICARS:\n- ${liveData.length} listings found\n- Prices range: AED ${low.toLocaleString()} to AED ${high.toLocaleString()}\n- Typical price: AED ${median.toLocaleString()}\n- All prices: ${sorted.map(p => 'AED ' + p.toLocaleString()).join(', ')}\n\nUse these REAL prices as your base.`;
  } else {
    priceContext = `No live listings found on Dubicars for this exact model. Use your knowledge of UAE market prices for ${vehicleDesc}.`;
  }

  const mileageNote = kmNum
    ? (kmNum > 100000 ? 'High mileage (over 100k km): reduce price by 15-25%'
      : kmNum > 50000 ? 'Moderate mileage (50k-100k km): reduce price by 5-10%'
      : kmNum > 20000 ? 'Normal mileage: minimal impact'
      : 'Very low mileage: slight premium possible')
    : 'Mileage unknown';

  const prompt = `You are a UAE used car market pricing expert with deep knowledge of current Dubai/UAE market prices.

Vehicle to price:
- Make/Model/Trim: ${vehicleDesc}
- Condition: ${condition || 'Used'}
- Mileage: ${kmNum ? kmNum.toLocaleString() + ' km' : 'unknown'}

${priceContext}

IMPORTANT PRICING RULES:
1. ${mileageNote}
2. Give USED market prices (not new/dealer prices) unless condition is "New"
3. Be CONSERVATIVE and REALISTIC — do not overestimate
4. For exotic/luxury cars (Ferrari, Lamborghini, McLaren, Porsche, etc.), used prices in UAE are typically 30-50% below new MSRP
5. A 2023 Ferrari SF90 Stradale used = approx AED 1.4M-1.6M (not 2.8M+)
6. Always factor in the specific trim level — higher trims command 5-20% premium
7. UAE market prices: factor in no import tax, strong demand for luxury, GCC spec premium

Return ONLY this JSON (no markdown, no explanation):
{
  "low": <lowest realistic AED used price as integer>,
  "high": <highest realistic AED used price as integer>,
  "median": <most likely AED price as integer>,
  "insight": "<2-3 sentences about current UAE market for this specific vehicle, mentioning realistic price range>",
  "demand": "<High/Medium/Low>",
  "source": "${liveData.length > 0 ? 'UAE market data (' + liveData.length + ' live listings)' : 'UAE market analysis'}"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
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
  }

  // Static file serving
  let filePath = path.join(STATIC_DIR, url === '/' ? 'index.html' : url);
  if (!path.extname(filePath)) filePath += '.html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try index.html fallback
      fs.readFile(path.join(STATIC_DIR, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(d2);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`DUBIMOTORS server running on http://localhost:${PORT}`);
});
