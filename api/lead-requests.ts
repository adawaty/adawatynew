import { neon } from "@neondatabase/serverless";
import { z } from "zod";

// Self-contained endpoint (avoids cross-file imports on Vercel)

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let t: any;
  const timeout = new Promise<never>((_, rej) => {
    t = setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(t);
  }
}

function methodNotAllowed(allowed: string[]) {
  return json(405, { ok: false, error: "Method Not Allowed", allowed });
}

function getSql() {
  // Prefer pooled when user set it
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLER;
  if (!url) throw new Error("Missing DATABASE_URL env var");
  return neon(url);
}

async function ensureLeadRequestsTable(sql: ReturnType<typeof neon>) {
  // Make the deployment resilient: create table if missing.
  // Uses simple types that work well with admin views + future extensions.
  await withTimeout(
    sql/*sql*/`
      create table if not exists lead_requests (
        serial text primary key,
        created_at timestamptz not null default now(),
        source text not null,
        lang text,
        name text not null,
        email text,
        phone text not null,
        company text,
        request_type text,
        pricing jsonb,
        notes text,
        user_agent text
      );

      create index if not exists lead_requests_created_at_idx
        on lead_requests (created_at desc);
    `,
    8000,
    "Ensure schema"
  );
}

const LeadRequestSchema = z.object({
  source: z.string().min(1),
  lang: z.string().optional(),

  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(3),
  company: z.string().optional(),

  request_type: z.string().optional(),
  pricing: z.unknown().optional(),
  notes: z.string().optional(),
});

function serialNow() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function randomPart() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default async function handler(req: Request) {
  if (req.method !== "POST") return methodNotAllowed(["POST"]);

  try {
    const data = LeadRequestSchema.parse(await req.json());
    const sql = getSql();
    await ensureLeadRequestsTable(sql);

    // Try a few times to avoid rare serial collisions + transient DB errors.
    for (let i = 0; i < 5; i++) {
      const serial = `ADW-${serialNow()}-${randomPart()}`;
      let rows: any;
      try {
        rows = await withTimeout(
          sql/*sql*/`
        insert into lead_requests (
          serial, source, lang, name, email, phone, company, request_type, pricing, notes, user_agent
        )
        values (
          ${serial},
          ${data.source},
          ${data.lang ?? null},
          ${data.name},
          ${data.email ? data.email : null},
          ${data.phone},
          ${data.company ?? null},
          ${data.request_type ?? null},
          ${data.pricing ?? null},
          ${data.notes ?? null},
          ${req.headers.get("user-agent") ?? null}
        )
        on conflict (serial) do nothing
        returning serial;
      `,
          8000,
          "Insert lead"
        );
      } catch (e) {
        // small backoff
        await new Promise((r) => setTimeout(r, 150 * (i + 1)));
        continue;
      }

      if (Array.isArray(rows) && rows.length > 0) {
        return json(200, { ok: true, serial: rows[0].serial });
      }
    }

    return json(500, { ok: false, error: "Could not allocate serial" });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message ?? "Server error" });
  }
}
