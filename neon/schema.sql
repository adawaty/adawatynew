-- Neon / Postgres schema for Adawaty (adawatynew)
-- Run this in Neon SQL Editor (or via migrations) on your main branch.

create extension if not exists pgcrypto;

create table if not exists lead_requests (
  id uuid primary key default gen_random_uuid(),
  serial text not null unique,
  created_at timestamptz not null default now(),

  source text not null, -- e.g. pricing-calculator | contact
  lang text,

  name text not null,
  email text not null,
  phone text not null,
  company text,
  request_type text,
  pricing jsonb,
  notes text,

  user_agent text,
  ip inet
);

create index if not exists lead_requests_created_at_idx on lead_requests(created_at desc);
create index if not exists lead_requests_source_idx on lead_requests(source);
