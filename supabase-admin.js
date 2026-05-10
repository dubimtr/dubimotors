/**
 * DubiMotors — Server-side Supabase admin client
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). Used for server endpoints
 * that need to write verification tokens, look up auth users, mark profiles
 * verified, etc. — operations the client-side anon key can't do.
 *
 * Lazy-initialized so the server still boots if env vars are missing.
 */

let _client = null;
let _initTried = false;

function getSupabaseAdmin() {
  if (_initTried) return _client;
  _initTried = true;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.warn('[supabase-admin] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — DB-backed endpoints will fail.');
    return null;
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    _client = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('[supabase-admin] Server client initialized.');
    return _client;
  } catch (e) {
    console.error('[supabase-admin] Failed to initialize:', e.message);
    return null;
  }
}

module.exports = { getSupabaseAdmin };
