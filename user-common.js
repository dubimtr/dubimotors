/**
 * DubiMotors — User Dashboard Common Utilities
 * Shared state, mock data, and helpers for all user pages.
 */

/* ── Demo User State ── */
const DM_USER = {
  name: 'Ahmed Al Rashidi',
  email: 'ahmed@example.com',
  phone: '+971 50 123 4567',
  location: 'Dubai, UAE',
  avatar: null, // null = show initials
  memberSince: 'March 2024',
  verified: true,
  totalAds: 4,
  activeAds: 3,
  savedSearches: 3,
  unreadChats: 2,
  unreadNotifications: 5,
};

/* ── Mock Ads ── */
const DM_MY_ADS = [
  {
    id: 'ad-001',
    title: '2022 Mercedes-Benz C-Class C200',
    category: 'cars',
    price: 185000,
    status: 'active',
    views: 342,
    inquiries: 8,
    img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80',
    postedDate: '2025-02-10',
    expiryDate: '2025-04-10',
    location: 'Dubai',
    verified: true,
  },
  {
    id: 'ad-002',
    title: '2021 Toyota Land Cruiser GXR',
    category: 'cars',
    price: 320000,
    status: 'active',
    views: 891,
    inquiries: 21,
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
    postedDate: '2025-01-28',
    expiryDate: '2025-03-28',
    location: 'Abu Dhabi',
    verified: true,
  },
  {
    id: 'ad-003',
    title: '2023 Kawasaki Ninja ZX-10R',
    category: 'bikes',
    price: 58000,
    status: 'active',
    views: 156,
    inquiries: 4,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    postedDate: '2025-03-01',
    expiryDate: '2025-05-01',
    location: 'Dubai',
    verified: false,
  },
  {
    id: 'ad-004',
    title: '2019 BMW 5 Series 520i',
    category: 'cars',
    price: 115000,
    status: 'expired',
    views: 1204,
    inquiries: 33,
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80',
    postedDate: '2024-11-15',
    expiryDate: '2025-01-15',
    location: 'Sharjah',
    verified: true,
  },
];

/* ── Mock Saved Searches ── */
const DM_SAVED_SEARCHES = [
  {
    id: 'ss-001',
    label: 'Toyota Land Cruiser — Dubai',
    url: 'cars.html?make=Toyota&model=Land+Cruiser&location=Dubai',
    filters: { make: 'Toyota', model: 'Land Cruiser', location: 'Dubai', priceMax: 400000 },
    newResults: 7,
    savedDate: '2025-02-20',
    alertEnabled: true,
  },
  {
    id: 'ss-002',
    label: 'Porsche 911 — Under AED 500K',
    url: 'cars.html?make=Porsche&model=911&priceMax=500000',
    filters: { make: 'Porsche', model: '911', priceMax: 500000 },
    newResults: 2,
    savedDate: '2025-01-14',
    alertEnabled: true,
  },
  {
    id: 'ss-003',
    label: 'Jet Ski — Yamaha — Abu Dhabi',
    url: 'jetski.html?make=Yamaha&location=Abu+Dhabi',
    filters: { make: 'Yamaha', location: 'Abu Dhabi' },
    newResults: 0,
    savedDate: '2025-03-05',
    alertEnabled: false,
  },
];

/* ── Mock Recent Searches ── */
const DM_RECENT_SEARCHES = [
  { id: 'rs-001', query: 'Toyota Land Cruiser 2022', url: 'cars.html?q=Toyota+Land+Cruiser+2022', time: '2 hours ago' },
  { id: 'rs-002', query: 'BMW 7 Series Dubai', url: 'cars.html?q=BMW+7+Series+Dubai', time: '5 hours ago' },
  { id: 'rs-003', query: 'Yamaha R1 motorcycle', url: 'bikes.html?q=Yamaha+R1', time: 'Yesterday' },
  { id: 'rs-004', query: 'Porsche Cayenne 2023', url: 'cars.html?q=Porsche+Cayenne+2023', time: 'Yesterday' },
  { id: 'rs-005', query: 'Dubai number plate A 5', url: 'plates.html?q=A+5', time: '2 days ago' },
  { id: 'rs-006', query: 'Mercedes G63 AMG', url: 'cars.html?q=Mercedes+G63', time: '3 days ago' },
  { id: 'rs-007', query: 'Jet ski Kawasaki Ultra', url: 'jetski.html?q=Kawasaki+Ultra', time: '4 days ago' },
  { id: 'rs-008', query: 'Range Rover Sport 2021', url: 'cars.html?q=Range+Rover+Sport+2021', time: '5 days ago' },
];

