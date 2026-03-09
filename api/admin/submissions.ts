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
  if (req.method !== "GET") return methodNotAllowed(["GET"]);

  try {
    const token = getBearerToken(req);
    if (!token || token !== getAdminToken()) return unauthorized();

    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? 0) || 0, 0);

    const sql = getSql();
    await ensureLeadRequestsTable(sql);
    const rows = await withTimeout(
      sql/*sql*/`
        select
          serial,
          created_at,
          source,
          lang,
          name,
          email,
          phone,
          company,
          request_type
        from lead_requests
        order by created_at desc
        limit ${limit}
        offset ${offset};
      `,
      8000,
      "List submissions"
    );

    return json(200, { ok: true, items: rows, limit, offset });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message ?? "Server error" });
  }
}
