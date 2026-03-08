import { getAdminToken, getSql } from "../../_db";
import { getBearerToken, json, methodNotAllowed, unauthorized } from "../../_http";

export default async function handler(req: Request) {
  if (req.method !== "GET") return methodNotAllowed(["GET"]);

  const token = getBearerToken(req);
  if (!token || token !== getAdminToken()) return unauthorized();

  const url = new URL(req.url);
  const serial = url.searchParams.get("serial");
  if (!serial) return json(400, { ok: false, error: "Missing serial" });

  const sql = getSql();
  const rows = await sql/*sql*/`
    select *
    from lead_requests
    where serial = ${serial}
    limit 1;
  `;

  if (!rows || rows.length === 0) return json(404, { ok: false, error: "Not found" });

  return json(200, { ok: true, item: rows[0] });
}
