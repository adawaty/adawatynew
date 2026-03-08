/*
Cairo Circuit Futurism — Admin dashboard
- Reads submissions from Neon-backed API.
- Auth: ADMIN_TOKEN via Bearer token.
*/

import { useEffect, useMemo, useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";

type Row = {
  serial: string;
  created_at: string;
  source: string;
  lang: string | null;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  request_type: string | null;
};

export default function Admin() {
  const { t } = useI18n();
  const [token, setToken] = useState<string>(() => localStorage.getItem("adawaty_admin_token") ?? "");
  const [items, setItems] = useState<Row[]>([]);
  const [selectedSerial, setSelectedSerial] = useState<string>("");
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => ({ authorization: `Bearer ${token}`, "content-type": "application/json" }),
    [token]
  );

  async function loadList() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions?limit=100", { headers });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error ?? "Failed");
      setItems(data.items ?? []);
    } catch (e: any) {
      toast.error(t("admin.error"), { description: e?.message ?? "" });
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(serial: string) {
    if (!token || !serial) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submission?serial=${encodeURIComponent(serial)}`, { headers });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error ?? "Failed");
      setDetail(data.item);
    } catch (e: any) {
      toast.error(t("admin.error"), { description: e?.message ?? "" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <SiteLayout title={t("admin.title")} subtitle={t("admin.subtitle")}>
      <SeoHead title={`Admin | Adawaty`} description="Adawaty admin dashboard" path="/admin" type="website" />

      <section className="pt-10">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="glass rounded-2xl p-7">
            <div className="text-lg font-semibold">{t("admin.authTitle")}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t("admin.authDesc")}</p>

            <div className="mt-5 grid gap-2">
              <Label htmlFor="token">{t("admin.token")}</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste ADMIN_TOKEN"
                spellCheck={false}
              />
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("adawaty_admin_token", token);
                    loadList();
                  }}
                  disabled={!token || loading}
                >
                  {t("admin.saveAndLoad")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    localStorage.removeItem("adawaty_admin_token");
                    setToken("");
                    setItems([]);
                    setDetail(null);
                    setSelectedSerial("");
                  }}
                >
                  {t("admin.signOut")}
                </Button>
              </div>
            </div>

            <div className="circuit-divider my-6" />

            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{t("admin.submissions")}</div>
              <Button size="sm" variant="ghost" onClick={loadList} disabled={!token || loading}>
                {t("admin.refresh")}
              </Button>
            </div>

            <div className="mt-3 grid gap-2">
              {items.length === 0 ? (
                <div className="text-sm text-muted-foreground">{t("admin.empty")}</div>
              ) : (
                items.map((it) => (
                  <button
                    key={it.serial}
                    className={
                      "text-left rounded-xl border border-white/10 bg-white/3 px-4 py-3 hover:bg-white/5 transition" +
                      (selectedSerial === it.serial ? " ring-1 ring-primary/50" : "")
                    }
                    onClick={() => {
                      setSelectedSerial(it.serial);
                      loadDetail(it.serial);
                    }}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{it.serial}</div>
                      <div className="text-xs text-muted-foreground">{new Date(it.created_at).toLocaleString()}</div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {it.source} • {it.name} • {it.email}
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card className="glass rounded-2xl p-7">
            <div className="text-lg font-semibold">{t("admin.detail")}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t("admin.detailDesc")}</p>

            {!detail ? (
              <div className="mt-6 text-sm text-muted-foreground">{t("admin.pick")}</div>
            ) : (
              <div className="mt-6 grid gap-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>{t("admin.fields.name")}</Label>
                    <Input value={detail.name ?? ""} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("admin.fields.company")}</Label>
                    <Input value={detail.company ?? ""} readOnly />
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>{t("admin.fields.email")}</Label>
                    <Input value={detail.email ?? ""} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("admin.fields.phone")}</Label>
                    <Input value={detail.phone ?? ""} readOnly />
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>{t("admin.fields.source")}</Label>
                    <Input value={detail.source ?? ""} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("admin.fields.requestType")}</Label>
                    <Input value={detail.request_type ?? ""} readOnly />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>{t("admin.fields.notes")}</Label>
                  <Textarea value={detail.notes ?? ""} readOnly className="min-h-24" />
                </div>

                <div className="grid gap-2">
                  <Label>{t("admin.fields.pricing")}</Label>
                  <Textarea value={JSON.stringify(detail.pricing ?? null, null, 2)} readOnly className="min-h-52 font-mono text-xs" />
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
