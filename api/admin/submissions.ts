import { getAdminToken, getSql } from "../_db.js";
import { getBearerToken, json, methodNotAllowed, unauthorized } from "../_http.js";

export default async function handler(req: Request) {
  if (req.method !== "GET") return methodNotAllowed(["GET"]);

  const token = getBearerToken(req);
  if (!token || token !== getAdminToken()) return unauthorized();

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200);
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0) || 0, 0);

  const sql = getSql();
  const rows = await sql/*sql*/`
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
  `;

  return json(200, { ok: true, items: rows, limit, offset });
}
