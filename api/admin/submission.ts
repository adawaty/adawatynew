import { getAdminToken, getSql } from "../../_db.js";
import { getBearerToken, json, methodNotAllowed, unauthorized } from "../../_http.js";

export default async function handler(req: Request) {
  if (req.method === "GET") {
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

  if (req.method === "PATCH") {
    const token = getBearerToken(req);
    if (!token || token !== getAdminToken()) return unauthorized();

    const url = new URL(req.url);
    const serial = url.searchParams.get("serial");
    if (!serial) return json(400, { ok: false, error: "Missing serial" });

    const body = (await req.json().catch(() => null)) as any;
    if (!body || typeof body !== "object") return json(400, { ok: false, error: "Invalid body" });

    // allow editing a safe subset
    const company = typeof body.company === "string" ? body.company : null;
    const request_type = typeof body.request_type === "string" ? body.request_type : null;
    const notes = typeof body.notes === "string" ? body.notes : null;
    const pricing = body.pricing ?? null; // can be object or null

    const sql = getSql();
    const rows = await sql/*sql*/`
      update lead_requests
      set
        company = ${company},
        request_type = ${request_type},
        notes = ${notes},
        pricing = ${pricing}
      where serial = ${serial}
      returning *;
    `;

    if (!rows || rows.length === 0) return json(404, { ok: false, error: "Not found" });

    return json(200, { ok: true, item: rows[0] });
  }

  if (req.method === "DELETE") {
    const token = getBearerToken(req);
    if (!token || token !== getAdminToken()) return unauthorized();

    const url = new URL(req.url);
    const serial = url.searchParams.get("serial");
    if (!serial) return json(400, { ok: false, error: "Missing serial" });

    const sql = getSql();
    const rows = await sql/*sql*/`
      delete from lead_requests
      where serial = ${serial}
      returning serial;
    `;

    if (!rows || rows.length === 0) return json(404, { ok: false, error: "Not found" });

    return json(200, { ok: true, serial });
  }

  return methodNotAllowed(["GET", "PATCH", "DELETE"]);
}
