/**
 * DubiMotors — Email module
 *
 * Wraps Resend.com for sending transactional emails:
 *   - Welcome email (on signup) with a verify link
 *   - Verification email (on demand, e.g. when posting an ad)
 *   - Listing approved email
 *
 * Reads RESEND_API_KEY from env. Falls back to a no-op mode (logs only) if
 * the key is missing, so dev environments without Resend keys still work.
 *
 * From address: noreply@dubimotors.ae
 */

const FROM_ADDRESS = 'DubiMotors <noreply@dubimotors.ae>';
const SUPPORT_EMAIL = 'support@dubimotors.ae';      // for footer "didn't request this" link
const SITE_URL = 'https://dubimotors.ae';

let _resendClient = null;
let _resendInitTried = false;

function getResend() {
  if (_resendInitTried) return _resendClient;
  _resendInitTried = true;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — email sending disabled (logs only).');
    return null;
  }
  try {
    const { Resend } = require('resend');
    _resendClient = new Resend(key);
    console.log('[email] Resend client initialized.');
    return _resendClient;
  } catch (e) {
    console.error('[email] Failed to initialize Resend:', e.message);
    return null;
  }
}

/**
 * Send an email via Resend. Returns { ok: boolean, error?: string }.
 * If Resend isn't configured, logs the email and returns ok:true (so signup flows
 * don't fail in dev environments).
 */
