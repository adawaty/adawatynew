export function json(status: number, body: unknown, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(headers ?? {}),
    },
  });
}

export function methodNotAllowed(allowed: string[]) {
  return json(405, { error: "Method Not Allowed", allowed });
}

export function unauthorized() {
  return json(401, { error: "Unauthorized" }, { "www-authenticate": "Bearer" });
}

export function getBearerToken(req: Request) {
  const h = req.headers.get("authorization") ?? "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m?.[1];
}
