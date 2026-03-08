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

export async function submitLeadRequest(payload: LeadRequestPayload): Promise<{ serial: string }> {
  const res = await fetch("/api/lead-requests", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? "Request failed");
  }

  return { serial: data.serial };
}
