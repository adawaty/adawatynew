/*
  Supabase service layer — type-safe CRUD for lead_requests
  Works gracefully when env vars are missing (dev without Supabase).
*/

import { supabase } from "./supabaseClient";

// ── Types ─────────────────────────────────────────────────────────────────────

export type LeadSource = "contact" | "pricing" | "newsletter" | "audit" | "ai-visibility";

export interface LeadRequest {
  id?: string;
  created_at?: string;
  source: LeadSource;
  lang?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  request_type?: string;
  pricing?: Record<string, unknown>;
  notes?: string;
  status?: "new" | "contacted" | "converted" | "closed";
}

export interface InsertLeadResult {
  ok: boolean;
  id?: string;
  error?: string;
}

// ── Insert ────────────────────────────────────────────────────────────────────

export async function insertLead(payload: LeadRequest): Promise<InsertLeadResult> {
  try {
    const { data, error } = await supabase
      .from("lead_requests")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.warn("[supabase] insertLead error:", error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, id: data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.warn("[supabase] insertLead exception:", msg);
    return { ok: false, error: msg };
  }
}

// ── Fetch all (admin) ─────────────────────────────────────────────────────────

export interface FetchLeadsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  source?: string;
  search?: string;
}

export interface FetchLeadsResult {
  ok: boolean;
  data: LeadRequest[];
  count: number;
  error?: string;
}

export async function fetchLeads(opts: FetchLeadsOptions = {}): Promise<FetchLeadsResult> {
  try {
    const { limit = 50, offset = 0, status, source, search } = opts;

    let query = supabase
      .from("lead_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") query = query.eq("status", status);
    if (source && source !== "all") query = query.eq("source", source);
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.warn("[supabase] fetchLeads error:", error.message);
      return { ok: false, data: [], count: 0, error: error.message };
    }

    return { ok: true, data: (data as LeadRequest[]) ?? [], count: count ?? 0 };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, data: [], count: 0, error: msg };
  }
}

// ── Update status ─────────────────────────────────────────────────────────────

export async function updateLeadStatus(
  id: string,
  status: LeadRequest["status"]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("lead_requests")
      .update({ status })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown" };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteLead(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("lead_requests").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown" };
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
  bySource: Record<string, number>;
}

export async function fetchLeadStats(): Promise<{ ok: boolean; stats?: LeadStats; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("lead_requests")
      .select("status, source");

    if (error) return { ok: false, error: error.message };

    const rows = (data ?? []) as { status: string; source: string }[];
    const stats: LeadStats = {
      total: rows.length,
      new: rows.filter((r) => r.status === "new").length,
      contacted: rows.filter((r) => r.status === "contacted").length,
      converted: rows.filter((r) => r.status === "converted").length,
      bySource: {},
    };

    for (const r of rows) {
      stats.bySource[r.source] = (stats.bySource[r.source] ?? 0) + 1;
    }

    return { ok: true, stats };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown" };
  }
}
