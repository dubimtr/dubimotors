// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function renderNavbar(activePage = '') {
  const pages = [
    { href: 'cars.html', label: 'Cars', key: 'cars' },
    { href: 'boats.html', label: 'Boats', key: 'boats' },
    { href: 'bikes.html', label: 'Motorcycles', key: 'bikes' },
    { href: 'jetski.html', label: 'Jet Skis', key: 'jetski' },
    { href: 'heavy.html', label: 'Heavy Vehicles', key: 'heavy' },
    { href: 'plates.html', label: 'Number Plates', key: 'plates' },
    { href: 'accessories.html', label: 'Accessories', key: 'accessories' },
    { href: '#', label: 'Finance', key: 'finance' },
    { href: '#', label: 'Dealers', key: 'dealers' },
  ];
  document.getElementById('navbar-placeholder').innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="index.html" class="nav-logo">
          <div class="nav-logo-box"><img src="dm-icon.png" alt="DM" style="width:32px;height:32px;object-fit:contain;border-radius:4px;"></div>
          <div class="nav-logo-text">DUBI<span>MOTORS</span></div>
        </a>
        <div class="nav-links">
          ${pages.map(p => `<a href="${p.href}" class="${activePage === p.key ? 'active' : ''}">${p.label}</a>`).join('')}
        </div>
        <div class="nav-right">
          <!-- Notification Bell -->
          <div class="nav-icon-btn" id="nav-notif-btn" onclick="toggleNavDropdown('notif-dropdown')" title="Notifications" style="position:relative;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="nav-badge" id="nav-notif-count">5</span>
            <div class="nav-dropdown" id="notif-dropdown">
              <div class="nav-dropdown-header">Notifications <a href="notifications.html" style="font-size:12px;color:var(--orange);font-weight:700;margin-left:auto;">See all</a></div>
              <a class="nav-dropdown-item unread" href="notifications.html"><span style="font-size:18px;">💬</span><div><div class="nav-dropdown-item-title">New inquiry on your listing</div><div class="nav-dropdown-item-sub">Khalid Motors LLC · 10 min ago</div></div></a>
              <a class="nav-dropdown-item unread" href="notifications.html"><span style="font-size:18px;">🔔</span><div><div class="nav-dropdown-item-title">7 new results for Toyota Land Cruiser</div><div class="nav-dropdown-item-sub">Saved search · 5 hours ago</div></div></a>
              <a class="nav-dropdown-item unread" href="notifications.html"><span style="font-size:18px;">✅</span><div><div class="nav-dropdown-item-title">Your listing has been verified</div><div class="nav-dropdown-item-sub">Mercedes C-Class · Yesterday</div></div></a>
              <a class="nav-dropdown-footer" href="notifications.html">View all notifications</a>
            </div>
          </div>
          <!-- Chat Icon -->
          <div class="nav-icon-btn" onclick="window.location.href='chats.html'" title="Messages" style="position:relative;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span class="nav-badge" id="nav-chat-count">2</span>
          </div>
          <!-- User Avatar -->
          <div class="nav-user-btn" id="nav-user-btn" onclick="toggleNavDropdown('user-dropdown')">
            <div class="nav-user-avatar">AR</div>
            <div class="nav-dropdown" id="user-dropdown" style="right:0;width:220px;">
              <div class="nav-dropdown-header" style="flex-direction:column;align-items:flex-start;gap:2px;"><span style="font-weight:800;">Ahmed Al Rashidi</span><span style="font-size:12px;color:var(--grey);">ahmed@example.com</span></div>
              <a class="nav-dropdown-item" href="profile.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>My Profile</a>
              <a class="nav-dropdown-item" href="my-ads.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>My Ads <span style="margin-left:auto;background:var(--orange);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;">3</span></a>
              <a class="nav-dropdown-item" href="saved-searches.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>Saved Searches</a>
              <a class="nav-dropdown-item" href="chats.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Chats <span style="margin-left:auto;background:var(--orange);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;">2</span></a>
              <a class="nav-dropdown-item" href="place-ad.html" style="color:var(--orange);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Place an Ad</a>
              <a class="nav-dropdown-item" href="login.html" style="color:#E53935;border-top:1px solid var(--border);margin-top:4px;padding-top:12px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Log Out</a>
            </div>
          </div>
          <button class="btn-place-ad" onclick="window.location.href='place-ad.html'">+ Place Your Ad</button>
          <button class="nav-hamburger" onclick="toggleMobileNav()" id="nav-hamburger-btn" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-nav-menu" id="mobile-nav-menu">
      ${pages.map(p => `<a href="${p.href}" class="${activePage === p.key ? 'active' : ''}">${p.label}</a>`).join('')}
      <div style="border-top:1px solid #333;margin-top:8px;padding-top:12px;display:flex;flex-direction:column;gap:4px;">
        <a href="profile.html" style="padding:10px 0;color:#aaa;font-size:14px;font-weight:600;">👤 My Profile</a>
        <a href="my-ads.html" style="padding:10px 0;color:#aaa;font-size:14px;font-weight:600;">📋 My Ads</a>
        <a href="chats.html" style="padding:10px 0;color:#aaa;font-size:14px;font-weight:600;">💬 Chats <span style="background:var(--orange);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;margin-left:4px;">2</span></a>
        <a href="notifications.html" style="padding:10px 0;color:#aaa;font-size:14px;font-weight:600;">🔔 Notifications <span style="background:var(--orange);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;margin-left:4px;">5</span></a>
        <a href="place-ad.html" style="padding:10px 0;color:var(--orange);font-size:14px;font-weight:700;">+ Place Your Ad</a>
        <a href="login.html" style="padding:10px 0;color:#E53935;font-size:14px;font-weight:600;">Log Out</a>
      </div>
    </div>
    <script>
      function toggleMobileNav() {
        const menu = document.getElementById('mobile-nav-menu');
        menu.classList.toggle('open');
      }
      function toggleNavDropdown(id) {
        const all = document.querySelectorAll('.nav-dropdown');
        all.forEach(d => { if (d.id !== id) d.classList.remove('open'); });
        const el = document.getElementById(id);
        if (el) el.classList.toggle('open');
      }
      // Close dropdowns when clicking outside
      document.addEventListener('click', function(e) {
        const menu = document.getElementById('mobile-nav-menu');
        const btn = document.getElementById('nav-hamburger-btn');
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
          menu.classList.remove('open');
        }
        // Close nav dropdowns
        if (!e.target.closest('.nav-icon-btn') && !e.target.closest('.nav-user-btn')) {
          document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        }
      });
    <\/script>`;
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
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2"/></svg>
              </a>
              <a class="social-btn" href="https://twitter.com" target="_blank" title="X (Twitter)">
                <svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
              </a>
              <a class="social-btn" href="https://youtube.com" target="_blank" title="YouTube">
                <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--dark)"/></svg>
              </a>
              <a class="social-btn" href="https://wa.me/971500000000" target="_blank" title="WhatsApp">
                <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
              <a class="social-btn" href="https://tiktok.com" target="_blank" title="TikTok">
                <svg viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Browse</div>
            <a class="footer-link" href="cars.html">Cars for Sale</a>
            <a class="footer-link" href="boats.html">Boats &amp; Yachts</a>
            <a class="footer-link" href="bikes.html">Motorcycles</a>
            <a class="footer-link" href="jetski.html">Jet Skis</a>
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
            <a class="footer-link" href="index.html#contact">Contact Us</a>
            <a class="footer-link" href="careers.html">Careers</a>
            <a class="footer-link" href="blog.html">Blog</a>
            <a class="footer-link" href="help.html">Help Centre</a>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-copy">© 2025 DubiMotors. All rights reserved. UAE Licensed Automotive Marketplace. جميع الحقوق محفوظة</div>
          <div class="footer-legal">
            <a href="privacy.html">Privacy Policy</a>
            <a href="terms.html">Terms of Use</a>
            <a href="privacy.html#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>`;
}

/* ── Inject Dubi Agent on every page ── */
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