/* ── Mock Chats ── */
const DM_CHATS = [
  {
    id: 'chat-001',
    with: 'Khalid Motors LLC',
    avatar: null,
    initials: 'KM',
    avatarColor: '#2196F3',
    listing: '2022 Mercedes-Benz C-Class C200',
    listingImg: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=80&q=80',
    lastMessage: 'Is the price negotiable? I can offer 175,000 AED.',
    time: '10:32 AM',
    unread: 2,
    messages: [
      { from: 'them', text: 'Hello, is this car still available?', time: '10:15 AM' },
      { from: 'me', text: 'Yes, it is! Are you interested?', time: '10:18 AM' },
      { from: 'them', text: 'Very much. Can I see it today?', time: '10:25 AM' },
      { from: 'me', text: 'Sure, I am available after 5 PM in Dubai Marina.', time: '10:28 AM' },
      { from: 'them', text: 'Is the price negotiable? I can offer 175,000 AED.', time: '10:32 AM' },
    ],
  },
  {
    id: 'chat-002',
    with: 'Sara Al Mansoori',
    avatar: null,
    initials: 'SM',
    avatarColor: '#9C27B0',
    listing: '2021 Toyota Land Cruiser GXR',
    listingImg: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=80&q=80',
    lastMessage: 'Thank you for the info. I will think about it.',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { from: 'them', text: 'Hi, does this Land Cruiser have a full service history?', time: 'Yesterday 2:10 PM' },
      { from: 'me', text: 'Yes, full agency service history with Toyota. All records available.', time: 'Yesterday 2:45 PM' },
      { from: 'them', text: 'What about the warranty?', time: 'Yesterday 3:00 PM' },
      { from: 'me', text: 'Still under manufacturer warranty until December 2025.', time: 'Yesterday 3:05 PM' },
      { from: 'them', text: 'Thank you for the info. I will think about it.', time: 'Yesterday 3:10 PM' },
    ],
  },
  {
    id: 'chat-003',
    with: 'Omar Bikes Shop',
    avatar: null,
    initials: 'OB',
    avatarColor: '#E8450A',
    listing: '2023 Kawasaki Ninja ZX-10R',
    listingImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80',
    lastMessage: 'Can you share more photos of the exhaust?',
    time: '2 days ago',
    unread: 0,
    messages: [
      { from: 'them', text: 'Is this the track edition or street?', time: '2 days ago' },
      { from: 'me', text: 'Street edition, but with Akrapovic exhaust fitted.', time: '2 days ago' },
      { from: 'them', text: 'Can you share more photos of the exhaust?', time: '2 days ago' },
    ],
  },
];

/* ── Mock Notifications ── */
const DM_NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'inquiry',
    icon: '💬',
    iconColor: '#2196F3',
    title: 'New inquiry on your listing',
    body: 'Khalid Motors LLC sent you a message about your 2022 Mercedes-Benz C-Class.',
    time: '10 minutes ago',
    read: false,
    link: 'chats.html',
  },
  {
    id: 'notif-002',
    type: 'inquiry',
    icon: '💬',
    iconColor: '#2196F3',
    title: 'New inquiry on your listing',
    body: 'A buyer is interested in your 2021 Toyota Land Cruiser GXR.',
    time: '2 hours ago',
    read: false,
    link: 'chats.html',
  },
  {
    id: 'notif-003',
    type: 'saved_search',
    icon: '🔔',
    iconColor: '#E8450A',
    title: '7 new results for your saved search',
    body: '"Toyota Land Cruiser — Dubai" has 7 new listings matching your criteria.',
    time: '5 hours ago',
    read: false,
    link: 'saved-searches.html',
  },
  {
    id: 'notif-004',
    type: 'verified',
    icon: '✅',
    iconColor: '#4CAF50',
    title: 'Your listing has been verified',
    body: 'Your 2022 Mercedes-Benz C-Class C200 has been verified by AI and is now live.',
    time: 'Yesterday',
    read: false,
    link: 'my-ads.html',
  },
  {
    id: 'notif-005',
    type: 'saved_search',
    icon: '🔔',
    iconColor: '#E8450A',
    title: '2 new results for your saved search',
    body: '"Porsche 911 — Under AED 500K" has 2 new listings.',
    time: 'Yesterday',
    read: false,
    link: 'saved-searches.html',
  },
  {
    id: 'notif-006',
    type: 'expiry',
    icon: '⏰',
    iconColor: '#FF9800',
    title: 'Listing expiring soon',
    body: 'Your 2021 Toyota Land Cruiser GXR listing expires in 3 days. Renew it to keep it visible.',
    time: '2 days ago',
    read: true,
    link: 'my-ads.html',
  },
  {
    id: 'notif-007',
    type: 'view_milestone',
    icon: '👁️',
    iconColor: '#9C27B0',
    title: 'Your listing hit 500 views!',
    body: 'Your 2021 Toyota Land Cruiser GXR has been viewed 891 times.',
    time: '3 days ago',
    read: true,
    link: 'my-ads.html',
  },
];

