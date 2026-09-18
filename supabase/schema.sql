-- ============================================================
-- Khetha NCAP — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── profiles ─────────────────────────────────────────────────
create table if not exists profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  language          text not null default 'English',
  province          text not null default '',
  grade             text not null default '',
  consent_version   int  not null default 0,
  push_token        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can upsert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can delete own profile"
  on profiles for delete using (auth.uid() = id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ── assessments ──────────────────────────────────────────────
-- One row per user per quiz type — upsert on (user_id, type)
create table if not exists assessments (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  type         text not null check (type in ('career', 'job-fit', 'subjects')),
  answers      jsonb not null default '{}',
  careers      jsonb not null default '[]',
  completed_at timestamptz not null default now(),
  unique (user_id, type)   -- deduplication constraint
);

alter table assessments enable row level security;

create policy "Users can read own assessments"
  on assessments for select using (auth.uid() = user_id);

create policy "Users can upsert own assessments"
  on assessments for insert with check (auth.uid() = user_id);

create policy "Users can update own assessments"
  on assessments for update using (auth.uid() = user_id);

create policy "Users can delete own assessments"
  on assessments for delete using (auth.uid() = user_id);

-- ── assessment_answers ────────────────────────────────────────
create table if not exists assessment_answers (
  id             uuid primary key default uuid_generate_v4(),
  assessment_id  uuid not null references assessments(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  question_key   text not null,
  answer         int  not null check (answer between 0 and 3),
  unique (assessment_id, question_key)
);

alter table assessment_answers enable row level security;

create policy "Users can read own answers"
  on assessment_answers for select using (auth.uid() = user_id);

create policy "Users can insert own answers"
  on assessment_answers for insert with check (auth.uid() = user_id);

create policy "Users can delete own answers"
  on assessment_answers for delete using (auth.uid() = user_id);

-- ── saved_items ───────────────────────────────────────────────
-- Careers, qualifications and providers saved by the user
create table if not exists saved_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  item_id    text not null,
  item_type  text not null check (item_type in ('career', 'qualification', 'provider')),
  note       text not null default '',
  deadline   text not null default '',   -- ISO date string
  notify_me  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, item_id)              -- deduplication constraint
);

alter table saved_items enable row level security;

create policy "Users can read own saved items"
  on saved_items for select using (auth.uid() = user_id);

create policy "Users can upsert own saved items"
  on saved_items for insert with check (auth.uid() = user_id);

create policy "Users can update own saved items"
  on saved_items for update using (auth.uid() = user_id);

create policy "Users can delete own saved items"
  on saved_items for delete using (auth.uid() = user_id);

create trigger saved_items_updated_at
  before update on saved_items
  for each row execute function update_updated_at();

-- ── consent_log ───────────────────────────────────────────────
-- Append-only audit trail — never update or delete rows
create table if not exists consent_log (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  version             int  not null,
  data_storage        boolean not null,
  push_notifications  boolean not null,
  analytics           boolean not null,
  action              text not null check (action in ('granted', 'withdrawn')),
  ip_hash             text,              -- SHA-256 of IP, for audit only
  created_at          timestamptz not null default now()
);

alter table consent_log enable row level security;

-- Users can read their own consent history
create policy "Users can read own consent log"
  on consent_log for select using (auth.uid() = user_id);

-- Users can insert (grant/withdraw) — but never update or delete
create policy "Users can insert consent log"
  on consent_log for insert with check (auth.uid() = user_id);

-- ── sync_queue ────────────────────────────────────────────────
-- Server-side mirror of the client offline sync queue
create table if not exists sync_queue (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  table_name      text not null,
  payload         jsonb not null,
  conflict_column text not null,
  status          text not null default 'pending' check (status in ('pending', 'synced', 'failed')),
  created_at      timestamptz not null default now(),
  synced_at       timestamptz
);

alter table sync_queue enable row level security;

create policy "Users can manage own sync queue"
  on sync_queue for all using (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists idx_assessments_user    on assessments (user_id);
create index if not exists idx_saved_items_user    on saved_items (user_id);
create index if not exists idx_consent_log_user    on consent_log (user_id);
create index if not exists idx_sync_queue_user     on sync_queue (user_id, status);
