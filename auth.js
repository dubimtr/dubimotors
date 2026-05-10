// ─── DUBIMOTORS — AUTH ───────────────────────────────────────────────────────
// Wraps Supabase Auth into a clean, app-specific API.
// Loaded after supabase-client.js, exposes window.Auth.
//
// Pages that need auth state:
//   - Read it:        const user = await Auth.getUser();
//   - Subscribe:      Auth.onChange((user) => { ... });
//   - Require it:     Auth.requireAuth();   // redirects to login if not signed in
//
// Pages that perform auth:
//   - Login:          await Auth.signIn(email, password)
//   - Register:       await Auth.signUp(email, password, displayName)
//   - Google:         await Auth.signInWithGoogle()
//   - Logout:         await Auth.signOut()
// ─────────────────────────────────────────────────────────────────────────────

window.Auth = (() => {
  // Cached profile (the row from the public.profiles table) for the current user.
  // We fetch it once after sign-in and keep it in memory for the session.
  let _profile = null;
  let _profileLoadedFor = null; // user ID we loaded the profile for

  /** Get the current authenticated user, or null. */
  async function getUser() {
    if (!window.supa) return null;
    try {
      const { data: { user } } = await window.supa.auth.getUser();
      return user || null;
    } catch (e) {
      console.warn('[Auth] getUser failed:', e);
      return null;
    }
  }

  /** Get the current user's profile row (display_name, phone, etc.) or null. */
  async function getProfile() {
    const user = await getUser();
    if (!user) {
      _profile = null;
      _profileLoadedFor = null;
      return null;
    }
    // Cache hit
    if (_profileLoadedFor === user.id && _profile) return _profile;
    try {
      const { data, error } = await window.supa
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) {
        console.warn('[Auth] getProfile failed:', error.message);
        return null;
      }
      _profile = data;
      _profileLoadedFor = user.id;
      return _profile;
    } catch (e) {
      console.warn('[Auth] getProfile threw:', e);
      return null;
    }
  }

  /** Sign in with email + password. Returns { user, error }. */
  async function signIn(email, password) {
    if (!window.supa) return { user: null, error: 'Auth not ready' };
    const { data, error } = await window.supa.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    _profile = null; _profileLoadedFor = null;
    return { user: data.user, error: null };
  }

  /**
   * Register a new user.
   * - displayName goes into auth.users.raw_user_meta_data.display_name,
   *   which the on_auth_user_created trigger reads to seed profiles.display_name.
   * - phone is optional; if provided, we update profiles.phone after signup.
   */
  async function signUp(email, password, displayName, phone) {
    if (!window.supa) return { user: null, error: 'Auth not ready' };
    const { data, error } = await window.supa.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) return { user: null, error: error.message };

    // If a phone was provided, update profile (the trigger created the row already).
    // Note: if email confirmation is required AND not yet done, the user is in a
    // "pending" state — we still try to update the profile but it may fail with RLS.
    if (data.user && phone) {
      try {
        await window.supa
          .from('profiles')
          .update({ phone })
          .eq('id', data.user.id);
      } catch { /* non-fatal */ }
    }

    return { user: data.user, error: null };
  }

  /** Trigger the Google OAuth flow. Page redirects away on success. */
  async function signInWithGoogle() {
    if (!window.supa) return { error: 'Auth not ready' };
    const { error } = await window.supa.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error: error ? error.message : null };
  }

  /** Sign the current user out. */
  async function signOut() {
    if (!window.supa) return;
    await window.supa.auth.signOut();
    _profile = null;
    _profileLoadedFor = null;
  }

  /**
   * Subscribe to auth state changes (login, logout, token refresh).
   * Returns an unsubscribe function.
   */
  function onChange(callback) {
    if (!window.supa) return () => {};
    const { data: { subscription } } = window.supa.auth.onAuthStateChange((event, session) => {
      // Reset profile cache on any auth change
      _profile = null;
      _profileLoadedFor = null;
      try { callback(session ? session.user : null, event); }
      catch (e) { console.error('[Auth] onChange callback threw:', e); }
    });
    return () => subscription.unsubscribe();
  }

  /**
   * Use on protected pages. If not authenticated, redirects to login.html
   * with a `next` parameter pointing back to the current page.
   * Returns the user when authenticated.
   */
  async function requireAuth(opts = {}) {
    const user = await getUser();
    if (user) return user;
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    const target = opts.redirectTo || `login.html?next=${next}`;
    window.location.href = target;
    return null; // never reached
  }

  /** Update the current user's profile fields. */
  async function updateProfile(fields) {
    const user = await getUser();
    if (!user) return { error: 'Not signed in' };
    const allowed = ['display_name', 'phone', 'whatsapp', 'avatar_url', 'bio', 'emirate'];
    const cleaned = {};
    for (const k of allowed) if (k in fields) cleaned[k] = fields[k];
    cleaned.updated_at = new Date().toISOString();

    const { data, error } = await window.supa
      .from('profiles')
      .update(cleaned)
      .eq('id', user.id)
      .select()
      .maybeSingle();
    if (error) return { error: error.message };
    _profile = data;
    _profileLoadedFor = user.id;
    return { profile: data, error: null };
  }

  return {
    getUser,
    getProfile,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    onChange,
    requireAuth,
    updateProfile,
  };
})();