/* ── Helpers ── */
function dmFormatPrice(p) {
  return 'AED ' + p.toLocaleString('en-AE');
}
function dmTimeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 30) return diff + ' days ago';
  if (diff < 365) return Math.floor(diff/30) + ' months ago';
  return Math.floor(diff/365) + ' year(s) ago';
}
function dmGetInitials(name) {
  if (!name) return 'U';
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').substring(0, 2).toUpperCase() || 'U';
}

/**
 * Fill the dashboard sidebar (used by my-ads, saved-searches, recent-searches,
 * chats, notifications, profile pages) with REAL user data from Supabase auth.
 *
 * Looks for these elements (all optional — no error if any are missing):
 *   .dash-avatar       — user initials
 *   .dash-name         — display name
 *   .dash-email        — email
 *   .dash-stat-num     — first one is Active Ads, second is Saved/Favourites
 *   .dash-nav-badge    — sidebar nav badges; hidden unless count > 0
 *
 * This is called on each user page. Polls briefly for window.Auth to load.
 */
/**
 * Fill the dashboard sidebar with REAL user data from Supabase auth.
 *
 * Performance strategy:
 * - On first page load, fetch user + profile + counts, cache in sessionStorage
 * - On subsequent page navigations, render INSTANTLY from cache (no flicker, no
 *   wait for Mumbai round trip)
 * - Then refresh from Supabase in the background to catch any changes
 *
 * Cache key: 'dm_sidebar_cache_v1'. Cleared on signOut and when stale (>10 min).
 *
 * Looks for these elements (all optional — no error if any are missing):
 *   .dash-avatar       — user initials
 *   .dash-name         — display name
 *   .dash-email        — email
 *   .dash-stat-num     — first one is Active Ads, second is Saved/Favourites
 *   .dash-nav-badge    — sidebar nav badges; hidden unless count > 0
 */
const DM_SIDEBAR_CACHE_KEY = 'dm_sidebar_cache_v1';
const DM_SIDEBAR_CACHE_TTL = 10 * 60 * 1000; // 10 min — stale cache still renders, just background-refreshed sooner

function dmReadSidebarCache() {
  try {
    const raw = sessionStorage.getItem(DM_SIDEBAR_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.userId) return null;
    return parsed;
  } catch { return null; }
}

function dmWriteSidebarCache(data) {
  try { sessionStorage.setItem(DM_SIDEBAR_CACHE_KEY, JSON.stringify(data)); } catch {}
}

function dmClearSidebarCache() {
  try { sessionStorage.removeItem(DM_SIDEBAR_CACHE_KEY); } catch {}
}