async function sendEmail({ to, subject, html, text }) {
  if (!to || !subject || !html) {
    return { ok: false, error: 'Missing required email fields' };
  }
  const resend = getResend();
  if (!resend) {
    console.log(`[email-disabled] would send to ${to}: ${subject}`);
    return { ok: true, disabled: true };
  }
  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to],
      subject,
      html,
      text: text || undefined,
    });
    if (result.error) {
      console.error('[email] Resend error:', result.error);
      return { ok: false, error: result.error.message || String(result.error) };
    }
    return { ok: true, id: result.data && result.data.id };
  } catch (e) {
    console.error('[email] Send threw:', e.message);
    return { ok: false, error: e.message };
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────
// All emails share the same envelope: orange CTA button, DubiMotors header,
// plain-text fallback link, footer.

function emailLayout({ headline, intro, ctaLabel, ctaUrl, postCta, expiryNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>DubiMotors</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr><td style="background:#0f0f0f;padding:24px 32px;text-align:center;">
          <div style="font-size:24px;font-weight:900;letter-spacing:-0.5px;">
            <span style="color:#ffffff;">DUBI</span><span style="color:#E8450A;">MOTORS</span>
          </div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 32px 16px;">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.35;font-weight:800;color:#1a1a1a;">${headline}</h1>
          <div style="font-size:15px;line-height:1.65;color:#444;margin-bottom:24px;">${intro}</div>
          ${ctaUrl ? `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">
              <tr><td style="background:#E8450A;border-radius:10px;">
                <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">${ctaLabel}</a>
              </td></tr>
            </table>
            <div style="font-size:13px;line-height:1.6;color:#666;margin:16px 0 8px;">Or copy and paste this link into your browser:</div>
            <div style="font-size:13px;color:#E8450A;word-break:break-all;margin-bottom:16px;"><a href="${ctaUrl}" style="color:#E8450A;text-decoration:none;">${ctaUrl}</a></div>
          ` : ''}
          ${postCta ? `<div style="font-size:14px;line-height:1.6;color:#444;margin-top:16px;">${postCta}</div>` : ''}
          ${expiryNote ? `<div style="font-size:12px;color:#999;font-style:italic;margin-top:24px;border-top:1px solid #eee;padding-top:16px;">${expiryNote}</div>` : ''}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#fafafa;padding:24px 32px;font-size:12px;color:#888;line-height:1.6;border-top:1px solid #eee;">
          <div style="margin-bottom:8px;">If you did not request this email, you can safely ignore it or contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#E8450A;">${SUPPORT_EMAIL}</a>.</div>
          <div>© ${new Date().getFullYear()} DubiMotors · UAE&apos;s vehicle marketplace · <a href="${SITE_URL}" style="color:#888;">dubimotors.ae</a></div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function welcomeEmail({ name, verifyUrl }) {
  const headline = `You&rsquo;re almost there! Welcome to DubiMotors`;
  const intro = `Hi ${escapeHtml(name || 'there')},<br><br>
    Thanks for joining DubiMotors, UAE&rsquo;s AI-powered vehicle marketplace. You can already start browsing thousands of cars, motorcycles, boats, and more.<br><br>
    To unlock posting listings and contacting sellers, please verify your email address by clicking below.`;
  const html = emailLayout({
    headline,
    intro,
    ctaLabel: 'Confirm My Email',
    ctaUrl: verifyUrl,
    postCta: `Once verified, you&rsquo;ll be able to publish ads and contact sellers directly via call or WhatsApp.`,
    expiryNote: 'This verification link will expire in 24 hours.',
  });
  const text = `Welcome to DubiMotors!\n\nHi ${name || 'there'},\n\nThanks for joining. To post listings and contact sellers, please verify your email by visiting:\n\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nThe DubiMotors team`;
  return { subject: `Welcome to DubiMotors. Verify your email address`, html, text };
}

function verificationEmail({ name, verifyUrl, reason }) {
  const headline = `Verify your email to continue`;
  const reasonLine = reason === 'place-ad'
    ? 'You&rsquo;re about to publish a listing.'
    : reason === 'contact'
      ? 'You&rsquo;re about to contact a seller.'
      : '';
  const intro = `Hi ${escapeHtml(name || 'there')},<br><br>
    ${reasonLine ? reasonLine + ' ' : ''}For security and to protect everyone on DubiMotors, please verify your email address before continuing.`;
  const html = emailLayout({
    headline,
    intro,
    ctaLabel: 'Confirm My Email',
    ctaUrl: verifyUrl,
    expiryNote: 'This verification link will expire in 24 hours.',
  });
  const text = `Verify your email to continue on DubiMotors.\n\nHi ${name || 'there'},\n\n${reasonLine}\n\nClick to verify:\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nThe DubiMotors team`;
  return { subject: `Verify your email to continue on DubiMotors`, html, text };
}

function listingApprovedEmail({ name, title, listingUrl }) {
  const headline = `Your listing is LIVE!`;
  const intro = `Hi ${escapeHtml(name || 'there')},<br><br>
    Your listing &ldquo;<strong>${escapeHtml(title || 'your vehicle')}</strong>&rdquo; has been approved by our AI moderation team and is now <strong>LIVE</strong> on DubiMotors.<br><br>
    Buyers can contact you directly via call or WhatsApp from the listing page.`;
  const html = emailLayout({
    headline,
    intro,
    ctaLabel: 'View My Listing',
    ctaUrl: listingUrl,
    postCta: `Tip: keep your phone nearby. Most successful sellers reply to inquiries within an hour.`,
  });
  const text = `Your DubiMotors listing is LIVE!\n\nHi ${name || 'there'},\n\n"${title || 'Your listing'}" is now LIVE: ${listingUrl}\n\nThe DubiMotors team`;
  return { subject: `Your listing is LIVE on DubiMotors`, html, text };
}

function passwordResetEmail({ name, resetUrl }) {
  const headline = `Reset your password`;
  const intro = `Hi ${escapeHtml(name || 'there')},<br><br>
    We received a request to reset the password on your DubiMotors account. Click the button below to choose a new one. This link is valid for <strong>1 hour</strong>.<br><br>
    If you didn&rsquo;t request this, you can safely ignore this email. Your password won&rsquo;t change unless you click the link and pick a new one.`;
  const html = emailLayout({
    headline,
    intro,
    ctaLabel: 'Reset My Password',
    ctaUrl: resetUrl,
    postCta: `For your security, this link can only be used once and expires in 1 hour.`,
    expiryNote: 'If you didn&rsquo;t request a password reset, no action is needed.',
  });
  const text = `Reset your DubiMotors password.\n\nHi ${name || 'there'},\n\nClick the link below to set a new password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you didn't request this, ignore this email — your password won't change.\n\nThe DubiMotors team`;
  return { subject: `Reset your DubiMotors password`, html, text };
}

// HTML escape for user-controlled strings inside email templates
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  sendEmail,
  welcomeEmail,
  verificationEmail,
  listingApprovedEmail,
  passwordResetEmail,
  SITE_URL,
};
