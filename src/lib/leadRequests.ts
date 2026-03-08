export type LeadRequestPayload = {
  source: string; // e.g. "pricing-calculator" | "contact"
  lang?: string;

  name: string;
  email: string;
  phone: string;
  company?: string;
  request_type?: string;
  pricing?: unknown;
  notes?: string;
};

async function fetchWithTimeout(input: RequestInfo, init: RequestInit, ms: number) {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    window.clearTimeout(t);
  }
}

export async function submitLeadRequest(payload: LeadRequestPayload): Promise<{ serial: string }> {
  let res: Response;
  try {
    res = await fetchWithTimeout(
      "/api/lead-requests",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
      12000
    );
  } catch (e: any) {
    if (e?.name === "AbortError") throw new Error("Request timed out. Please try again.");
    throw e;
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text?.slice(0, 200) || "Non-JSON server response");
  }

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? "Request failed");
  }

  return { serial: data.serial };
}
