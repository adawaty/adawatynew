import { neon } from "@neondatabase/serverless";

function json(status: number, body: unknown, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(extraHeaders ?? {}),
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

function unauthorized() {
  return json(401, { ok: false, error: "Unauthorized" }, { "www-authenticate": "Bearer" });
}

function getBearerToken(req: Request) {
  const h = req.headers.get("authorization") ?? "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m?.[1];
}

function getSql() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLER;
  if (!url) throw new Error("Missing DATABASE_URL env var");
  return neon(url);
}

async function ensureLeadRequestsTable(sql: ReturnType<typeof neon>) {
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

function getAdminToken() {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new Error("Missing ADMIN_TOKEN env var");
  return token;
}

export default async function handler(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token || token !== getAdminToken()) return unauthorized();

    const url = new URL(req.url);
    const serial = url.searchParams.get("serial");
    if (!serial) return json(400, { ok: false, error: "Missing serial" });

    const sql = getSql();
    await ensureLeadRequestsTable(sql);

    if (req.method === "GET") {
      const rows = await withTimeout(
        sql/*sql*/`
          select *
          from lead_requests
          where serial = ${serial}
          limit 1;
        `,
        8000,
        "Get submission"
      );

      if (!rows || rows.length === 0) return json(404, { ok: false, error: "Not found" });
      return json(200, { ok: true, item: rows[0] });
    }

    if (req.method === "PATCH") {
      const body = (await req.json().catch(() => null)) as any;
      if (!body || typeof body !== "object") return json(400, { ok: false, error: "Invalid body" });

      const company = typeof body.company === "string" ? body.company : null;
      const request_type = typeof body.request_type === "string" ? body.request_type : null;
      const notes = typeof body.notes === "string" ? body.notes : null;
      const pricing = body.pricing ?? null;

      const rows = await withTimeout(
        sql/*sql*/`
          update lead_requests
          set
            company = ${company},
            request_type = ${request_type},
            notes = ${notes},
            pricing = ${pricing}
          where serial = ${serial}
          returning *;
        `,
        8000,
        "Update submission"
      );

      if (!rows || rows.length === 0) return json(404, { ok: false, error: "Not found" });
      return json(200, { ok: true, item: rows[0] });
    }

    if (req.method === "DELETE") {
      const rows = await withTimeout(
        sql/*sql*/`
          delete from lead_requests
          where serial = ${serial}
          returning serial;
        `,
        8000,
        "Delete submission"
      );

      if (!rows || rows.length === 0) return json(404, { ok: false, error: "Not found" });
      return json(200, { ok: true, serial });
    }

    return methodNotAllowed(["GET", "PATCH", "DELETE"]);
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message ?? "Server error" });
  }
}
