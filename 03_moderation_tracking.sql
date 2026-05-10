-- ────────────────────────────────────────────────────────────────
-- DUBIMOTORS — Moderation tracking columns
--
-- Adds columns to track AI moderation decisions on listings:
--   - moderation_reason: what the AI said (full text)
--   - moderation_at:     when it was decided
--
-- Run once in Supabase SQL Editor. Idempotent.
-- ────────────────────────────────────────────────────────────────

alter table public.listings
  add column if not exists moderation_reason text,
  add column if not exists moderation_at timestamptz;

-- Optional helpful index for the admin moderation queue
create index if not exists idx_listings_pending_review
  on public.listings(created_at desc)
  where status = 'pending_review';
