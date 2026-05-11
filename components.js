// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function renderNavbar(activePage = '') {
  // Inject auth-aware CSS once. Hides auth-dependent UI until updateNavbarAuthState
  // adds .auth-resolved on <html>, preventing the flash of mock data.
  if (!document.getElementById('dm-auth-css')) {
    const style = document.createElement('style');
    style.id = 'dm-auth-css';
    style.textContent = `
      /* Auth-dependent UI is hidden until auth state is determined. */
      html:not(.auth-resolved) .nav-user-btn,
      html:not(.auth-resolved) #nav-notif-btn,
      html:not(.auth-resolved) #nav-chat-btn,
      html:not(.auth-resolved) .btn-place-ad,
      html:not(.auth-resolved) #nav-signin-btn { visibility: hidden; opacity: 0; }
      html.auth-resolved .nav-user-btn,
      html.auth-resolved #nav-notif-btn,
      html.auth-resolved #nav-chat-btn,
      html.auth-resolved .btn-place-ad,
      html.auth-resolved #nav-signin-btn { visibility: visible; opacity: 1; transition: opacity .15s ease; }
      /* Same for profile.html sidebar/main cards */
      html:not(.auth-resolved) #sidebar-name,
      html:not(.auth-resolved) #sidebar-email,
      html:not(.auth-resolved) #sidebar-avatar,
      html:not(.auth-resolved) #main-name,
      html:not(.auth-resolved) #main-avatar,
      html:not(.auth-resolved) .profile-avatar-meta,
      html:not(.auth-resolved) .profile-form-grid,
      html:not(.auth-resolved) .dash-profile-card,
      html:not(.auth-resolved) .dash-nav { visibility: hidden; opacity: 0; }
      html.auth-resolved #sidebar-name,
      html.auth-resolved #sidebar-email,
      html.auth-resolved #sidebar-avatar,
      html.auth-resolved #main-name,
      html.auth-resolved #main-avatar,
      html.auth-resolved .profile-avatar-meta,
      html.auth-resolved .profile-form-grid,
      html.auth-resolved .dash-profile-card,
      html.auth-resolved .dash-nav { visibility: visible; opacity: 1; transition: opacity .15s ease; }
    `;
    document.head.appendChild(style);
  }

  document.getElementById('navbar-placeholder').innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="index.html" class="nav-logo">
          <div class="nav-logo-box"><img src="dm-icon.png" alt="DM" style="width:32px;height:32px;object-fit:contain;border-radius:4px;"></div>
          <div class="nav-logo-text">DUBI<span>MOTORS</span></div>
        </a>
        <div class="nav-right">
          <!-- Notification Bell -->
          <div class="nav-icon-btn" id="nav-notif-btn" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="nav-badge" id="nav-notif-count" style="display:none;">0</span>
            <div class="nav-dropdown" id="notif-dropdown" style="right:-40px;width:320px;">
              <div class="nav-dropdown-header">Notifications</div>
              <div style="padding:30px 16px;text-align:center;color:var(--grey);font-size:13px;line-height:1.6;">
                <div style="font-size:32px;margin-bottom:8px;">&#x1F514;</div>
                <div style="font-weight:700;color:var(--dark);margin-bottom:4px;">No notifications yet</div>
                <div>We&rsquo;ll let you know when something happens with your listings.</div>
              </div>
            </div>
          </div>
          <!-- Messages -->
          <div class="nav-icon-btn" id="nav-chat-btn" title="Messages">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span class="nav-badge" id="nav-chat-count" style="display:none;">0</span>
            <div class="nav-dropdown" id="chat-dropdown" style="right:-10px;width:300px;">
              <div class="nav-dropdown-header">Messages</div>
              <div style="padding:30px 16px;text-align:center;color:var(--grey);font-size:13px;line-height:1.6;">
                <div style="font-size:32px;margin-bottom:8px;">&#x1F4AC;</div>
                <div style="font-weight:700;color:var(--dark);margin-bottom:4px;">No messages yet</div>
                <div>Start by browsing listings and contacting sellers.</div>
              </div>
            </div>
          </div>
          <!-- User Avatar -->
          <div class="nav-user-btn" id="nav-user-btn">
            <div class="nav-user-avatar"></div>
            <div class="nav-dropdown" id="user-dropdown" style="right:0;width:230px;">
              <div class="nav-dropdown-header" style="flex-direction:column;align-items:flex-start;gap:2px;padding-bottom:14px;border-bottom:1px solid var(--border);margin-bottom:4px;">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="width:36px;height:36px;border-radius:50%;background:var(--orange);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0;"></div>
                  <div><div style="font-weight:800;font-size:14px;"></div><div style="font-size:11px;color:var(--grey);"></div></div>
                </div>
              </div>
              <a class="nav-dropdown-item" href="profile.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>&nbsp;My Profile</a>
              <a class="nav-dropdown-item" href="my-ads.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>&nbsp;My Ads <span id="dd-myads-count" style="margin-left:auto;background:var(--orange);color:#fff;font-size:10px;padding:1px 7px;border-radius:10px;display:none;">0</span></a>
              <a class="nav-dropdown-item" href="saved-searches.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>&nbsp;Saved Searches</a>
              <a class="nav-dropdown-item" href="notifications.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>&nbsp;Notifications <span id="dd-notif-count" style="margin-left:auto;background:var(--orange);color:#fff;font-size:10px;padding:1px 7px;border-radius:10px;display:none;">0</span></a>
              <a class="nav-dropdown-item" href="place-ad.html" style="color:var(--orange);font-weight:700;"><svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>&nbsp;Place an Ad</a>
              <a class="nav-dropdown-item" href="login.html" style="color:#E53935;border-top:1px solid var(--border);margin-top:4px;padding-top:12px;"><svg viewBox="0 0 24 24" fill="none" stroke="#E53935" stroke-width="2" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>&nbsp;Log Out</a>
            </div>
          </div>
          <button class="btn-place-ad" onclick="window.location.href='place-ad.html'">+ Place Your Ad</button>
          <button class="nav-hamburger" id="nav-hamburger-btn" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-nav-menu" id="mobile-nav-menu">
      <a href="index.html">🏠 Home</a>
      <a href="cars.html">🚗 Cars</a>
      <a href="marine.html">⛵ Boats &amp; Jet Skis</a>
      <a href="bikes.html">🏍 Motorcycles</a>
      <a href="heavy.html">🚛 Heavy Vehicles</a>
      <a href="plates.html">🔢 Number Plates</a>
      <a href="accessories.html">🔧 Auto Accessories</a>
      <div style="border-top:1px solid #333;margin-top:8px;padding-top:12px;display:flex;flex-direction:column;gap:4px;">
        <a href="profile.html" style="padding:10px 0;color:#aaa;font-size:14px;font-weight:600;">👤 My Profile</a>
        <a href="my-ads.html" style="padding:10px 0;color:#aaa;font-size:14px;font-weight:600;">📋 My Ads</a>
        <a href="chats.html" style="padding:10px 0;color:#aaa;font-size:14px;font-weight:600;">💬 Chats</a>
        <a href="notifications.html" style="padding:10px 0;color:#aaa;font-size:14px;font-weight:600;">🔔 Notifications</a>
        <a href="place-ad.html" style="padding:10px 0;color:var(--orange);font-size:14px;font-weight:700;">+ Place Your Ad</a>
        <a href="login.html" style="padding:10px 0;color:#E53935;font-size:14px;font-weight:600;">Log Out</a>
      </div>
    </div>`;

  // ── Attach event listeners AFTER innerHTML is set ──
  // Hamburger
  const hamburger = document.getElementById('nav-hamburger-btn');
  if (hamburger) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const menu = document.getElementById('mobile-nav-menu');
      if (menu) {
        const isOpen = menu.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }
    });
  }

  // Notification bell toggle
  const notifBtn = document.getElementById('nav-notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      _toggleNavDD('notif-dropdown');
    });
  }

  // Chat button toggle
  const chatBtn = document.getElementById('nav-chat-btn');
  if (chatBtn) {
    chatBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      _toggleNavDD('chat-dropdown');
    });
  }

  // User avatar toggle
  const userBtn = document.getElementById('nav-user-btn');
  if (userBtn) {
    userBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      _toggleNavDD('user-dropdown');
    });
  }

  // Close all dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#nav-notif-btn') &&
        !e.target.closest('#nav-chat-btn') &&
        !e.target.closest('#nav-user-btn')) {
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
    }
    // Close mobile nav
    const menu = document.getElementById('mobile-nav-menu');
    const btn = document.getElementById('nav-hamburger-btn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Apply current auth state (logged in vs logged out). updateNavbarAuthState
  // internally waits for window.Auth to load, so this works even though
  // components.js runs before the deferred auth.js script.
  updateNavbarAuthState();
  // Re-apply on auth changes (login, logout, token refresh from another tab).
  // Wait briefly for window.Auth to be ready before subscribing.
  (async () => {
    let tries = 0;
    while (!window.Auth && tries < 60) {
      await new Promise(r => setTimeout(r, 50));
      tries++;
    }
    if (window.Auth && typeof window.Auth.onChange === 'function') {
      window.Auth.onChange(() => updateNavbarAuthState());
    }
  })();
}

/**
 * Update the navbar to reflect the current auth state.
 * - Logged out: hide notif/chat/user, show Sign In button.
 * - Logged in:  fill in real name, email, initials; wire logout.
 */
async function updateNavbarAuthState() {
  // Wait for window.Auth to load. components.js runs synchronously at page render
  // time, but auth.js is deferred. Poll briefly until Auth shows up.
  let tries = 0;
  while (!window.Auth && tries < 60) {  // up to ~3 seconds
    await new Promise(r => setTimeout(r, 50));
    tries++;
  }
  if (!window.Auth) {
    console.warn('[components.js] window.Auth never became available; navbar not updated.');
    document.documentElement.classList.add('auth-resolved'); // unhide UI even on failure
    return;
  }
  const user = await window.Auth.getUser();
  const navRight = document.querySelector('.nav-right');
  if (!navRight) { document.documentElement.classList.add('auth-resolved'); return; }

  const notifBtn = document.getElementById('nav-notif-btn');
  const chatBtn  = document.getElementById('nav-chat-btn');
  const userBtn  = document.getElementById('nav-user-btn');
  const placeAdBtn = navRight.querySelector('.btn-place-ad');
  let signInBtn = document.getElementById('nav-signin-btn');

  if (!user) {
    // Logged out: hide auth-only UI, show Sign In button
    if (notifBtn) notifBtn.style.display = 'none';
    if (chatBtn)  chatBtn.style.display  = 'none';
    if (userBtn)  userBtn.style.display  = 'none';
    if (placeAdBtn) placeAdBtn.style.display = 'none';

    if (!signInBtn) {
      signInBtn = document.createElement('button');
      signInBtn.id = 'nav-signin-btn';
      signInBtn.className = 'btn-place-ad';
      signInBtn.textContent = 'Sign In';
      signInBtn.style.background = 'var(--orange)';
      signInBtn.onclick = async () => {
        // Prefer the in-page modal. If for some reason it isn't loaded, fall
        // back to the legacy login.html navigation.
        if (window.AuthModal) {
          const user = await window.AuthModal.open({ tab: 'login' });
          if (user) {
            // Refresh navbar with the now-signed-in state
            updateNavbarAuthState();
          }
        } else {
          const next = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = 'login.html?next=' + next;
        }
      };
      // Insert before the hamburger button so it sits in the right place
      const hamb = document.getElementById('nav-hamburger-btn');
      if (hamb) navRight.insertBefore(signInBtn, hamb);
      else navRight.appendChild(signInBtn);
    }

    // Mobile nav: hide auth-only entries, add a Sign In link
    const mobileNav = document.getElementById('mobile-nav-menu');
    if (mobileNav) {
      mobileNav.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (['profile.html','my-ads.html','chats.html','notifications.html','place-ad.html','login.html'].includes(href)) {
          a.style.display = 'none';
        }
      });
      if (!document.getElementById('mobile-signin-link')) {
        const link = document.createElement('a');
        link.id = 'mobile-signin-link';
        link.href = '#';
        link.textContent = '🔐 Sign In';
        link.style.cssText = 'padding:10px 0;color:var(--orange);font-size:14px;font-weight:700;';
        link.onclick = async (e) => {
          e.preventDefault();
          // Close the mobile nav first
          const mn = document.getElementById('mobile-nav-menu');
          if (mn) mn.classList.remove('open');
          document.body.style.overflow = '';
          if (window.AuthModal) {
            const user = await window.AuthModal.open({ tab: 'login' });
            if (user) updateNavbarAuthState();
          } else {
            window.location.href = 'login.html';
          }
        };
        const divider = mobileNav.querySelector('div[style*="border-top"]');
        if (divider) divider.appendChild(link);
        else mobileNav.appendChild(link);
      }
    }
    document.documentElement.classList.add('auth-resolved');
    return;
  }

  // Logged in: show auth-only UI, hide Sign In button if it exists
  if (notifBtn) notifBtn.style.display = '';
  if (chatBtn)  chatBtn.style.display  = '';
  if (userBtn)  userBtn.style.display  = '';
  if (placeAdBtn) placeAdBtn.style.display = '';
  if (signInBtn) signInBtn.style.display = 'none';

  // Hide the mobile sign-in link if we created one earlier
  const mobileSignIn = document.getElementById('mobile-signin-link');
  if (mobileSignIn) mobileSignIn.style.display = 'none';
  // Restore mobile auth links
  const mobileNav = document.getElementById('mobile-nav-menu');
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (['profile.html','my-ads.html','chats.html','notifications.html','place-ad.html','login.html'].includes(href)) {
        a.style.display = '';
      }
    });
  }

  // Pull real profile for display name + initials
  const profile = await window.Auth.getProfile();
  const displayName = (profile && profile.display_name) || (user.user_metadata && user.user_metadata.display_name) || user.email.split('@')[0];
  const email = user.email || '';
  const initials = displayName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  // Update navbar avatar (the small button)
  const avatarEl = userBtn ? userBtn.querySelector('.nav-user-avatar') : null;
  if (avatarEl) avatarEl.textContent = initials;

  // Fetch real My Ads count (active listings owned by this user) and show
  // a badge in the dropdown if > 0. Notifications/chats stay at 0 until those
  // features are built (Phase 4).
  if (window.supa) {
    try {
      const { count, error } = await window.supa
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id);
      if (!error && typeof count === 'number') {
        const myAdsBadge = document.getElementById('dd-myads-count');
        if (myAdsBadge) {
          myAdsBadge.textContent = count;
          myAdsBadge.style.display = count > 0 ? '' : 'none';
        }
      }
    } catch { /* non-fatal */ }

    // Notifications: load unread count + last 5 for the dropdown panel
    try {
      await loadNavbarNotifications(user.id);
    } catch (e) { console.warn('[components] notif load failed:', e); }

    // Chats: load unread count + recent conversations for the dropdown
    try {
      await loadNavbarChats(user.id);
    } catch (e) { console.warn('[components] chats load failed:', e); }
  }

  // Update dropdown header (the rich card at the top)
  const userDD = document.getElementById('user-dropdown');
  if (userDD) {
    const card = userDD.querySelector('.nav-dropdown-header');
    if (card) {
      const names = card.querySelectorAll('div[style*="font-weight:800"]');
      const subs  = card.querySelectorAll('div[style*="font-size:11px"]');
      names.forEach(n => n.textContent = displayName);
      subs.forEach(s => s.textContent = email);
      const bigAvatar = card.querySelector('div[style*="border-radius:50%"]');
      if (bigAvatar) bigAvatar.textContent = initials;
    }
    // Wire the logout link
    const logoutLink = userDD.querySelector('a[href="login.html"]');
    if (logoutLink) {
      logoutLink.onclick = async (e) => {
        e.preventDefault();
        await window.Auth.signOut();
        window.location.href = 'index.html';
      };
    }
  }

  // Mobile logout link too
  if (mobileNav) {
    const mLogout = mobileNav.querySelector('a[href="login.html"]');
    if (mLogout) {
      mLogout.textContent = 'Log Out';
      mLogout.onclick = async (e) => {
        e.preventDefault();
        await window.Auth.signOut();
        window.location.href = 'index.html';
      };
    }
  }
  document.documentElement.classList.add('auth-resolved');
}

function _toggleNavDD(id) {
  document.querySelectorAll('.nav-dropdown').forEach(d => {
    if (d.id !== id) d.classList.remove('open');
  });
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

// ──────────────────────────────────────────────────────────────────
// NAVBAR NOTIFICATIONS — load unread count + last 5 for dropdown
// ──────────────────────────────────────────────────────────────────
const NAV_NOTIF_ICONS = {
  inquiry:           '💬',
  listing_approved:  '✅',
  listing_rejected:  '⚠️',
  saved_search:      '🔍',
  price_drop:        '💰',
  expiry_reminder:   '⏰',
  system:            '🔔',
};

function _navTimeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h';
  const d = Math.floor(h / 24);
  if (d < 7) return d + 'd';
  return new Date(ts).toLocaleDateString();
}

function _navEscapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

async function loadNavbarNotifications(userId) {
  if (!window.supa || !userId) return;
  const badge = document.getElementById('nav-notif-count');
  const ddBadge = document.getElementById('dd-notif-count');
  const dropdown = document.getElementById('notif-dropdown');

  // Unread count
  try {
    const { count, error } = await window.supa
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('read_at', null);
    const n = (!error && typeof count === 'number') ? count : 0;
    if (badge) {
      badge.textContent = n > 99 ? '99+' : String(n);
      badge.style.display = n > 0 ? '' : 'none';
    }
    if (ddBadge) {
      ddBadge.textContent = String(n);
      ddBadge.style.display = n > 0 ? '' : 'none';
    }
  } catch (e) {
    console.warn('[components] notif unread count failed:', e);
  }

  // Recent 5 for dropdown
  if (!dropdown) return;
  try {
    const { data: recent, error } = await window.supa
      .from('notifications')
      .select('id, type, title, body, link_url, read_at, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) throw error;

    const itemsHtml = (recent || []).map(n => {
      const icon = NAV_NOTIF_ICONS[n.type] || NAV_NOTIF_ICONS.system;
      const unread = !n.read_at;
      // Per UX decision (round 5): the bell dropdown always navigates to
      // notifications.html regardless of the notification's link_url.
      // The notification ID is appended as a hash so the destination page can
      // scroll the row into view and visually highlight it briefly.
      const href = `notifications.html#n-${_navEscapeHtml(n.id)}`;
      return `
        <a href="${href}" style="display:flex;gap:10px;padding:10px 14px;border-bottom:1px solid var(--border);text-decoration:none;color:inherit;${unread ? 'background:#FFF7F2;' : ''}">
          <div style="font-size:18px;flex-shrink:0;">${icon}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:${unread ? '800' : '600'};color:var(--dark);line-height:1.3;">${_navEscapeHtml(n.title)}</div>
            ${n.body ? `<div style="font-size:12px;color:var(--grey);margin-top:2px;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${_navEscapeHtml(n.body)}</div>` : ''}
            <div style="font-size:11px;color:var(--grey);margin-top:3px;">${_navTimeAgo(n.created_at)}</div>
          </div>
          ${unread ? '<div style="width:8px;height:8px;border-radius:50%;background:var(--orange);flex-shrink:0;margin-top:6px;"></div>' : ''}
        </a>`;
    }).join('');

    const header = `<div class="nav-dropdown-header">Notifications</div>`;
    const footer = `<a href="notifications.html" style="display:block;padding:10px;text-align:center;font-size:12px;font-weight:700;color:var(--orange);text-decoration:none;border-top:1px solid var(--border);">View all notifications</a>`;

    if (!recent || recent.length === 0) {
      dropdown.innerHTML = `${header}
        <div style="padding:30px 16px;text-align:center;color:var(--grey);font-size:13px;line-height:1.6;">
          <div style="font-size:32px;margin-bottom:8px;">&#x1F514;</div>
          <div style="font-weight:700;color:var(--dark);margin-bottom:4px;">No notifications yet</div>
          <div>We&rsquo;ll let you know when something happens with your listings.</div>
        </div>${footer}`;
    } else {
      dropdown.innerHTML = `${header}<div style="max-height:360px;overflow-y:auto;">${itemsHtml}</div>${footer}`;
    }
  } catch (e) {
    console.warn('[components] notif recent fetch failed:', e);
  }
}

// Expose so other pages can refresh the badge after marking-read actions
window.dmRefreshNavbarNotifications = async function () {
  if (!window.Auth) return;
  const u = await window.Auth.getUser();
  if (u) await loadNavbarNotifications(u.id);
};

// ──────────────────────────────────────────────────────────────────
// NAVBAR CHATS — load total unread + recent conversations for dropdown
// ──────────────────────────────────────────────────────────────────
async function loadNavbarChats(userId) {
  if (!window.supa || !userId) return;
  const badge = document.getElementById('nav-chat-count');
  const dropdown = document.getElementById('chat-dropdown');

  try {
    // Fetch the user's conversations (RLS limits to ours). Pull listing summary
    // + counterpart profile id in one query, then resolve names in a 2nd query.
    const { data: convs, error } = await window.supa
      .from('conversations')
      .select(`
        id, listing_id, buyer_id, seller_id, last_message_at,
        buyer_unread_count, seller_unread_count,
        listing:listings ( title,
          listing_images ( url, is_primary, display_order ) )
      `)
      .order('last_message_at', { ascending: false })
      .limit(5);
    if (error) throw error;

    const conversations = convs || [];

    // Resolve "the other person's" display name
    const otherIds = [...new Set(conversations.map(c =>
      c.buyer_id === userId ? c.seller_id : c.buyer_id
    ))];
    let profilesById = {};
    if (otherIds.length) {
      const { data: profs } = await window.supa
        .from('profiles')
        .select('id, display_name')
        .in('id', otherIds);
      (profs || []).forEach(p => { profilesById[p.id] = p; });
    }

    // Sum total unread for this user across all conversations
    let totalUnread = 0;
    conversations.forEach(c => {
      const isBuyer = c.buyer_id === userId;
      totalUnread += isBuyer ? (c.buyer_unread_count || 0) : (c.seller_unread_count || 0);
    });

    if (badge) {
      badge.textContent = totalUnread > 99 ? '99+' : String(totalUnread);
      badge.style.display = totalUnread > 0 ? '' : 'none';
    }

    if (!dropdown) return;

    if (!conversations.length) {
      dropdown.innerHTML = `
        <div class="nav-dropdown-header">Messages</div>
        <div style="padding:30px 16px;text-align:center;color:var(--grey);font-size:13px;line-height:1.6;">
          <div style="font-size:32px;margin-bottom:8px;">&#x1F4AC;</div>
          <div style="font-weight:700;color:var(--dark);margin-bottom:4px;">No messages yet</div>
          <div>Browse listings and message a seller to start.</div>
        </div>
        <a href="chats.html" style="display:block;padding:10px;text-align:center;font-size:12px;font-weight:700;color:var(--orange);text-decoration:none;border-top:1px solid var(--border);">Open Chats</a>`;
      return;
    }

    const itemsHtml = conversations.map(c => {
      const isBuyer = c.buyer_id === userId;
      const otherId = isBuyer ? c.seller_id : c.buyer_id;
      const otherProfile = profilesById[otherId];
      const otherName = (otherProfile && otherProfile.display_name) || (isBuyer ? 'Seller' : 'Buyer');
      const listingTitle = (c.listing && c.listing.title) || 'Listing';
      const unread = isBuyer ? (c.buyer_unread_count || 0) : (c.seller_unread_count || 0);
      // Primary image
      const imgs = ((c.listing && c.listing.listing_images) || [])
        .slice()
        .sort((a,b) => (b.is_primary?1:0) - (a.is_primary?1:0) || (a.display_order||0) - (b.display_order||0));
      const thumb = imgs[0] ? imgs[0].url : '';
      return `
        <a href="chats.html?c=${_navEscapeHtml(c.id)}" style="display:flex;gap:10px;padding:10px 14px;border-bottom:1px solid var(--border);text-decoration:none;color:inherit;${unread > 0 ? 'background:#FFF7F2;' : ''}">
          <img src="${_navEscapeHtml(thumb)}" alt="" style="width:42px;height:42px;border-radius:8px;object-fit:cover;background:var(--light-grey);flex-shrink:0;" onerror="this.style.background='var(--light-grey)';this.removeAttribute('src');" />
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
              <div style="font-size:13px;font-weight:${unread > 0 ? '800' : '700'};color:var(--dark);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_navEscapeHtml(otherName)}</div>
              <div style="font-size:10px;color:var(--grey);flex-shrink:0;">${_navTimeAgo(c.last_message_at)}</div>
            </div>
            <div style="font-size:11px;color:var(--grey);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_navEscapeHtml(listingTitle)}</div>
            ${unread > 0 ? `<div style="display:inline-block;background:var(--orange);color:#fff;font-size:10px;font-weight:800;padding:2px 7px;border-radius:10px;margin-top:3px;">${unread} new</div>` : ''}
          </div>
        </a>`;
    }).join('');

    dropdown.innerHTML = `
      <div class="nav-dropdown-header">Messages</div>
      <div style="max-height:360px;overflow-y:auto;">${itemsHtml}</div>
      <a href="chats.html" style="display:block;padding:10px;text-align:center;font-size:12px;font-weight:700;color:var(--orange);text-decoration:none;border-top:1px solid var(--border);">Open All Conversations</a>`;
  } catch (e) {
    console.warn('[components] chats fetch failed:', e);
  }
}

window.dmRefreshNavbarChats = async function () {
  if (!window.Auth) return;
  const u = await window.Auth.getUser();
  if (u) await loadNavbarChats(u.id);
};

function renderDubiAgent() {
  const s = document.createElement('script');
  s.src = 'dubi-agent.js';
  document.body.appendChild(s);
}

function showToast(msg, duration = 3000) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function renderFooter() {
  renderDubiAgent();
  document.getElementById('footer-placeholder').innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div>
            <div class="footer-brand-name">DUBI<span>MOTORS</span></div>
            <div class="footer-brand-desc">The UAE's trusted marketplace for buying and selling cars, yachts, motorcycles, and jet skis. Verified listings. Real prices. Trusted sellers.</div>
            <div class="footer-social">
              <a class="social-btn" href="https://facebook.com" target="_blank" title="Facebook">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a class="social-btn" href="https://instagram.com" target="_blank" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a class="social-btn" href="https://twitter.com" target="_blank" title="X (Twitter)">
                <svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
              </a>
              <a class="social-btn" href="https://youtube.com" target="_blank" title="YouTube">
                <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="currentColor"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#080808"/></svg>
              </a>
              <a class="social-btn" href="https://wa.me/971500000000" target="_blank" title="WhatsApp">
                <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor"/></svg>
              </a>
              <a class="social-btn" href="https://tiktok.com" target="_blank" title="TikTok">
                <svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" fill="currentColor"/></svg>
              </a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Browse</div>
            <a class="footer-link" href="cars.html">Cars for Sale</a>
            <a class="footer-link" href="marine.html">Boats &amp; Jet Skis</a>
            <a class="footer-link" href="bikes.html">Motorcycles</a>
            <a class="footer-link" href="heavy.html">Heavy Vehicles</a>
            <a class="footer-link" href="plates.html">Number Plates</a>
            <a class="footer-link" href="accessories.html">Auto Accessories</a>
          </div>
          <div>
            <div class="footer-col-title">Services</div>
            <a class="footer-link" href="#">Car Finance</a>
            <a class="footer-link" href="#">Car Insurance</a>
            <a class="footer-link" href="place-ad.html">Place an Ad</a>
            <a class="footer-link" href="#">Dealer Portal</a>
            <a class="footer-link" href="#">Vehicle Inspection</a>
          </div>
          <div>
            <div class="footer-col-title">Company</div>
            <a class="footer-link" href="about.html">About DubiMotors</a>
            <a class="footer-link" href="#">Contact Us</a>
            <a class="footer-link" href="careers.html">Careers</a>
            <a class="footer-link" href="blog.html">Blog</a>
            <a class="footer-link" href="help.html">Help Centre</a>
            <a class="footer-link" href="privacy.html">Privacy Policy</a>
            <a class="footer-link" href="terms.html">Terms of Use</a>
            <a class="footer-link" href="privacy.html">Cookie Policy</a>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-copy">© 2026 DubiMotors. All rights reserved. UAE's First AI-Powered Vehicle Marketplace.</div>
          <div class="footer-legal">
            <a href="privacy.html">Privacy</a>
            <a href="terms.html">Terms</a>
            <a href="privacy.html">Cookies</a>
          </div>
        </div>
      </div>
    </footer>`;
}