// Apply a cache snapshot synchronously to the DOM (used both for instant render
// and for re-render after background refresh).
function dmApplySidebarSnapshot(snap) {
  if (!snap) return;
  const avatarEl = document.querySelector('.dash-avatar');
  const nameEl   = document.querySelector('.dash-name');
  const emailEl  = document.querySelector('.dash-email');
  if (avatarEl) avatarEl.textContent = snap.initials || '';
  if (nameEl)   nameEl.textContent   = snap.displayName || '';
  if (emailEl)  emailEl.textContent  = snap.email || '';

  // Verified badge — show/hide based on profile.email_verified_at
  // Every dashboard page has a `.dash-verified-badge` element. We use the snap's
  // isVerified flag (set by dmFillDashboardSidebar) to decide whether to show it.
  // If isVerified is undefined (legacy cache without the field), default to
  // showing it so we don't regress for verified users on first load after deploy.
  const verifiedBadge = document.querySelector('.dash-verified-badge, #sidebar-verified-badge');
  if (verifiedBadge) {
    const shouldShow = (snap.isVerified === undefined) ? true : !!snap.isVerified;
    verifiedBadge.style.display = shouldShow ? '' : 'none';
  }

  const stats = document.querySelectorAll('.dash-stat-num');
  if (stats[0] && typeof snap.activeCount === 'number') stats[0].textContent = snap.activeCount;
  if (stats[1] && typeof snap.savedCount  === 'number') stats[1].textContent = snap.savedCount;

  // Sidebar nav badges: show My Ads count if > 0
  document.querySelectorAll('.dash-nav-badge').forEach(b => b.style.display = 'none');
  const myAdsLink = document.querySelector('a[href="my-ads.html"].dash-nav-item');
  if (myAdsLink) {
    const badge = myAdsLink.querySelector('.dash-nav-badge');
    if (badge && snap.activeCount > 0) {
      badge.textContent = snap.activeCount;
      badge.style.display = '';
    }
  }
  // Favourites count badge in sidebar
  const favLink = document.querySelector('a[href="favourites.html"].dash-nav-item');
  if (favLink) {
    const badge = favLink.querySelector('.dash-nav-badge');
    if (badge && snap.savedCount > 0) {
      badge.textContent = snap.savedCount;
      badge.style.display = '';
    }
  }
  // Chats unread count badge in sidebar (don't overwrite if the current page
  // managed its own count, e.g. chats.html updates it live)
  const chatsLink = document.querySelector('a[href="chats.html"].dash-nav-item');
  if (chatsLink && typeof snap.chatsUnread === 'number') {
    const badge = chatsLink.querySelector('.dash-nav-badge');
    if (badge && snap.chatsUnread > 0) {
      badge.textContent = snap.chatsUnread;
      badge.style.display = '';
    }
  }
}

