-- Run this in Supabase SQL editor (because direct DB access may be blocked in some environments)

create extension if not exists pgcrypto;

create table if not exists public.lead_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,
  lang text,
  name text,
  email text,
  phone text,
  company text,
  request_type text,
  pricing jsonb,
  notes text,
  status text not null default 'new'
);

alter table public.lead_requests enable row level security;

-- Allow anonymous inserts from the website (no select/update/delete)
drop policy if exists anon_insert on public.lead_requests;
create policy anon_insert
on public.lead_requests
for insert
to anon
with check (true);
