-- ──────────────────────────────────────────────────────────────────────
-- Waitlist table — stores signups from the Rivertide landing page
-- ──────────────────────────────────────────────────────────────────────

create table if not exists public.waitlist (
  id        bigint generated always as identity primary key,
  name      text        not null,
  email     text        not null unique,
  role      text        not null,
  source    text        not null default 'website',
  created_at timestamptz not null default now()
);

-- Index for faster duplicate checks
create index if not exists idx_waitlist_email on public.waitlist (email);

-- Row-Level Security: allow inserts for anon users (so the publishable
-- key can be used from client-side code if desired), but restrict
-- reads/updates/deletes to authenticated users only.
alter table public.waitlist enable row level security;

create policy if not exists "Anyone can insert into waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

create policy if not exists "Only authenticated users can view waitlist"
  on public.waitlist
  for select
  to authenticated
  using (true);

-- No update or delete policies — waitlist entries are append-only in
-- the normal flow. Admins can use the Supabase Dashboard directly.
