// ─── DUBIMOTORS SHARED DATA & HELPERS ────────────────────────────────────────
// Real listing images fetched directly from the Wix site CDN
// Image base IDs extracted from the live motors listing page

const DM = (() => {

  // Helper to build full-res Wix CDN URL from media hash
  function wix(hash, ext, w, h) {
    return `https://static.wixstatic.com/media/${hash}~mv2.${ext}/v1/fill/w_${w},h_${h},al_c,q_90,enc_avif,quality_auto/${hash}~mv2.${ext}`;
  }

  // Real listings from the Wix site with their actual images
  const listings = [
    // ── CARS ──
    {
      id: 'kia-sportage-2026',
      title: '2026 Kia Sportage Limited Edition',
      category: 'cars',
      make: 'Kia',
      model: 'Sportage',
      trim: 'Limited Edition',
      price: 60000,
      year: 2026,
      km: 0,
      condition: 'Brand New',
      engine: '1.5L Turbo',
      hp: 197,
      cylinders: 4,
      transmission: 'Automatic (8-Speed)',
      bodyType: 'SUV',
      doors: 5,
      seats: 5,
      extColor: 'Steel Grey',
      intColor: 'Black',
      warranty: true,
      serviceContract: false,
      location: 'Dubai',
      seller: 'Khaled Audi Showroom',
      verified: true,
      // Real image: Kia Sportage grey SUV from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_d343a77e170b4500b7b74b2056d5e9b7~mv2.webp/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_d343a77e170b4500b7b74b2056d5e9b7~mv2.webp',
      regionalSpec: 'GCC Specs',
    },
    {
      id: 'vw-golf-gti-p1rtg',
      title: '2024 Volkswagen Golf GTI P1RTG',
      category: 'cars',
      make: 'Volkswagen',
      model: 'Golf',
      trim: 'GTI P1RTG',
      price: 140000,
      year: 2024,
      km: 5000,
      condition: 'Used',
      engine: '2.0L TSI Turbo',
      hp: 245,
      cylinders: 4,
      transmission: 'Automatic (DSG)',
      bodyType: 'Hatchback',
      doors: 5,
      seats: 5,
      extColor: 'Tornado Red',
      intColor: 'Black/Red',
      warranty: true,
      serviceContract: true,
      location: 'Dubai',
      seller: 'Khaled Audi Showroom',
      verified: true,
      // Real image: VW Golf GTI from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_5bd096d1e962457e9dc582a1763fd719~mv2.webp/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_5bd096d1e962457e9dc582a1763fd719~mv2.webp',
      regionalSpec: 'GCC Specs',
    },
    {
      id: 'vw-golf-gti-p111',
      title: '2024 Volkswagen Golf GTI P111',
      category: 'cars',
      make: 'Volkswagen',
      model: 'Golf',
      trim: 'GTI P111',
      price: 140000,
      year: 2024,
      km: 8200,
      condition: 'Used',
      engine: '2.0L TSI Turbo',
      hp: 245,
      cylinders: 4,
      transmission: 'Automatic (DSG)',
      bodyType: 'Hatchback',
      doors: 5,
      seats: 5,
      extColor: 'Deep Black Pearl',
      intColor: 'Black',
      warranty: false,
      serviceContract: false,
      location: 'Abu Dhabi',
      seller: 'Khaled Audi Showroom',
      verified: true,
      // Real image: VW Golf GTI McLaren edition from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_dee12c3603d3457da6c030a90fcc3e66~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_dee12c3603d3457da6c030a90fcc3e66~mv2.jpeg',
      regionalSpec: 'GCC Specs',
    },
    {
      id: 'harley-buy-now-pay-later',
      title: '2024 Harley-Davidson Road King Special',
      category: 'bikes',
      make: 'Harley-Davidson',
      model: 'Road King',
      trim: 'Special',
      price: 62200,
      year: 2024,
      km: 1200,
      condition: 'Used',
      engine: '1868cc Milwaukee-Eight 114',
      hp: 93,
      cylinders: 2,
      transmission: '6-Speed',
      bodyType: 'Cruiser',
      doors: 0,
      seats: 2,
      extColor: 'Vivid Black',
      intColor: 'Black',
      warranty: false,
      serviceContract: false,
      location: 'Dubai',
      seller: 'Khaled Audi Showroom',
      verified: true,
      regionalSpec: 'GCC Specs',
      // Real image: Harley-Davidson motorcycle from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_91c9a2f4e5094bdf80c146853d922fec~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_91c9a2f4e5094bdf80c146853d922fec~mv2.jpeg',
    },
    {
      id: 'supercar-collection',
      title: '2024 Supercar Collection Dubai',
      category: 'cars',
      make: 'Ferrari',
      model: '488',
      trim: 'Spider',
      price: 50000,
      year: 2024,
      km: 3000,
      condition: 'Used',
      engine: '4.0L V8',
      hp: 660,
      cylinders: 8,
      transmission: 'Automatic',
      bodyType: 'Convertible',
      doors: 2,
      seats: 2,
      extColor: 'Rosso Corsa',
      intColor: 'Beige',
      warranty: false,
      serviceContract: false,
      location: 'Dubai',
      seller: 'Khaled Audi Showroom',
      verified: true,
      // Real image: Ferrari/McLaren beach shot from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_9a27396de198461ca15e2be90046d974~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_9a27396de198461ca15e2be90046d974~mv2.jpeg',
      regionalSpec: 'GCC Specs',
    },
    // ── MOTORCYCLES ──
    {
      id: 'honda-cbr-650-2025',
      title: '2025 Honda CBR 650 E-Clutch',
      category: 'bikes',
      make: 'Honda',
      model: 'CBR 650R',
      trim: 'E-Clutch',
      price: 35000,
      year: 2025,
      km: 0,
      condition: 'Brand New',
      engine: '649cc Inline-4',
      hp: 95,
      cylinders: 4,
      transmission: '6-Speed',
      bodyType: 'Sport',
      doors: 0,
      seats: 2,
      extColor: 'Grand Prix Red',
      intColor: 'Black',
      warranty: true,
      serviceContract: false,
      location: 'Dubai',
      seller: 'Khaled Audi Showroom',
      verified: true,
      regionalSpec: 'GCC Specs',
      // Real image: Honda CBR from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_20aa2d7695f240419a43673d77c52bbd~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_20aa2d7695f240419a43673d77c52bbd~mv2.jpeg',
    },
    // ── JET SKIS ──
    {
      id: 'seadoo-spark-trixx-2025',
      title: '2025 Sea-Doo Spark Trixx',
      category: 'jetski',
      make: 'Sea-Doo',
      model: 'Spark',
      trim: 'Trixx',
      price: 45000,
      year: 2025,
      km: 0,
      condition: 'Brand New',
      engine: '900cc Rotax ACE',
      hp: 90,
      cylinders: 3,
      transmission: 'Jet Propulsion',
      bodyType: 'Jet Ski',
      doors: 0,
      seats: 3,
      extColor: 'Fiery Red',
      intColor: 'Black',
      warranty: true,
      serviceContract: false,
      location: 'Dubai',
      seller: 'Khaled Audi Showroom',
      verified: true,
      regionalSpec: 'GCC Specs',
      // Real image: Sea-Doo jet ski from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_69114d68b21f4352b6bd75eaa1367201~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_69114d68b21f4352b6bd75eaa1367201~mv2.jpeg',
    },
    // ── BOATS ──
    {
      id: 'oceanos-80ft',
      title: 'Oceanos 80ft Luxury Yacht',
      category: 'boats',
      make: 'Oceanos',
      model: '80ft Luxury Yacht',
      trim: 'Custom',
      price: 3550000,
      year: 2022,
      km: 180,
      condition: 'Used',
      engine: '2x Caterpillar C18',
      hp: 2400,
      cylinders: 18,
      transmission: 'Shaft Drive',
      bodyType: 'Motor Yacht',
      doors: 0,
      seats: 12,
      extColor: 'White',
      intColor: 'Cream/Teak',
      warranty: false,
      serviceContract: false,
      location: 'Dubai Marina',
      seller: 'Khaled Audi Showroom',
      verified: true,
      regionalSpec: 'GCC Specs',
      // Real image: Oceanos yacht from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_69ec1fe515224d7e8164f12b7a3c19a1~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_69ec1fe515224d7e8164f12b7a3c19a1~mv2.jpeg',
    },
    {
      id: 'nomad-95-2022',
      title: 'Nomad 95 / 2022 Model / 30 Meters',
      category: 'boats',
      make: 'Nomad',
      model: 'Nomad 95',
      trim: 'Standard',
      price: 2500000,
      year: 2022,
      km: 320,
      condition: 'Used',
      engine: '2x MAN V12',
      hp: 1800,
      cylinders: 12,
      transmission: 'Shaft Drive',
      bodyType: 'Superyacht',
      doors: 0,
      seats: 10,
      extColor: 'White',
      intColor: 'Walnut/Cream',
      warranty: false,
      serviceContract: false,
      location: 'Abu Dhabi',
      seller: 'Khaled Audi Showroom',
      verified: true,
      regionalSpec: 'GCC Specs',
      // Real image: Nomad yacht from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_8eec233050b545ea82e15f019b13dc56~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_8eec233050b545ea82e15f019b13dc56~mv2.jpeg',
    },
    {
      id: 'nomad-95-2022-b',
      title: 'Nomad 95 Superyacht 30M',
      category: 'boats',
      make: 'Nomad',
      model: 'Nomad 95',
      trim: 'Premium',
      price: 2800000,
      year: 2022,
      km: 210,
      condition: 'Used',
      engine: '2x MAN V12 1800hp',
      hp: 1800,
      cylinders: 12,
      transmission: 'Shaft Drive',
      bodyType: 'Superyacht',
      doors: 0,
      seats: 12,
      extColor: 'Pearl White',
      intColor: 'Dark Walnut/Beige',
      warranty: false,
      serviceContract: false,
      location: 'Fujairah',
      seller: 'Khaled Audi Showroom',
      verified: true,
      regionalSpec: 'GCC Specs',
      // Real image: second Nomad yacht from the Wix listing
      img: 'https://static.wixstatic.com/media/3789f2_034af66f42314e9aaddc4142ff0fda06~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_90,enc_avif,quality_auto/3789f2_034af66f42314e9aaddc4142ff0fda06~mv2.jpeg',
    },
  ];

  function formatPrice(p) {
    return 'AED ' + p.toLocaleString();
  }

  function getCounts() {
    const cars   = listings.filter(l => l.category === 'cars').length;
    const boats  = listings.filter(l => l.category === 'boats').length;
    const bikes  = listings.filter(l => l.category === 'bikes').length;
    const jetski = listings.filter(l => l.category === 'jetski').length;
    return { total: listings.length, cars, boats, bikes, jetski };
  }

  function getByCategory(cat) {
    if (!cat || cat === 'all') return listings;
    return listings.filter(l => l.category === cat);
  }

  function getById(id) {
    return listings.find(l => l.id === id) || null;
  }

  function renderCard(l) {
    return `
      <div class="listing-card" onclick="window.location.href='listing.html?id=${l.id}'">
        <div class="card-img-wrap">
          <img src="${l.img}" alt="${l.title}" loading="lazy" />
          <span class="card-badge ${l.condition === 'Brand New' ? 'badge-new' : 'badge-used'}">${l.condition}</span>
          ${l.verified ? '<span class="card-verified">✓ Verified</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-price">${formatPrice(l.price)}</div>
          <div class="card-title">${l.title}</div>
          <div class="card-pills">
            <span class="pill">${l.year}</span>
            <span class="pill">${l.km === 0 ? '0 KM' : l.km.toLocaleString() + ' KM'}</span>
            <span class="pill">${l.regionalSpec || 'GCC Specs'}</span>
          </div>
          <div class="card-location">📍 ${l.location}</div>
        </div>
        <div class="card-footer">
          <div class="card-seller">${l.seller}</div>
          <button class="btn-sm-orange" onclick="event.stopPropagation();window.location.href='listing.html?id=${l.id}'">Details</button>
        </div>
      </div>`;
  }

  return { listings, formatPrice, getCounts, getByCategory, getById, renderCard };
})();
