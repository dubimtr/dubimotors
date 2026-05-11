// ─── DUBIMOTORS SHARED DATA & HELPERS ────────────────────────────────────────
const DM = (() => {

  // Helper to build full-res Wix CDN URL from media hash
  function wix(hash, ext, w, h) {
    return `https://static.wixstatic.com/media/${hash}~mv2.${ext}/v1/fill/w_${w},h_${h},al_c,q_90,enc_avif,quality_auto/${hash}~mv2.${ext}`;
  }

  // Listings array — initially populated from the embedded fallback below,
  // then replaced (in place) by live Supabase data once DM.ready() resolves.
  // Page code holds references to this array, so we mutate it instead of
  // reassigning to keep those references valid.
  let listings = []; // Fallback emptied — all demo listings are now in Supabase via 11_demo_migration.sql

  // ─── SUPABASE LIVE DATA LOADER ─────────────────────────────────────────────
  // The fallback listings array above is replaced by live Supabase data when
  // available. If Supabase is unreachable (no client, network failure, etc.)
  // we keep the embedded fallback so the site never appears empty.

  // Convert a Supabase row (snake_case, separate images table) to the legacy
  // listing shape used throughout the codebase (camelCase, inline images).
  function toLegacyShape(row) {
    // Sort images by display_order, primary first
    const imgs = (row.listing_images || [])
      .slice()
      .sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.display_order || 0) - (b.display_order || 0);
      })
      .map(i => i.url);
    const primary = (row.listing_images || []).find(i => i.is_primary);

    // Pick a sensible seller logo from the seller name
    let sellerLogo = null;
    if (row.contact_name) {
      const name = row.contact_name.toLowerCase();
      if (name.includes('gta')) sellerLogo = 'logos/gta-cars.webp';
      else if (name.includes('sharmax')) sellerLogo = 'logos/sharmax.webp';
    }

    return {
      // Use legacy_id if present so existing URLs (sitemap, indexed pages) keep working.
      // Fall back to UUID id otherwise.
      id: row.legacy_id || row.id,
      uuid: row.id,                         // always available, for new code
      title: row.title,
      category: row.category,
      make: row.make,
      model: row.model,
      trim: row.trim,
      price: row.price,
      year: row.year,
      km: row.km,
      condition: row.condition,
      engine: row.engine,
      hp: row.hp,
      cylinders: row.cylinders,
      transmission: row.transmission,
      bodyType: row.body_type,
      doors: row.doors,
      seats: row.seats,
      color: row.color,
      fuelType: row.fuel_type,
      regionalSpec: row.regional_spec,
      location: row.location,
      seller: row.contact_name,
      sellerLogo,
      phone: row.contact_phone,
      verified: row.verified,
      status: row.status,         // 'active' | 'pending_review' | 'sold' | 'rejected' | 'expired'
      ownerId: row.owner_id,
      featured: row.featured,
      warranty: row.warranty,
      serviceHistory: row.service_history,
      serviceContract: row.service_history, // legacy alias for renderCard
      addedDate: row.created_at ? row.created_at.split('T')[0] : null,
      lat: row.latitude,
      lng: row.longitude,
      locationAddress: row.location,
      mainImg: primary ? primary.url : (imgs[0] || ''),
      images: imgs,
      description: row.description,
      isDemo: row.is_demo,
    };
  }

  // Single in-flight promise for the load. DM.ready() always returns this.
  let _readyPromise = null;
  let _loaded = false;

  function ready() {
    if (_readyPromise) return _readyPromise;

    // No Supabase client available → resolve immediately with the embedded fallback.
    if (typeof window === 'undefined' || !window.supa) {
      console.info('[DubiMotors] Supabase client not available; using embedded listings fallback.');
      _readyPromise = Promise.resolve();
      _loaded = true;
      return _readyPromise;
    }

    _readyPromise = (async () => {
      try {
        // Fetch active listings (visible to everyone)
        const activeRes = await window.supa
          .from('listings')
          .select('*, listing_images(url, is_primary, display_order)')
          .eq('status', 'active')
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (activeRes.error) {
          console.warn('[DubiMotors] Supabase listings query failed; keeping fallback:', activeRes.error.message);
          _loaded = true;
          return;
        }

        // Also fetch this user's OWN pending/rejected/sold listings (so they can preview).
        // Owner-only — others won't see these because of RLS + the status filter.
        let ownPending = [];
        try {
          const { data: { user } } = await window.supa.auth.getUser();
          if (user) {
            const ownRes = await window.supa
              .from('listings')
              .select('*, listing_images(url, is_primary, display_order)')
              .eq('owner_id', user.id)
              .neq('status', 'active')
              .order('created_at', { ascending: false });
            if (!ownRes.error && Array.isArray(ownRes.data)) ownPending = ownRes.data;
          }
        } catch { /* non-fatal */ }

        const data = (activeRes.data || []).concat(ownPending);
        if (data.length === 0) {
          console.info('[DubiMotors] Supabase returned no listings; keeping fallback.');
          _loaded = true;
          return;
        }

        const liveListings = data.map(toLegacyShape);
        // Replace contents of the array in place so existing references stay valid
        listings.length = 0;
        liveListings.forEach(l => listings.push(l));
        _loaded = true;
        console.info(`[DubiMotors] Loaded ${listings.length} listings from Supabase.`);

        // Notify any page-level code that wants to re-render with live data.
        // Pages can listen with: window.addEventListener('dm:listings-loaded', () => { ... })
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dm:listings-loaded', { detail: { count: listings.length } }));
        }
      } catch (e) {
        console.error('[DubiMotors] Unexpected error loading listings:', e);
        _loaded = true;
      }
    })();

    return _readyPromise;
  }

  // Auto-start the load once the DOM is ready (and deferred scripts like Supabase have loaded).
  // Pages that need data before rendering should still call `await DM.ready()`.
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => ready().catch(() => {}), { once: true });
    } else {
      // Already loaded (e.g. shared.js is deferred and executes after DOM is parsed)
      ready().catch(() => {});
    }
  }

  // ─── HELPERS ───────────────────────────────────────────────────────────────

  function formatPrice(p) {
    return 'AED ' + p.toLocaleString();
  }

  function getCounts() {
    const cars   = listings.filter(l => l.category === 'cars').length;
    const boats  = listings.filter(l => l.category === 'boats' || l.category === 'jetski').length;
    const bikes  = listings.filter(l => l.category === 'bikes').length;
    const jetski = listings.filter(l => l.category === 'jetski').length;
    const heavy  = listings.filter(l => l.category === 'heavy').length;
    return { total: listings.length, cars, boats, bikes, jetski, heavy };
  }

  function getByCategory(cat) {
    if (!cat || cat === 'all') return listings;
    return listings.filter(l => l.category === cat);
  }

  function getById(id) {
    return listings.find(l => l.id === id) || null;
  }

  function formatRelativeDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return diffDays + ' days ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
    if (diffDays < 365) return Math.floor(diffDays / 30) + ' months ago';
    return Math.floor(diffDays / 365) + ' years ago';
  }

  function renderCard(l) {
    const thumbSrc = l.mainImg || l.img || (l.images && l.images[0]) || '';
    // Build purple feature tags (stacked vertically)
    const featureTags = [];
    if (l.warranty) featureTags.push('Warranty');
    if (l.serviceContract) featureTags.push('Service Contract');
    const tagsHTML = featureTags.length
      ? featureTags.map(t => `<span class="tag-purple">${t}</span>`).join('')
      : '';
    // Posted date + tags block (tags stacked below posted date, on the right)
    const postedTagsHTML = `<div class="card-posted-tags">
      ${l.addedDate ? `<div class="card-posted">Posted: ${formatRelativeDate(l.addedDate)}</div>` : ''}
      ${tagsHTML ? `<div class="card-tags-stack">${tagsHTML}</div>` : ''}
    </div>`;
    // Contact buttons - icon only, sized to match Details button
    const phone = l.phone || '';
    const waMsg = encodeURIComponent('Hi, I am interested in the ' + l.title + ' listed on DubiMotors for ' + formatPrice(l.price));
    const contactHTML = phone ? `
      <div class="card-contact-btns">
        <a class="btn-call-icon" href="tel:${phone}" onclick="event.stopPropagation()" aria-label="Call seller" title="Call seller"><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z'/></svg></a>
        <a class="btn-wa-icon" href="https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${waMsg}" target="_blank" onclick="event.stopPropagation()" aria-label="WhatsApp seller" title="WhatsApp seller"><svg viewBox='0 0 24 24' fill='currentColor'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z'/><path d='M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.335-1.508A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.213-3.76.895.952-3.653-.234-.374A9.818 9.818 0 1112 21.818z'/></svg></a>
      </div>` : '';
    // Seller avatar: logo image or initials fallback
    const sellerAvatarHTML = l.sellerLogo
      ? `<img class="card-seller-avatar" src="${l.sellerLogo}" alt="${l.seller}" />`
      : `<span class="card-seller-initials">${l.seller.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}</span>`;
    // Location row
    const locHTML = `<div class="card-location-row"><span class="card-location">📍 ${l.location}</span></div>`;
    return `
      <div class="listing-card" onclick="window.location.href='listing.html?id=${l.id}'">
        <div class="card-img-wrap">
          <img src="${thumbSrc}" alt="${l.title}" loading="lazy" />
          <span class="card-badge ${l.condition === 'Brand New' ? 'badge-new' : 'badge-used'}">${l.condition}</span>
          ${l.verified ? '<span class="card-verified">✓ Verified</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-price-row">
            <div class="card-price">${formatPrice(l.price)}</div>
            ${postedTagsHTML}
          </div>
          <div class="card-title">${l.title}</div>
          <div class="card-pills">
            <span class="pill">${l.year}</span>
            <span class="pill">${l.km === 0 ? '0 KM' : l.km.toLocaleString() + ' KM'}</span>
            <span class="pill">${l.regionalSpec || 'GCC Specs'}</span>
          </div>
          ${locHTML}
        </div>
        <div class="card-footer">
          <div class="card-seller-wrap">
            ${sellerAvatarHTML}
            <span class="card-seller">${l.seller}</span>
          </div>
          <div class="card-footer-right">
            ${contactHTML}
            <button class="btn-sm-orange" onclick="event.stopPropagation();window.location.href='listing.html?id=${l.id}'">Details</button>
          </div>
        </div>
      </div>`;
  }

  return { listings, formatPrice, getCounts, getByCategory, getById, renderCard, ready, isLoaded: () => _loaded };
})();

// Node.js (server-side) export — ignored by browsers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DM;
}
