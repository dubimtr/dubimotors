# DubiMotors

UAE Vehicle Marketplace — buy and sell cars, motorcycles, boats, jet skis, and heavy vehicles. AI-powered listing assistance via OpenAI and the NHTSA VIN API.

**Live:** [dubimotors.onrender.com](https://dubimotors.onrender.com) → moving to `dubimotors.ae`

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your keys
cp .env.example .env
# Edit .env and set OPENAI_API_KEY at minimum

# 3. Run the server
npm start
# → http://localhost:8080
```

The site works without any environment variables — the AI endpoints will return a clean 503 and everything else keeps working. So you can browse the entire frontend even before signing up for OpenAI.

---

## Project Structure

```
dubimotors/
├── server.js              # Node.js HTTP server: static files + 6 AI endpoints
├── shared.js              # Single source of truth for listings (61 hardcoded for MVP)
├── style.css              # Global stylesheet, design tokens at the top
│
├── index.html             # Homepage
├── cars.html              # Category pages (cars, bikes, boats, jetski, etc.)
├── bikes.html
├── ...
├── listing.html           # Single-listing detail page (reads ?id= from URL)
├── place-ad.html          # Sell flow — uploads, AI auto-fill, price estimate
├── login.html             # UI only — no auth yet (Phase 3)
├── profile.html           # UI only
├── 404.html               # Branded not-found page
│
├── components.js          # Header / footer / nav rendering
├── search-autocomplete.js # Smart search dropdown
├── dubi-agent.js          # Floating AI chatbot widget
├── lightbox.js            # Image gallery
├── icons.js, vehicles.js  # Helpers / icon set / make-model-trim data
├── user-common.js         # Profile/login UI helpers
│
├── sitemap.xml, robots.txt
├── gta-images/, logos/    # Vehicle photos and seller logos
└── .env.example           # Documented env template
```

---

## API Endpoints

All endpoints accept POST and return JSON. They live in `server.js`.

| Endpoint | Purpose | Required |
|---|---|---|
| `/api/agent` | Dubi Agent chatbot | OpenAI |
| `/api/analyze-photos` | Detect make/model/year/condition from photos | OpenAI |
| `/api/vin-lookup` | Decode a 17-char VIN | NHTSA (free) + OpenAI for enrichment |
| `/api/mulkiya-scan` | Extract VIN from a UAE registration card photo | OpenAI |
| `/api/price-estimate` | Suggested UAE listing price | OpenAI |
| `/api/verify-listing` | Moderate a listing + send email confirmation | OpenAI + SMTP |

When `OPENAI_API_KEY` is missing, AI-dependent endpoints return:
```json
{ "error": "AI service unavailable", "reply": "..." }
```
with HTTP 503. The VIN endpoint still works (NHTSA-only mode) when the OpenAI key is missing.

---

## Deployment (Render)

The site is currently deployed to Render as a Web Service.

**Build command:** `npm install`
**Start command:** `npm start`
**Node version:** 18.17+ (declared in `package.json` engines)

**Environment variables to set in Render:**
- `OPENAI_API_KEY` — required for AI features
- `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` — for verification emails
- `NODE_ENV=production`

`PORT` is automatically injected by Render — don't set it manually.

---

## Roadmap

This codebase is a polished frontend MVP. To become a live multi-user marketplace, the following phases are planned:

- ✅ **Phase 1 — Polish & production hygiene** *(in progress)*
- ⬜ **Phase 2 — Account setup** (OpenAI billing, Supabase project)
- ⬜ **Phase 3 — Real backend** (Supabase auth, listings DB, image storage)
- ⬜ **Phase 4 — Empty categories** (Heavy Vehicles, Number Plates, Accessories)
- ⬜ **Phase 5 — Production deployment** to `dubimotors.ae`

See `DubiMotors_Project_Handover.pdf` for the full handover context.

---

## License

UNLICENSED — proprietary.
