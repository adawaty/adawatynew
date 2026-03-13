// GET /api/health — DB connectivity check (admin-gated)
import { neon } from "@neondatabase/serverless";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export default async function handler(req: Request) {
  try {
    const url = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLER;
    const token = process.env.ADMIN_TOKEN;
    const auth = req.headers.get("authorization") ?? "";
    const authed = token && auth === `Bearer ${token}`;

    if (!url) return json(500, { ok: false, error: "DATABASE_URL not set" });

    let dbRow = null;
    let dbError = null;
    try {
      const sql = neon(url);
      let t: ReturnType<typeof setTimeout>;
      const timeout = new Promise<never>((_, rej) => { t = setTimeout(() => rej(new Error("DB timeout")), 5000); });
      const rows = await Promise.race([sql`select now() as now, count(*) as leads from lead_requests;`, timeout]);
      clearTimeout(t!);
      dbRow = rows?.[0] ?? null;
    } catch (e: any) {
      dbError = e?.message;
    }

    return json(200, {
      ok: true,
      env: { hasDatabaseUrl: true, hasAdminToken: !!token },
      auth: { bearerMatches: authed },
      db: dbRow,
      dbError,
    });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message ?? "Server error" });
  }
}
