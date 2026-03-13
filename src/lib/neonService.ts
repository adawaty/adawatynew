/*
  Neon Backend Service — client-side helpers
  All writes/reads go through /api/* Vercel serverless functions
  which connect to Neon Postgres via DATABASE_URL.
*/

export type LeadSource = "contact" | "pricing" | "newsletter" | "audit" | "ai-visibility";

export interface LeadRequest {
  /** Primary key — human-readable serial like ADW-20260313-ABC123 */
  id?: string;          // maps to `serial` column
  serial?: string;
  created_at?: string;
  source?: LeadSource;
  lang?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  request_type?: string;
  pricing?: Record<string, unknown> | null;
  notes?: string;
  status?: "new" | "contacted" | "converted" | "closed";
}

export interface LeadPayload {
  source: LeadSource;
  lang?: string;
  name: string;
  email?: string;
  phone: string;
  company?: string;
  request_type?: string;
  pricing?: Record<string, unknown> | null;
  notes?: string;
}

// ── Insert a lead via POST /api/lead-requests ─────────────────────────────────
export async function insertLead(
  payload: LeadPayload
): Promise<{ ok: boolean; serial?: string; id?: string; error?: string }> {
  try {
    const res = await fetch("/api/lead-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.ok) return { ok: true, serial: json.serial, id: json.serial };
    return { ok: false, error: json.error ?? "Unknown error" };
  } catch (err: any) {
    console.warn("[neonService] insertLead failed:", err?.message);
    return { ok: false, error: err?.message ?? "Network error" };
  }
}

// ── Admin: fetch leads via GET /api/admin/submissions ─────────────────────────
export interface FetchLeadsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  source?: string;
  search?: string;
  token?: string;
}

export interface FetchLeadsResult {
  ok: boolean;
  data: LeadRequest[];
  count: number;
  error?: string;
}

export async function fetchLeads(opts: FetchLeadsOptions = {}): Promise<FetchLeadsResult> {
  try {
    const params = new URLSearchParams();
    if (opts.limit)  params.set("limit",  String(opts.limit));
    if (opts.offset) params.set("offset", String(opts.offset));
    if (opts.status && opts.status !== "all") params.set("status", opts.status);
    if (opts.source && opts.source !== "all") params.set("source", opts.source);
    if (opts.search) params.set("search", opts.search);

    const res = await fetch(`/api/admin/submissions?${params.toString()}`, {
      headers: { Authorization: `Bearer ${opts.token ?? getAdminToken()}` },
    });
    const json = await res.json();
    if (!json.ok) return { ok: false, data: [], count: 0, error: json.error };
    // Normalise: map `serial` → `id` for the UI
    const data: LeadRequest[] = (json.items ?? []).map((r: any) => ({ ...r, id: r.serial ?? r.id }));
    return { ok: true, data, count: json.total ?? data.length };
  } catch (err: any) {
    return { ok: false, data: [], count: 0, error: err?.message };
  }
}

// ── Admin: update lead status via PATCH /api/admin/submissions ────────────────
export async function updateLeadStatus(
  serial: string,
  status: LeadRequest["status"],
  token?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? getAdminToken()}`,
      },
      body: JSON.stringify({ serial, status }),
    });
    const json = await res.json();
    return { ok: json.ok, error: json.error };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

// ── Admin: delete lead via DELETE /api/admin/submissions ──────────────────────
export async function deleteLead(
  serial: string,
  token?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/submissions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? getAdminToken()}`,
      },
      body: JSON.stringify({ serial }),
    });
    const json = await res.json();
    return { ok: json.ok, error: json.error };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

// ── Admin: fetch stats via GET /api/admin/submissions?stats=1 ─────────────────
export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
  bySource: Record<string, number>;
}

export async function fetchLeadStats(
  token?: string
): Promise<{ ok: boolean; stats?: LeadStats; error?: string }> {
  try {
    const res = await fetch("/api/admin/submissions?stats=1", {
      headers: { Authorization: `Bearer ${token ?? getAdminToken()}` },
    });
    const json = await res.json();
    if (!json.ok) return { ok: false, error: json.error };
    // If the API returns stats directly use them, otherwise compute from items
    if (json.stats) return { ok: true, stats: json.stats };
    // Fallback: compute from full listing
    const all = json.items ?? [];
    const stats: LeadStats = { total: json.total ?? all.length, new: 0, contacted: 0, converted: 0, bySource: {} };
    for (const r of all) {
      if (r.status === "new") stats.new++;
      else if (r.status === "contacted") stats.contacted++;
      else if (r.status === "converted") stats.converted++;
      stats.bySource[r.source] = (stats.bySource[r.source] ?? 0) + 1;
    }
    return { ok: true, stats };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

// ── Session token helper ───────────────────────────────────────────────────────
const ADMIN_TOKEN_KEY = "adawaty_admin_token";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}
