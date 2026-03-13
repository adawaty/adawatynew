// Shared HTTP helpers for Vercel edge/serverless functions
export function json(status: number, body: unknown, extra?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(extra ?? {}),
    },
  });
}
export const methodNotAllowed = (a: string[]) => json(405, { ok: false, error: "Method Not Allowed", allowed: a });
export const unauthorized      = ()           => json(401, { ok: false, error: "Unauthorized" }, { "www-authenticate": "Bearer" });
export const badRequest        = (msg: string) => json(400, { ok: false, error: msg });
export const notFound          = (msg = "Not found") => json(404, { ok: false, error: msg });

export function getBearerToken(req: Request) {
  const h = req.headers.get("authorization") ?? "";
  return /^Bearer\s+(.+)$/i.exec(h)?.[1];
}
