-- MusicRight.AI — Complete Schema v2
-- Run in Supabase SQL Editor: app.supabase.com → your project → SQL Editor → New query
-- Safe to re-run (all statements use IF NOT EXISTS / IF EXISTS guards)

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Song submissions ──────────────────────────────────────────────────────────
-- One row per song check. Linked to auth.users when the user is signed in.
create table if not exists mvp_song_submissions (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  -- Auth
  user_id               uuid references auth.users(id) on delete set null,
  email                 text not null,

  -- Song info
  artist_name           text not null,
  song_title            text not null,
  release_status        text,
  user_type             text not null default 'first_time',

  -- Full JSON blobs (raw intake + computed diagnosis)
  raw_input_json        jsonb not null,
  diagnosis_json        jsonb,

  source                text default 'web'
);

-- Add user_id if upgrading from v1 (safe no-op if column already exists)
do $$ begin
  alter table mvp_song_submissions add column user_id uuid references auth.users(id) on delete set null;
exception when duplicate_column then null;
end $$;

create index if not exists idx_submissions_user_id on mvp_song_submissions(user_id);
create index if not exists idx_submissions_email    on mvp_song_submissions(email);
create index if not exists idx_submissions_created  on mvp_song_submissions(created_at desc);

-- RLS
alter table mvp_song_submissions enable row level security;

-- Authenticated users can see and insert their own submissions
drop policy if exists "own submissions select" on mvp_song_submissions;
create policy "own submissions select" on mvp_song_submissions
  for select using (auth.uid() = user_id);

drop policy if exists "own submissions insert" on mvp_song_submissions;
create policy "own submissions insert" on mvp_song_submissions
  for insert with check (auth.uid() = user_id or user_id is null);

-- ── Waitlist / leads ──────────────────────────────────────────────────────────
create table if not exists mvp_waitlist (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique,
  artist_name text,
  song_title  text,
  user_type   text,
  wants_help  boolean default false,
  source      text,
  notes       text
);

create index if not exists idx_waitlist_email on mvp_waitlist(email);

alter table mvp_waitlist enable row level security;

drop policy if exists "anyone can join waitlist" on mvp_waitlist;
create policy "anyone can join waitlist" on mvp_waitlist
  for insert with check (true);

-- ── Orders ────────────────────────────────────────────────────────────────────
-- Tracks Setup ($49) and Done-For-You ($149) orders.
create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  user_id         uuid references auth.users(id) on delete set null,
  submission_id   uuid references mvp_song_submissions(id) on delete set null,
  email           text not null,
  artist_name     text,
  song_title      text,
  plan            text not null check (plan in ('setup', 'dfy')),
  status          text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  amount_cents    integer not null,
  notes           text
);

create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_email   on orders(email);

alter table orders enable row level security;

drop policy if exists "own orders select" on orders;
create policy "own orders select" on orders
  for select using (auth.uid() = user_id);

drop policy if exists "own orders insert" on orders;
create policy "own orders insert" on orders
  for insert with check (auth.uid() = user_id or user_id is null);

-- ── Events (analytics) ───────────────────────────────────────────────────────
create table if not exists mvp_events (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  user_id        uuid references auth.users(id) on delete set null,
  submission_id  uuid references mvp_song_submissions(id) on delete set null,
  event_name     text not null,
  event_payload  jsonb
);

alter table mvp_events enable row level security;

-- ── Convenience view ──────────────────────────────────────────────────────────
-- Flattens diagnosis_json for easy querying in the dashboard.
create or replace view user_song_stats as
select
  s.id,
  s.user_id,
  s.created_at,
  s.artist_name,
  s.song_title,
  s.release_status,
  s.user_type,
  (s.raw_input_json ->> 'hasISRC')::boolean as has_isrc,
  (s.raw_input_json ->> 'distributor') as distributor,
  (s.diagnosis_json ->> 'score')::int as score,
  s.diagnosis_json -> 'registrationGaps' as gaps,
  s.diagnosis_json -> 'accountCoverage' as account_coverage,
  s.diagnosis_json -> 'nextActions' as next_actions
from mvp_song_submissions s;
