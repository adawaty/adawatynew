// /api/admin/submissions — CRUD + stats for lead_requests (admin-only)
// GET    ?limit=&offset=&status=&source=&search=  → list
// GET    ?stats=1                                  → aggregated stats
// PATCH  { serial, status }                        → update status
// DELETE { serial }                                → delete row
import { neon } from "@neondatabase/serverless";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(status: number, body: unknown, extra?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, ...(extra ?? {}) },
  });
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let t: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, rej) => { t = setTimeout(() => rej(new Error(`${label} timed out`)), ms); });
  try { return await Promise.race([p, timeout]); } finally { clearTimeout(t!); }
}

function getSql() {
  const u = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLER;
  if (!u) throw new Error("Missing DATABASE_URL");
  return neon(u);
}

function getAdminToken() {
  const t = process.env.ADMIN_TOKEN;
  if (!t) throw new Error("Missing ADMIN_TOKEN");
  return t;
}

function getBearer(req: Request) {
  return /^Bearer\s+(.+)$/i.exec(req.headers.get("authorization") ?? "")?.[1];
}

async function ensureSchema(sql: ReturnType<typeof neon>) {
  await withTimeout(sql`
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
      user_agent text,
      status text not null default 'new'
    );
    create index if not exists lead_requests_created_at_idx on lead_requests (created_at desc);
    create index if not exists lead_requests_source_idx on lead_requests (source);
    create index if not exists lead_requests_status_idx on lead_requests (status);
  `, 8000, "ensureSchema");
}

export default async function handler(req: Request) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const bearer = getBearer(req);
  if (!bearer || bearer !== getAdminToken()) {
    return json(401, { ok: false, error: "Unauthorized" }, { "www-authenticate": "Bearer" });
  }

  const sql = getSql();
  await ensureSchema(sql);

  // ── PATCH: update status ───────────────────────────────────────────────────
  if (req.method === "PATCH") {
    try {
      const { serial, status } = await req.json();
      if (!serial || !status) return json(400, { ok: false, error: "serial and status required" });
      const valid = ["new", "contacted", "converted", "closed"];
      if (!valid.includes(status)) return json(400, { ok: false, error: "Invalid status" });
      await withTimeout(
        sql`update lead_requests set status = ${status} where serial = ${serial}`,
        5000, "updateStatus"
      );
      return json(200, { ok: true });
    } catch (err: any) {
      return json(500, { ok: false, error: err?.message ?? "Server error" });
    }
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────
  if (req.method === "DELETE") {
    try {
      const { serial } = await req.json();
      if (!serial) return json(400, { ok: false, error: "serial required" });
      await withTimeout(
        sql`delete from lead_requests where serial = ${serial}`,
        5000, "deleteLead"
      );
      return json(200, { ok: true });
    } catch (err: any) {
      return json(500, { ok: false, error: err?.message ?? "Server error" });
    }
  }

  // ── GET ────────────────────────────────────────────────────────────────────
  if (req.method !== "GET") return json(405, { ok: false, error: "Method Not Allowed" });

  try {
    const url = new URL(req.url);

    // Stats endpoint
    if (url.searchParams.get("stats") === "1") {
      const rows = await withTimeout(
        sql`select status, source from lead_requests`,
        8000, "stats"
      ) as any[];
      const stats = { total: rows.length, new: 0, contacted: 0, converted: 0, bySource: {} as Record<string, number> };
      for (const r of rows) {
        if (r.status === "new") stats.new++;
        else if (r.status === "contacted") stats.contacted++;
        else if (r.status === "converted") stats.converted++;
        stats.bySource[r.source] = (stats.bySource[r.source] ?? 0) + 1;
      }
      return json(200, { ok: true, stats });
    }

    const limit  = Math.min(Number(url.searchParams.get("limit")  ?? 50)  || 50,  200);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? 0)   || 0,   0);
    const status = url.searchParams.get("status") ?? "";
    const source = url.searchParams.get("source") ?? "";
    const search = url.searchParams.get("search") ?? "";

    let rows: any[];
    let total: number;

    if (!status && !source && !search) {
      const [r, c] = await Promise.all([
        withTimeout(sql`select serial,created_at,source,lang,name,email,phone,company,request_type,status,notes,pricing from lead_requests order by created_at desc limit ${limit} offset ${offset}`, 8000, "list"),
        withTimeout(sql`select count(*) as total from lead_requests`, 5000, "count"),
      ]) as [any[], any[]];
      rows = r;
      total = Number(c?.[0]?.total ?? 0);
    } else if (status && status !== "all" && !source && !search) {
      const [r, c] = await Promise.all([
        withTimeout(sql`select serial,created_at,source,lang,name,email,phone,company,request_type,status,notes,pricing from lead_requests where status=${status} order by created_at desc limit ${limit} offset ${offset}`, 8000, "list"),
        withTimeout(sql`select count(*) as total from lead_requests where status=${status}`, 5000, "count"),
      ]) as [any[], any[]];
      rows = r;
      total = Number(c?.[0]?.total ?? 0);
    } else if (source && source !== "all" && !status && !search) {
      const [r, c] = await Promise.all([
        withTimeout(sql`select serial,created_at,source,lang,name,email,phone,company,request_type,status,notes,pricing from lead_requests where source=${source} order by created_at desc limit ${limit} offset ${offset}`, 8000, "list"),
        withTimeout(sql`select count(*) as total from lead_requests where source=${source}`, 5000, "count"),
      ]) as [any[], any[]];
      rows = r;
      total = Number(c?.[0]?.total ?? 0);
    } else {
      // Combined filters — fetch all, filter in JS
      const all = await withTimeout(
        sql`select serial,created_at,source,lang,name,email,phone,company,request_type,status,notes,pricing from lead_requests order by created_at desc`,
        8000, "list-all"
      ) as any[];
      let filtered = all;
      if (status && status !== "all") filtered = filtered.filter((r: any) => r.status === status);
      if (source && source !== "all") filtered = filtered.filter((r: any) => r.source === source);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((r: any) =>
          r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) ||
          r.phone?.toLowerCase().includes(q) || r.company?.toLowerCase().includes(q)
        );
      }
      total = filtered.length;
      rows = filtered.slice(offset, offset + limit);
    }

    return json(200, { ok: true, items: rows, total, limit, offset });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message ?? "Server error" });
  }
}
