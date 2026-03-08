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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  const [editCompany, setEditCompany] = useState<string>("");
  const [editRequestType, setEditRequestType] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editPricing, setEditPricing] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      setEditCompany(data.item?.company ?? "");
      setEditRequestType(data.item?.request_type ?? "");
      setEditNotes(data.item?.notes ?? "");
      setEditPricing(JSON.stringify(data.item?.pricing ?? null, null, 2));
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
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/3 px-4 py-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Serial:</span>{" "}
                    <span className="font-medium">{detail.serial}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={!token || saving}
                      onClick={async () => {
                        if (!detail?.serial) return;
                        setSaving(true);
                        const toastId = toast.loading("Saving…");
                        try {
                          let pricingJson: any = null;
                          try {
                            pricingJson = editPricing.trim() ? JSON.parse(editPricing) : null;
                          } catch {
                            toast.error("Pricing JSON is invalid", { id: toastId });
                            setSaving(false);
                            return;
                          }

                          const res = await fetch(`/api/admin/submission?serial=${encodeURIComponent(detail.serial)}`, {
                            method: "PATCH",
                            headers,
                            body: JSON.stringify({
                              company: editCompany,
                              request_type: editRequestType,
                              notes: editNotes,
                              pricing: pricingJson,
                            }),
                          });
                          const data = await res.json();
                          if (!res.ok || !data.ok) throw new Error(data?.error ?? "Failed");
                          setDetail(data.item);
                          toast.success("Saved", { id: toastId });
                          loadList();
                        } catch (e: any) {
                          toast.error("Couldn’t save", { id: toastId, description: e?.message ?? "" });
                        } finally {
                          setSaving(false);
                        }
                      }}
                    >
                      Save changes
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" size="sm" variant="destructive" disabled={!token || deleting}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently deletes the record <strong>{detail.serial}</strong>. This can’t be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              if (!detail?.serial) return;
                              setDeleting(true);
                              const toastId = toast.loading("Deleting…");
                              try {
                                const res = await fetch(`/api/admin/submission?serial=${encodeURIComponent(detail.serial)}`, {
                                  method: "DELETE",
                                  headers,
                                });
                                const data = await res.json();
                                if (!res.ok || !data.ok) throw new Error(data?.error ?? "Failed");
                                toast.success("Deleted", { id: toastId });
                                setDetail(null);
                                setSelectedSerial("");
                                await loadList();
                              } catch (e: any) {
                                toast.error("Couldn’t delete", { id: toastId, description: e?.message ?? "" });
                              } finally {
                                setDeleting(false);
                              }
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>{t("admin.fields.name")}</Label>
                    <Input value={detail.name ?? ""} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("admin.fields.company")}</Label>
                    <Input value={editCompany} onChange={(e) => setEditCompany(e.target.value)} />
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
                    <Input value={editRequestType} onChange={(e) => setEditRequestType(e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>{t("admin.fields.notes")}</Label>
                  <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="min-h-24" />
                </div>

                <div className="grid gap-2">
                  <Label>{t("admin.fields.pricing")}</Label>
                  <Textarea value={editPricing} onChange={(e) => setEditPricing(e.target.value)} className="min-h-52 font-mono text-xs" />
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
