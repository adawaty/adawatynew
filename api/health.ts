import { neon } from "@neondatabase/serverless";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function getSql() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLER;
  if (!url) throw new Error("Missing DATABASE_URL env var");
  return neon(url);
}

function getAdminToken() {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new Error("Missing ADMIN_TOKEN env var");
  return token;
}

export default async function handler(req: Request) {
  // Minimal health check for debugging deployments
  try {
    const tokenHeader = req.headers.get("authorization") ?? "";
    const okToken = tokenHeader === `Bearer ${getAdminToken()}`;

    const sql = getSql();
    const rows = await (async () => {
      let t: any;
      const timeout = new Promise<never>((_, rej) => {
        t = setTimeout(() => rej(new Error("Health check timed out after 5000ms")), 5000);
      });
      try {
        return await Promise.race([sql/*sql*/`select now() as now;`, timeout]);
      } finally {
        clearTimeout(t);
      }
    })();

    return json(200, {
      ok: true,
      env: {
        hasDatabaseUrl: true,
        hasAdminToken: true,
      },
      auth: {
        bearerMatches: okToken,
      },
      db: rows?.[0] ?? null,
    });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message ?? "Server error" });
  }
}
