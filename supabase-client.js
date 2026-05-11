// ─── DUBIMOTORS — SUPABASE CLIENT ────────────────────────────────────────────
// Initializes the Supabase JS client once for the whole site.
// Exposes window.supa for use by shared.js and any page-level code.
//
// SETUP:
//   1. Replace SUPABASE_URL with your Project URL from Supabase Settings → API
//   2. Replace SUPABASE_ANON_KEY with the `anon` `public` key (safe to expose)
//   3. The service_role key NEVER goes here — server-only.
//
// Both values are PUBLIC. Security is enforced by Row Level Security policies
// on the database, not by hiding these strings.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  const SUPABASE_URL = 'https://auth.dubimotors.ae';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmd3hrbXRzbXNuYnNkdXhkem93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODg2MjQsImV4cCI6MjA5Mzk2NDYyNH0.mJ8krarTZ8YlrXkaxVZmYOMW6fuhDvfEthtPXsp4qbI';

  if (!window.supabase || !window.supabase.createClient) {
    console.error('[DubiMotors] Supabase JS client not loaded. Check the CDN <script> tag.');
    return;
  }

  if (SUPABASE_URL.startsWith('<') || SUPABASE_ANON_KEY.startsWith('<')) {
    console.error('[DubiMotors] Supabase credentials not configured in supabase-client.js');
    return;
  }

  window.supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
})();
