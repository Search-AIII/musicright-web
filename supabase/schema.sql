-- MusicRight v1 schema
-- Run this in your Supabase SQL editor: supabase.com/dashboard → SQL Editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Song submissions ─────────────────────────────────────────────────────────
create table if not exists mvp_song_submissions (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  user_type             text not null,
  email                 text not null,
  artist_name           text not null,
  song_title            text not null,
  release_status        text,
  raw_input_json        jsonb not null,
  normalized_input_json jsonb,
  diagnosis_json        jsonb,
  source                text default 'web'
);

-- Index for looking up by email/artist
create index if not exists idx_submissions_email on mvp_song_submissions(email);
create index if not exists idx_submissions_artist on mvp_song_submissions(artist_name);

-- ── Waitlist / leads ─────────────────────────────────────────────────────────
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

-- ── Events (optional analytics) ──────────────────────────────────────────────
create table if not exists mvp_events (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  submission_id  uuid references mvp_song_submissions(id) on delete set null,
  event_name     text not null,
  event_payload  jsonb
);

-- RLS: disable for service key (API routes), enable for anon
alter table mvp_song_submissions enable row level security;
alter table mvp_waitlist enable row level security;
alter table mvp_events enable row level security;

-- Service role bypasses RLS automatically. No extra policy needed.
-- If you want public read of own submissions by email, add:
-- create policy "own submissions" on mvp_song_submissions
--   for select using (email = current_setting('request.jwt.claims', true)::json->>'email');
