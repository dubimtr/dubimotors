# Phase 3 Step 3 — Real Authentication

## What this batch enables

After deploying these 26 files (plus 2 Supabase dashboard config steps below), your site has working authentication:

- Email + password registration
- Email + password login
- Google sign-in
- Persistent sessions (refresh-proof, multi-tab)
- Logout
- Profile editing (name, phone, emirate, bio)
- Auth-protected pages (place-ad, my-ads, profile, etc. redirect to login if signed out)
- Forgot password (sends reset email)
- Navbar changes based on auth state (Sign In button when logged out, user dropdown when logged in)

## Files in this batch (26 total)

**Brand new (1):**
- `auth.js` — central auth API

**Significantly rewritten (3):**
- `login.html` — real Supabase auth instead of mocks
- `profile.html` — loads/saves real user data
- `components.js` — navbar updates based on auth state

**Modified (script tags added) (22):**
- All other HTML pages — added Supabase + auth.js scripts so the navbar can show correct auth state everywhere

---

## BEFORE deploying — two Supabase config steps

These are dashboard clicks, not SQL.

### Step 1 — Disable email confirmation requirement

Goal: let new users use the site immediately after sign-up (per your "maximize traffic" decision).

1. Supabase Dashboard → **Authentication** (left sidebar)
2. Click **Providers** → **Email**
3. Find **"Confirm email"** setting
4. **Turn it OFF**
5. Save

Users will still receive a confirmation email, but won't be blocked from using the site until they click it. We'll add a "verify before posting" check in the place-ad flow later.

### Step 2 — Enable Google OAuth provider

This is the slightly fiddly one. ~10 minutes of clicks.

#### Part A — In Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Sign in with the Google account you want to own this OAuth setup (probably the same as your Google Workspace if `hello@dubimotors.ae` is via Workspace, otherwise a personal account is fine)
3. Click the project dropdown (top-left, next to "Google Cloud") → **New Project**
4. Project name: `DubiMotors`
5. Click **Create**, wait ~10 seconds, then select the new project from the dropdown
6. In the left sidebar, hover over **APIs & Services** → click **OAuth consent screen**
7. Pick **External** → Create
8. Fill in:
   - App name: `DubiMotors`
   - User support email: your email
   - App logo: optional
   - App home page: `https://dubimotors.ae`
   - Authorized domain: `dubimotors.ae`
   - Developer contact: your email
9. Click Save and Continue through Scopes (skip), Test users (skip), Summary
10. Now in the left sidebar, click **Credentials**
11. Click **+ Create Credentials** → **OAuth client ID**
12. Application type: **Web application**
13. Name: `DubiMotors Production`
14. **Authorized JavaScript origins** — add:
    - `https://dubimotors.ae`
    - `https://www.dubimotors.ae`
    - `https://dubimotors.onrender.com` (the Render URL still works, useful for testing)
15. **Authorized redirect URIs** — add the Supabase callback URL:
    - Format: `https://<your-project-ref>.supabase.co/auth/v1/callback`
    - Find your project ref in Supabase dashboard URL or in Settings → API → Project URL
    - Example: `https://abcdefghij.supabase.co/auth/v1/callback`
16. Click **Create**
17. Google shows you a **Client ID** and **Client Secret** — copy both, save in your password manager

#### Part B — In Supabase Dashboard
1. Authentication → **Providers** → click **Google**
2. Toggle "Enable Sign in with Google" **ON**
3. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
4. Click **Save**

Done. Google sign-in will work after you deploy.

---

## Deploying

26 files via GitHub web UI:

1. Add file → Upload files
2. Drag all 26 files in
3. Commit message: `Phase 3 Step 3: Real authentication (Supabase + Google)`
4. Render auto-redeploys ~2-3 min

---

## Testing — full flow

### Test 1 — Register a new account

1. Open `https://dubimotors.ae/login.html?tab=register` in a private/incognito window
2. Fill in:
   - Full Name: `Test User`
   - Email: any real email you control (e.g. yours)
   - Phone: optional
   - Password: 8+ characters
3. Tick the Terms checkbox
4. Click "Create Account"
5. Should see "Welcome to DubiMotors!" toast
6. Redirected to homepage
7. Navbar top-right should show your initials + the user dropdown
8. Click your avatar → "My Profile" → form should be pre-filled with what you entered

### Test 2 — Verify in Supabase

1. Supabase Dashboard → Authentication → Users
2. You should see a new user with the email you registered
3. Database → Tables → `profiles` → should have a new row with `display_name = "Test User"`

### Test 3 — Logout + Login

1. Click avatar → Log Out
2. Should redirect to homepage
3. Navbar should now show a "Sign In" button
4. Click Sign In → enter the same credentials
5. Should log back in and redirect to homepage

### Test 4 — Auth-protected pages

1. While logged out, try to visit `https://dubimotors.ae/profile.html`
2. Should redirect to `/login.html?next=/profile.html`
3. After logging in, should redirect back to `/profile.html`

### Test 5 — Google sign-in

1. While logged out, go to `/login.html`
2. Click "Continue with Google"
3. Should open Google's account picker
4. Pick a Google account
5. Should redirect back to your site, signed in
6. Check Supabase → Users → should see the Google account

### Test 6 — Profile editing

1. Logged in, go to Profile
2. Change name and bio
3. Click "Save Changes"
4. Should see "Profile updated successfully!"
5. Refresh the page — changes should persist
6. In Supabase Table Editor, the `profiles` row should reflect the new data

---

## Things to know

### Email confirmation emails still go out
Supabase still sends a confirmation email. With the setting off, the user is logged in *anyway* and the email is just informational. We'll later use email_confirmed_at status to gate posting.

### The platform owner profile (DubiMotors Platform)
Already exists from your earlier user creation. That's the user who owns the 61 demo listings. Don't delete it.

### "My Ads" still shows mock data
my-ads.html still uses `user-common.js` mock data. Wiring it to show the user's real listings from the database is the **next step (Step 4 — Place Ad form)**. That step also makes "Place an Ad" actually save to the database.

### Profile bio defaults
New profiles get an empty bio. The "Tell buyers a bit about yourself..." placeholder is shown.

### Forgot password
The "Forgot password?" link sends a reset email. The link in the email goes to `login.html` — when the user clicks the email link, Supabase parses the token from the URL and the user can set a new password. The set-new-password UI isn't built yet — that's a small follow-up. For now, "Forgot password" sends the email but the user can't actually reset until we build the reset form.

---

## What's next

After this batch deploys and tests pass, **Phase 3 Step 4 — Wire the Place Ad form** so users can actually post listings. That's the first time real user content enters the database.