async function dmFillDashboardSidebar() {
  if (typeof window === 'undefined') return;

  // ─── 1. INSTANT RENDER from cache (if any) ───
  const cache = dmReadSidebarCache();
  if (cache) {
    dmApplySidebarSnapshot(cache);
    // Reveal the sidebar immediately — no waiting for network
    document.documentElement.classList.add('auth-resolved');
  }

  // ─── 2. BACKGROUND REFRESH (always runs, may update DOM if data changed) ───
  // Wait for Auth to load
  let tries = 0;
  while (!window.Auth && tries < 60) { await new Promise(r => setTimeout(r, 50)); tries++; }
  if (!window.Auth) return;

  const user = await window.Auth.getUser();
  if (!user) {
    // Not logged in — clear cache and bail (page's own requireAuth will redirect)
    dmClearSidebarCache();
    return;
  }

  // If the cached user is a different user than the actual one, drop the cache
  // (e.g. signed out + back in as someone else)
  if (cache && cache.userId && cache.userId !== user.id) {
    dmClearSidebarCache();
  }

  const profile = await window.Auth.getProfile();
  const displayName = (profile && profile.display_name)
    || (user.user_metadata && user.user_metadata.display_name)
    || (user.email ? user.email.split('@')[0] : 'User');
  const email = user.email || '';
  const initials = dmGetInitials(displayName);

  let activeCount = (cache && cache.activeCount) || 0;
  let savedCount  = (cache && cache.savedCount)  || 0;
  let chatsUnread = (cache && cache.chatsUnread) || 0;

  if (window.supa) {
    try {
      const [adsRes, favRes, convsRes] = await Promise.all([
        window.supa.from('listings')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', user.id)
          .eq('status', 'active'),
        window.supa.from('favourites')
          .select('listing_id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        // For chats unread count we need to sum the relevant column. There's no
        // server-side SUM with the JS client, so pull all conversations (RLS
        // scopes them to ours) and sum locally. A user typically has <100 convs
        // so this is fine.
        window.supa.from('conversations')
          .select('buyer_id, buyer_unread_count, seller_unread_count'),
      ]);
      if (typeof adsRes.count === 'number') activeCount = adsRes.count;
      if (typeof favRes.count === 'number') savedCount  = favRes.count;
      if (Array.isArray(convsRes.data)) {
        chatsUnread = convsRes.data.reduce((sum, c) => {
          const isBuyer = c.buyer_id === user.id;
          return sum + (isBuyer ? (c.buyer_unread_count || 0) : (c.seller_unread_count || 0));
        }, 0);
      }
    } catch (e) {
      console.warn('[dmFillDashboardSidebar] count fetch failed:', e);
    }
  }

  // Verified status — primary source is auth.users.email_confirmed_at (Supabase
  // sets this on email confirmation, always authoritative). Fall back to the
  // profile column if for some reason the auth-level flag isn't set.
  // We treat user as verified if EITHER source is non-null.
  const authConfirmed = !!(user.email_confirmed_at || (user.confirmed_at) ||
                          (user.user_metadata && user.user_metadata.email_verified));
  const profileVerified = !!(profile && profile.email_verified_at);
  const isVerified = authConfirmed || profileVerified;

  const fresh = {
    userId: user.id,
    displayName,
    email,
    initials,
    isVerified,
    activeCount,
    savedCount,
    chatsUnread,
    cachedAt: Date.now(),
  };

  // Apply the fresh snapshot (overwrites instant cache render)
  dmApplySidebarSnapshot(fresh);
  dmWriteSidebarCache(fresh);

  // Wire the Log Out button (sidebar usually has its own)
  const logoutLinks = document.querySelectorAll('a[href="login.html"].dash-nav-item, .dash-logout');
  logoutLinks.forEach(a => {
    a.onclick = async (e) => {
      e.preventDefault();
      dmClearSidebarCache();
      if (window.Auth) await window.Auth.signOut();
      window.location.href = 'index.html';
    };
  });

  // Reveal the now-populated sidebar (idempotent — already added if cache existed)
  document.documentElement.classList.add('auth-resolved');
}

if (typeof window !== 'undefined') {
  window.DM_USER = DM_USER;
  window.DM_MY_ADS = DM_MY_ADS;
  window.DM_SAVED_SEARCHES = DM_SAVED_SEARCHES;
  window.DM_RECENT_SEARCHES = DM_RECENT_SEARCHES;
  window.DM_CHATS = DM_CHATS;
  window.DM_NOTIFICATIONS = DM_NOTIFICATIONS;
  window.dmFormatPrice = dmFormatPrice;
  window.dmTimeAgo = dmTimeAgo;
  window.dmGetInitials = dmGetInitials;
  window.dmFillDashboardSidebar = dmFillDashboardSidebar;
  window.dmClearSidebarCache = dmClearSidebarCache;

  // ─── Recent search recorder (localStorage-backed) ───
  // Call from category pages with the user's query + filter state.
  // De-dupes consecutive identical queries, caps at 8 entries.
  window.dmRecordRecentSearch = function (entry) {
    try {
      if (!entry || (!entry.query && !entry.filters)) return;
      const KEY = 'dm_recent_searches_v1';
      let arr = [];
      try { arr = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch {}
      if (!Array.isArray(arr)) arr = [];
      const newEntry = {
        id: (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) || (Date.now() + '-' + Math.random()),
        query: entry.query || 'Search',
        filters: entry.filters || {},
        url: entry.url || window.location.pathname + window.location.search,
        ts: Date.now(),
      };
      // De-dupe: if last entry has identical query+url, just bump its timestamp
      if (arr.length && arr[0].query === newEntry.query && arr[0].url === newEntry.url) {
        arr[0].ts = newEntry.ts;
      } else {
        arr.unshift(newEntry);
      }
      arr = arr.slice(0, 8);
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch {}
  };

  // ─── Universal filter collector ───
  //
  // Each category page (cars/bikes/boats/etc) has its own filter inputs but
  // they follow consistent ID/class conventions. This helper scans the current
  // page's DOM for every known filter widget and returns a single `filters`
  // object that can be saved into saved_searches.filters jsonb or appended
  // to a URL.
  //
  // Returns an object like:
  //   { category, location, make, model, condition, price_min, price_max,
  //     year_min, year_max, km_min, km_max, verified, warranty, service_contract,
  //     owner, dealer, body_types: [...], transmissions: [...], doors: [...],
  //     cylinders: [...], fuels: [...], colors: [...], q }
  //
  // Only includes keys that have a non-default value (i.e. the user actually
  // set them). This lets us count "did the user filter anything" by checking
  // Object.keys(filters).length > 1 (more than just category).
  window.dmBuildCategoryFilters = function (category) {
    const f = { category: category || 'cars' };
    const v = (id) => { const e = document.getElementById(id); return e ? e.value : ''; };
    const chk = (id) => { const e = document.getElementById(id); return !!(e && e.checked); };
    const multi = (sel) => Array.from(document.querySelectorAll(sel)).map(x => x.value);

    // Dropdowns
    const city = v('filterCity');        if (city)  f.location  = city;
    const make = v('filterMake');        if (make)  f.make      = make;
    const model = v('filterModel');      if (model) f.model     = model;
    const trim = v('filterTrim');        if (trim)  f.trim      = trim;
    const cond = v('filterCondition');   if (cond)  f.condition = cond;
    const type = v('filterType');        if (type)  f.type      = type;       // marine
    const compat = v('filterCompat');    if (compat) f.compatibility = compat; // accessories

    // Numeric ranges
    const pMin = parseFloat(v('priceMin')); if (!isNaN(pMin) && pMin > 0) f.price_min = pMin;
    const pMax = parseFloat(v('priceMax')); if (!isNaN(pMax) && pMax > 0) f.price_max = pMax;
    const yMin = parseInt(v('yearMin'));    if (!isNaN(yMin) && yMin > 0) f.year_min  = yMin;
    const yMax = parseInt(v('yearMax'));    if (!isNaN(yMax) && yMax > 0) f.year_max  = yMax;
    const kMin = parseFloat(v('kmMin'));    if (!isNaN(kMin) && kMin > 0) f.km_min    = kMin;
    const kMax = parseFloat(v('kmMax'));    if (!isNaN(kMax) && kMax > 0) f.km_max    = kMax;

    // Boolean flags (only include if checked — unchecked is the default)
    if (chk('cb-verified')) f.verified         = true;
    if (chk('cb-warranty')) f.warranty         = true;
    if (chk('cb-service'))  f.service_contract = true;
    if (chk('cb-transfer')) f.transfer         = true;   // plates
    if (chk('cb-owner') && !chk('cb-dealer')) f.seller_type = 'owner';
    else if (chk('cb-dealer') && !chk('cb-owner')) f.seller_type = 'dealer';

    // Multi-select checkboxes (omit when empty)
    const bodies = multi('.cb-body:checked');
    if (bodies.length) f.body_types = bodies;
    const trans = multi('.cb-trans:checked');
    if (trans.length) f.transmissions = trans;
    const doors = multi('.cb-doors:checked');
    if (doors.length) f.doors = doors;
    const cyls = multi('.cb-cyl:checked');
    if (cyls.length) f.cylinders = cyls;
    const fuels = multi('.cb-fuel:checked');
    if (fuels.length) f.fuels = fuels;
    const engs = multi('.cb-engine:checked');
    if (engs.length) f.engine_types = engs;

    // Active colour chips (page-level state, exposed as window.activeColors)
    if (window.activeColors && window.activeColors.size) {
      f.colors = Array.from(window.activeColors);
    }

    // Search query, if present and non-empty
    const q = v('searchInput') || v('topSearch');
    if (q) f.q = q;

    return f;
  };

  // ─── Universal saveCurrentSearch ───
  //
  // Single implementation used by all 8 category pages. Each page just calls
  // window.dmSaveCurrentSearch(<category>) from its Save Search button.
  //
  // Flow:
  //   1. Build the filter snapshot from the current page's DOM
  //   2. Reject if no real filters set (just category)
  //   3. Require auth (open modal or redirect)
  //   4. Insert into saved_searches with a readable auto-generated name
  //   5. Briefly flip the button to "✓ Saved"
  window.dmSaveCurrentSearch = async function (category, btnEl) {
    const filters = window.dmBuildCategoryFilters(category || 'cars');
    const filterCount = Object.keys(filters).length - 1; // subtract category
    if (filterCount === 0) {
      alert('Set at least one filter before saving the search.');
      return;
    }

    if (!window.Auth) { alert('Please sign in to save searches.'); return; }
    let user = await window.Auth.getUser();
    if (!user) {
      if (window.AuthModal) {
        user = await window.AuthModal.open({ tab: 'login', reason: 'Sign in to save searches.' });
        if (!user) return;
      } else {
        window.location.href = 'login.html?next=' + encodeURIComponent(window.location.pathname + window.location.search);
        return;
      }
    }

    // Build a readable name from the most distinctive filters
    const parts = [];
    if (filters.make)     parts.push(filters.make);
    if (filters.model)    parts.push(filters.model);
    if (filters.type)     parts.push(filters.type);
    if (filters.location) parts.push('in ' + filters.location);
    const name = parts.join(' ') || (filters.q || (category || 'Search') + ' search');

    const btn = btnEl || (typeof event !== 'undefined' && event && event.target ? event.target.closest('button') : null);
    if (btn) btn.disabled = true;

    try {
      const { error } = await window.supa.from('saved_searches').insert({
        user_id: user.id,
        name,
        filters,
      });
      if (error) throw error;
      // Brief visual confirmation
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Saved';
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 2200);
      }
    } catch (e) {
      if (btn) btn.disabled = false;
      alert('Could not save search: ' + (e.message || 'unknown error'));
    }
  };
}
