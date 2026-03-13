// Neon DB helper — shared by all API routes
import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLER;
  if (!url) throw new Error("Missing DATABASE_URL env var");
  return neon(url);
}

export function getAdminToken() {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new Error("Missing ADMIN_TOKEN env var");
  return token;
}

export async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let t: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, rej) => {
    t = setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(t!);
  }
}

export async function ensureSchema(sql: ReturnType<typeof neon>) {
  await withTimeout(
    sql`
      create table if not exists lead_requests (
        serial       text primary key,
        created_at   timestamptz not null default now(),
        source       text not null,
        lang         text,
        name         text not null,
        email        text,
        phone        text not null,
        company      text,
        request_type text,
        pricing      jsonb,
        notes        text,
        user_agent   text,
        status       text not null default 'new'
      );
      create index if not exists lead_requests_created_at_idx on lead_requests (created_at desc);
      create index if not exists lead_requests_source_idx     on lead_requests (source);
      create index if not exists lead_requests_status_idx     on lead_requests (status);
    `,
    8000,
    "ensureSchema"
  );
}
