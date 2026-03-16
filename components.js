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
          <button class="btn-login" onclick="window.location.href='login.html'">Log In</button>
          <button class="btn-place-ad" onclick="window.location.href='place-ad.html'">+ Place Your Ad</button>
          <button class="nav-hamburger" onclick="toggleMobileNav()" id="nav-hamburger-btn" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-nav-menu" id="mobile-nav-menu">
      ${pages.map(p => `<a href="${p.href}" class="${activePage === p.key ? 'active' : ''}">${p.label}</a>`).join('')}
      <a href="login.html" style="border-top:1px solid #333;margin-top:8px;padding-top:16px;">Log In / Register</a>
    </div>
    <script>
      function toggleMobileNav() {
        const menu = document.getElementById('mobile-nav-menu');
        menu.classList.toggle('open');
      }
      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        const menu = document.getElementById('mobile-nav-menu');
        const btn = document.getElementById('nav-hamburger-btn');
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
          menu.classList.remove('open');
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
