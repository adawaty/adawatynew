-- Adawaty — Neon Postgres schema
-- Run this in the Neon SQL Editor to create the required tables.
-- The API routes also run `create table if not exists` on first request,
-- so this file is provided for manual setup / migrations.

-- Required extension for UUID generation
create extension if not exists pgcrypto;

-- ── lead_requests ─────────────────────────────────────────────────────────────
create table if not exists lead_requests (
  serial       text primary key,                         -- human-readable: ADW-YYYYMMDD-XXXXXX
  created_at   timestamptz not null default now(),
  source       text not null,                            -- 'contact' | 'pricing' | 'newsletter' | 'audit'
  lang         text,                                     -- e.g. 'en', 'ar-EG'
  name         text not null,
  email        text,
  phone        text not null,
  company      text,
  request_type text,                                     -- service slug or free-text
  pricing      jsonb,                                    -- full pricing snapshot from calculator
  notes        text,
  user_agent   text,
  status       text not null default 'new'               -- 'new' | 'contacted' | 'converted' | 'closed'
);

-- Indexes for common query patterns
create index if not exists lead_requests_created_at_idx on lead_requests (created_at desc);
create index if not exists lead_requests_source_idx     on lead_requests (source);
create index if not exists lead_requests_status_idx     on lead_requests (status);

-- Row-level security (optional — useful if you expose Supabase/direct Postgres)
-- alter table lead_requests enable row level security;
