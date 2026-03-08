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

function methodNotAllowed(allowed: string[]) {
  return json(405, { ok: false, error: "Method Not Allowed", allowed });
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL env var");
  return neon(url);
}

const LeadRequestSchema = z.object({
  source: z.string().min(1),
  lang: z.string().optional(),

  name: z.string().min(1),
  email: z.string().email(),
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

    // Try a few times to avoid rare serial collisions.
    for (let i = 0; i < 5; i++) {
      const serial = `ADW-${serialNow()}-${randomPart()}`;
      const rows = await sql/*sql*/`
        insert into lead_requests (
          serial, source, lang, name, email, phone, company, request_type, pricing, notes, user_agent
        )
        values (
          ${serial},
          ${data.source},
          ${data.lang ?? null},
          ${data.name},
          ${data.email},
          ${data.phone},
          ${data.company ?? null},
          ${data.request_type ?? null},
          ${data.pricing ?? null},
          ${data.notes ?? null},
          ${req.headers.get("user-agent") ?? null}
        )
        on conflict (serial) do nothing
        returning serial;
      `;

      if (Array.isArray(rows) && rows.length > 0) {
        return json(200, { ok: true, serial: rows[0].serial });
      }
    }

    return json(500, { ok: false, error: "Could not allocate serial" });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message ?? "Server error" });
  }
}
