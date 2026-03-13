// POST /api/lead-requests — accepts form submissions from Contact & Pricing pages
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let t: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, rej) => {
    t = setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try { return await Promise.race([p, timeout]); }
  finally { clearTimeout(t!); }
}

function getSql() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLER;
  if (!url) throw new Error("Missing DATABASE_URL env var");
  return neon(url);
}

async function ensureSchema(sql: ReturnType<typeof neon>) {
  await withTimeout(sql`
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
    create index if not exists lead_requests_source_idx on lead_requests (source);
    create index if not exists lead_requests_status_idx on lead_requests (status);
  `, 8000, "ensureSchema");
}

const Schema = z.object({
  source:       z.string().min(1),
  lang:         z.string().optional(),
  name:         z.string().min(1),
  email:        z.string().email().optional().or(z.literal("")),
  phone:        z.string().min(3),
  company:      z.string().optional(),
  request_type: z.string().optional(),
  pricing:      z.unknown().optional(),
  notes:        z.string().optional(),
});

function makeSerial() {
  const d = new Date();
  const date = `${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,"0")}${String(d.getUTCDate()).padStart(2,"0")}`;
  return `ADW-${date}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
}

export default async function handler(req: Request) {
  if (req.method !== "POST") return json(405, { ok: false, error: "Method Not Allowed" });

  try {
    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) return json(400, { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
    const data = parsed.data;
    const sql = getSql();
    await ensureSchema(sql);

    for (let i = 0; i < 5; i++) {
      const serial = makeSerial();
      try {
        const rows = await withTimeout(sql`
          insert into lead_requests
            (serial, source, lang, name, email, phone, company, request_type, pricing, notes, user_agent)
          values (
            ${serial}, ${data.source}, ${data.lang ?? null}, ${data.name},
            ${data.email || null}, ${data.phone}, ${data.company ?? null},
            ${data.request_type ?? null},
            ${data.pricing != null ? JSON.stringify(data.pricing) : null},
            ${data.notes ?? null}, ${req.headers.get("user-agent") ?? null}
          )
          on conflict (serial) do nothing
          returning serial;
        `, 8000, "insertLead");
        if (Array.isArray(rows) && rows.length > 0) return json(200, { ok: true, serial: rows[0].serial });
      } catch { await new Promise(r => setTimeout(r, 150 * (i + 1))); }
    }
    return json(500, { ok: false, error: "Could not allocate serial" });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message ?? "Server error" });
  }
}
