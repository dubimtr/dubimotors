/**
 * DubiMotors — Auth Modal
 *
 * In-page sign-in / register modal. Replaces the full-page navigation to
 * login.html for most flows (the page still exists for OAuth redirects and
 * email-link redirects).
 *
 * Usage:
 *   const user = await AuthModal.open({ tab: 'login', reason: 'place-ad' });
 *   if (user) { ...proceed with the action... }
 *
 * Public API:
 *   AuthModal.open({ tab, reason })  → Promise<user | null>
 *     tab: 'login' | 'register' (default: 'login')
 *     reason: short string shown above the form (e.g., 'Sign in to publish your ad')
 *   AuthModal.close()                 → close the modal manually
 *   AuthModal.isOpen()                → boolean
 *
 * Depends on: window.Auth (auth.js), window.supa (supabase-client.js)
 */
(function() {
  if (typeof window === 'undefined') return;

  const STYLE_ID = 'dm-auth-modal-style';
  const OVERLAY_ID = 'dm-auth-modal-overlay';
  let _resolver = null;

  // Inject styles once
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      #${OVERLAY_ID} {
        position: fixed; inset: 0; z-index: 10001;
        background: rgba(15, 15, 15, 0.6);
        backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        opacity: 0; transition: opacity .18s ease;
      }
      #${OVERLAY_ID}.show { opacity: 1; }
      .dm-auth-modal {
        background: #fff; border-radius: 16px;
        max-width: 420px; width: 100%;
        max-height: calc(100vh - 32px); overflow-y: auto;
        box-shadow: 0 24px 80px rgba(0,0,0,0.25);
        transform: translateY(8px); transition: transform .22s cubic-bezier(.2,.8,.2,1);
      }
      #${OVERLAY_ID}.show .dm-auth-modal { transform: translateY(0); }
      .dm-auth-header {
        padding: 22px 24px 4px; position: relative;
      }
      .dm-auth-close {
        position: absolute; top: 14px; right: 14px;
        background: transparent; border: none; font-size: 22px;
        color: #888; cursor: pointer; line-height: 1; padding: 4px 8px;
        border-radius: 8px; transition: background .15s;
      }
      .dm-auth-close:hover { background: #f0f0f0; color: #333; }
      .dm-auth-logo {
        font-size: 20px; font-weight: 900; letter-spacing: -0.5px;
        margin-bottom: 14px;
      }
      .dm-auth-logo .dm-orange { color: #E8450A; }
      .dm-auth-reason {
        background: #FFF3CD; border: 1px solid #FFD700;
        color: #856404; padding: 10px 14px; border-radius: 10px;
        font-size: 13px; font-weight: 600; margin-bottom: 14px;
      }
      .dm-auth-tabs {
        display: flex; gap: 4px; border-bottom: 1px solid #eee;
        margin: 0 0 0;
      }
      .dm-auth-tab {
        flex: 1; padding: 12px 0; background: transparent; border: none;
        font-size: 14px; font-weight: 700; color: #888; cursor: pointer;
        border-bottom: 3px solid transparent; margin-bottom: -1px;
        transition: color .15s, border-color .15s;
      }
      .dm-auth-tab.active { color: #E8450A; border-bottom-color: #E8450A; }
      .dm-auth-body { padding: 22px 24px 24px; }
      .dm-auth-status {
        background: #FFEBEE; color: #C62828;
        padding: 10px 14px; border-radius: 10px;
        font-size: 13px; line-height: 1.5; margin-bottom: 14px;
        display: none;
      }
      .dm-auth-status.show { display: block; }
      .dm-auth-status.ok { background: #E8F5E9; color: #2E7D32; }
      .dm-auth-form-group { margin-bottom: 12px; }
      .dm-auth-label {
        display: block; font-size: 11px; font-weight: 700;
        color: #555; letter-spacing: 0.4px; text-transform: uppercase;
        margin-bottom: 6px;
      }
      .dm-auth-input {
        width: 100%; padding: 12px 14px; border-radius: 10px;
        border: 1.5px solid #e5e5e5; font-size: 15px;
        font-family: inherit; box-sizing: border-box;
        transition: border-color .15s;
      }
      .dm-auth-input:focus { outline: none; border-color: #E8450A; }
      .dm-auth-submit {
        width: 100%; background: #E8450A; color: #fff;
        border: none; border-radius: 10px; padding: 14px;
        font-size: 15px; font-weight: 700; cursor: pointer;
        margin-top: 6px; transition: background .15s;
      }
      .dm-auth-submit:hover:not(:disabled) { background: #d63d09; }
      .dm-auth-submit:disabled { opacity: .6; cursor: not-allowed; }
      .dm-auth-divider {
        display: flex; align-items: center; gap: 12px;
        margin: 18px 0 14px; color: #999; font-size: 12px; font-weight: 600;
      }
      .dm-auth-divider::before, .dm-auth-divider::after {
        content: ''; flex: 1; height: 1px; background: #eee;
      }
      .dm-auth-google {
        width: 100%; background: #fff; color: #333;
        border: 1.5px solid #e5e5e5; border-radius: 10px;
        padding: 12px; font-size: 14px; font-weight: 600;
        cursor: pointer; display: flex; align-items: center;
        justify-content: center; gap: 10px;
        transition: background .15s, border-color .15s;
      }
      .dm-auth-google:hover { background: #f8f8f8; border-color: #ccc; }
      .dm-auth-google svg { width: 18px; height: 18px; flex-shrink: 0; }
      .dm-auth-footer {
        margin-top: 14px; text-align: center;
        font-size: 12px; color: #888; line-height: 1.6;
      }
      .dm-auth-footer a { color: #E8450A; font-weight: 600; }
    `;
    document.head.appendChild(s);
  }

  function buildModal({ tab, reason }) {
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.innerHTML = `
      <div class="dm-auth-modal" role="dialog" aria-modal="true" aria-labelledby="dm-auth-title">
        <div class="dm-auth-header">
          <button class="dm-auth-close" id="dm-auth-close" aria-label="Close">×</button>
          <div class="dm-auth-logo"><span style="color:#0f0f0f;">DUBI</span><span class="dm-orange">MOTORS</span></div>
          ${reason ? `<div class="dm-auth-reason">${escapeHtml(reason)}</div>` : ''}
          <div class="dm-auth-tabs">
            <button class="dm-auth-tab ${tab === 'login' ? 'active' : ''}" data-tab="login">Sign In</button>
            <button class="dm-auth-tab ${tab === 'register' ? 'active' : ''}" data-tab="register">Register</button>
          </div>
        </div>
        <div class="dm-auth-body">
          <div class="dm-auth-status" id="dm-auth-status"></div>
          <form id="dm-auth-form-login" style="${tab === 'login' ? '' : 'display:none;'}">
            <div class="dm-auth-form-group">
              <label class="dm-auth-label" for="dm-auth-login-email">Email</label>
              <input class="dm-auth-input" id="dm-auth-login-email" type="email" autocomplete="email" required />
            </div>
            <div class="dm-auth-form-group">
              <label class="dm-auth-label" for="dm-auth-login-pass">Password</label>
              <input class="dm-auth-input" id="dm-auth-login-pass" type="password" autocomplete="current-password" required />
            </div>
            <button class="dm-auth-submit" type="submit">Sign In</button>
          </form>
          <form id="dm-auth-form-register" style="${tab === 'register' ? '' : 'display:none;'}">
            <div class="dm-auth-form-group">
              <label class="dm-auth-label" for="dm-auth-reg-name">Full Name</label>
              <input class="dm-auth-input" id="dm-auth-reg-name" type="text" autocomplete="name" required />
            </div>
            <div class="dm-auth-form-group">
              <label class="dm-auth-label" for="dm-auth-reg-email">Email</label>
              <input class="dm-auth-input" id="dm-auth-reg-email" type="email" autocomplete="email" required />
            </div>
            <div class="dm-auth-form-group">
              <label class="dm-auth-label" for="dm-auth-reg-pass">Password</label>
              <input class="dm-auth-input" id="dm-auth-reg-pass" type="password" autocomplete="new-password" minlength="6" required />
            </div>
            <button class="dm-auth-submit" type="submit">Create Account</button>
          </form>
          <div class="dm-auth-divider">or continue with</div>
          <button class="dm-auth-google" id="dm-auth-google" type="button">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <div class="dm-auth-footer" id="dm-auth-footer-login" style="${tab === 'login' ? '' : 'display:none;'}">
            <a href="#" id="dm-auth-forgot">Forgot password?</a>
          </div>
          <div class="dm-auth-footer" id="dm-auth-footer-register" style="${tab === 'register' ? '' : 'display:none;'}">
            By registering, you agree to our <a href="terms.html" target="_blank">Terms</a> and <a href="privacy.html" target="_blank">Privacy Policy</a>.
          </div>
        </div>
      </div>
    `;
    return overlay;
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setStatus(msg, kind) {
    const el = document.getElementById('dm-auth-status');
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'dm-auth-status' + (msg ? ' show' : '') + (kind === 'ok' ? ' ok' : '');
  }

  function switchTab(tab) {
    document.querySelectorAll('.dm-auth-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.getElementById('dm-auth-form-login').style.display = tab === 'login' ? '' : 'none';
    document.getElementById('dm-auth-form-register').style.display = tab === 'register' ? '' : 'none';
    document.getElementById('dm-auth-footer-login').style.display = tab === 'login' ? '' : 'none';
    document.getElementById('dm-auth-footer-register').style.display = tab === 'register' ? '' : 'none';
    setStatus('');
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!window.Auth) { setStatus('Authentication not ready. Refresh the page.'); return; }
    const email = document.getElementById('dm-auth-login-email').value.trim();
    const password = document.getElementById('dm-auth-login-pass').value;
    if (!email || !password) { setStatus('Please enter your email and password.'); return; }
    const btn = e.target.querySelector('.dm-auth-submit');
    btn.disabled = true; btn.textContent = 'Signing in…';
    const { error } = await window.Auth.signIn(email, password);
    btn.disabled = false; btn.textContent = 'Sign In';
    if (error) { setStatus(error); return; }
    const user = await window.Auth.getUser();
    closeWith(user);
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!window.Auth) { setStatus('Authentication not ready. Refresh the page.'); return; }
    const name = document.getElementById('dm-auth-reg-name').value.trim();
    const email = document.getElementById('dm-auth-reg-email').value.trim();
    const password = document.getElementById('dm-auth-reg-pass').value;
    if (!name || !email || !password) { setStatus('Please fill in all fields.'); return; }
    if (password.length < 6) { setStatus('Password must be at least 6 characters.'); return; }
    const btn = e.target.querySelector('.dm-auth-submit');
    btn.disabled = true; btn.textContent = 'Creating account…';
    const { error } = await window.Auth.signUp(email, password, name);
    if (error) {
      btn.disabled = false; btn.textContent = 'Create Account';
      setStatus(error); return;
    }
    // Try to fire welcome email (non-blocking, don't await — user will redirect anyway)
    if (window.Auth.sendWelcomeEmail) window.Auth.sendWelcomeEmail().catch(() => {});
    btn.disabled = false; btn.textContent = 'Create Account';
    const user = await window.Auth.getUser();
    if (user) {
      setStatus('Account created!', 'ok');
      setTimeout(() => closeWith(user), 600);
    } else {
      setStatus('Account created! Check your email to confirm and sign in.', 'ok');
    }
  }

  async function handleGoogle() {
    if (!window.Auth) { setStatus('Authentication not ready. Refresh the page.'); return; }
    const { error } = await window.Auth.signInWithGoogle();
    if (error) setStatus(error);
    // On success, the page redirects away — Google OAuth always navigates.
  }

  async function handleForgot(e) {
    e.preventDefault();
    const email = document.getElementById('dm-auth-login-email').value.trim();
    if (!email) { setStatus('Enter your email above first, then click Forgot Password.'); return; }
    if (!window.supa) { setStatus('Authentication not ready.'); return; }
    const { error } = await window.supa.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password.html',
    });
    if (error) setStatus(error.message); else setStatus('Password reset email sent. Check your inbox.', 'ok');
  }

  function closeWith(result) {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.documentElement.style.overflow = '';
      if (_resolver) {
        const r = _resolver; _resolver = null;
        r(result || null);
      }
    }, 180);
  }

  function open({ tab = 'login', reason } = {}) {
    return new Promise((resolve) => {
      // If already open, swap tab and reuse
      const existing = document.getElementById(OVERLAY_ID);
      if (existing) {
        if (_resolver) _resolver(null); // resolve previous opener with cancel
        _resolver = resolve;
        switchTab(tab);
        return;
      }
      ensureStyles();
      _resolver = resolve;

      const overlay = buildModal({ tab, reason });
      document.body.appendChild(overlay);
      document.documentElement.style.overflow = 'hidden';

      // Wait one frame so the transition kicks in
      requestAnimationFrame(() => overlay.classList.add('show'));

      // ─── Wire events ───
      document.getElementById('dm-auth-close').addEventListener('click', () => closeWith(null));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeWith(null);
      });
      document.querySelectorAll('.dm-auth-tab').forEach(t => {
        t.addEventListener('click', () => switchTab(t.dataset.tab));
      });
      document.getElementById('dm-auth-form-login').addEventListener('submit', handleLogin);
      document.getElementById('dm-auth-form-register').addEventListener('submit', handleRegister);
      document.getElementById('dm-auth-google').addEventListener('click', handleGoogle);
      document.getElementById('dm-auth-forgot').addEventListener('click', handleForgot);

      // Esc key to close
      const onKey = (e) => {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', onKey);
          closeWith(null);
        }
      };
      document.addEventListener('keydown', onKey);

      // Focus first input
      setTimeout(() => {
        const first = overlay.querySelector('.dm-auth-input');
        if (first) first.focus();
      }, 200);
    });
  }

  function close() { closeWith(null); }
  function isOpen() { return !!document.getElementById(OVERLAY_ID); }

  window.AuthModal = { open, close, isOpen };
})();
