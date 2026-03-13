/*
Cairo Circuit Futurism — Pricing Calculator (Outcome-first)
- Categorized: Website, Personal Bio, Hosting
- Shows One-time + Monthly totals
- Includes guided path for Internal tools / LMS / Video / Custom solutions

Pricing notes:
- Hosting is positioned as a managed reliability layer (starting $19/mo → $49/mo depending on project).
- Numbers are *starting points*; final scope is confirmed after intake.
*/

import { useMemo, useState } from "react";
import { insertLead } from "@/lib/supabaseService";
import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { site } from "@/lib/content";
import { toast } from "sonner";
import PricingOnboardingTooltip from "@/components/PricingOnboardingTooltip";

import { useI18n } from "@/contexts/I18nContext";
import {
  ArrowRight,
  Calculator,
  Info,
  Laptop,
  Link2,
  Server,
  Settings,
  Video,
  GraduationCap,
  Copy,
  FileDown,
  ExternalLink,
} from "lucide-react";

type Currency = "USD" | "EGP";

const usdToEgp = 50; // display-only approximation

function money(amountUsd: number, currency: Currency) {
  const value = currency === "USD" ? amountUsd : amountUsd * usdToEgp;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

type WebsiteType = "one-page" | "multi-page" | "ecommerce";

type HostingTier = "starter" | "standard" | "pro" | "business";

const hostingTiers: Record<
  HostingTier,
  { labelKey: string; usdPerMonth: number; noteKey: string }
> = {
  starter: {
    labelKey: "pricing.hostingTier.starter",
    usdPerMonth: 19,
    noteKey: "pricing.hostingTier.starter.note",
  },
  standard: {
    labelKey: "pricing.hostingTier.standard",
    usdPerMonth: 29,
    noteKey: "pricing.hostingTier.standard.note",
  },
  pro: {
    labelKey: "pricing.hostingTier.pro",
    usdPerMonth: 39,
    noteKey: "pricing.hostingTier.pro.note",
  },
  business: {
    labelKey: "pricing.hostingTier.business",
    usdPerMonth: 49,
    noteKey: "pricing.hostingTier.business.note",
  },
};

const websiteBase: Record<
  WebsiteType,
  { labelKey: string; usdOneTime: number; noteKey: string }
> = {
  "one-page": {
    labelKey: "pricing.websiteType.onePage",
    usdOneTime: 750,
    noteKey: "pricing.websiteType.onePage.note",
  },
  "multi-page": {
    labelKey: "pricing.websiteType.multiPage",
    usdOneTime: 1800,
    noteKey: "pricing.websiteType.multiPage.note",
  },
  ecommerce: {
    labelKey: "pricing.websiteType.ecommerce",
    usdOneTime: 2800,
    noteKey: "pricing.websiteType.ecommerce.note",
  },
};

type BioType = "classic" | "pro";

const bioBase: Record<BioType, { labelKey: string; usdOneTime: number; noteKey: string }> = {
  classic: {
    labelKey: "pricing.bioType.classic",
    usdOneTime: 299,
    noteKey: "pricing.bioType.classic.note",
  },
  pro: {
    labelKey: "pricing.bioType.pro",
    usdOneTime: 499,
    noteKey: "pricing.bioType.pro.note",
  },
};

const addOns: Record<
  string,
  { labelKey: string; usdOneTime?: number; usdPerMonth?: number; noteKey: string }
> = {
  copy: {
    labelKey: "pricing.addOn.copy",
    usdOneTime: 250,
    noteKey: "pricing.addOn.copy.note",
  },
  booking: {
    labelKey: "pricing.addOn.booking",
    usdOneTime: 150,
    noteKey: "pricing.addOn.booking.note",
  },
  seo: {
    labelKey: "pricing.addOn.seo",
    usdOneTime: 350,
    noteKey: "pricing.addOn.seo.note",
  },
  branding5: {
    labelKey: "pricing.addOn.branding5",
    usdOneTime: 600,
    noteKey: "pricing.addOn.branding5.note",
  },
  dfirst: {
    labelKey: "pricing.addOn.dfirst",
    usdPerMonth: 299,
    noteKey: "pricing.addOn.dfirst.note",
  },
  analytics: {
    labelKey: "pricing.addOn.analytics",
    usdOneTime: 200,
    noteKey: "pricing.addOn.analytics.note",
  },
  care: {
    labelKey: "pricing.addOn.care",
    usdPerMonth: 49,
    noteKey: "pricing.addOn.care.note",
  },
};

type CustomNeed = "internal-tool" | "lms" | "video" | "custom";

const customNeedCopy: Record<
  CustomNeed,
  { labelKey: string; icon: React.ReactNode; estimateKey: string; noteKey: string }
> = {
  "internal-tool": {
    labelKey: "pricing.customNeed.internalTool",
    icon: <Settings className="h-4 w-4" />,
    estimateKey: "pricing.customNeed.internalTool.estimate",
    noteKey: "pricing.customNeed.internalTool.note",
  },
  lms: {
    labelKey: "pricing.customNeed.lms",
    icon: <GraduationCap className="h-4 w-4" />,
    estimateKey: "pricing.customNeed.lms.estimate",
    noteKey: "pricing.customNeed.lms.note",
  },
  video: {
    labelKey: "pricing.customNeed.video",
    icon: <Video className="h-4 w-4" />,
    estimateKey: "pricing.customNeed.video.estimate",
    noteKey: "pricing.customNeed.video.note",
  },
  custom: {
    labelKey: "pricing.customNeed.custom",
    icon: <Laptop className="h-4 w-4" />,
    estimateKey: "pricing.customNeed.custom.estimate",
    noteKey: "pricing.customNeed.custom.note",
  },
};

export default function PricingCalculator() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const { lang, t } = useI18n();

  // Web presence
  const [websiteType, setWebsiteType] = useState<WebsiteType>("multi-page");
  const [bioType, setBioType] = useState<BioType>("classic");
  const [hostingTier, setHostingTier] = useState<HostingTier>("pro");

  const [includeWebsite, setIncludeWebsite] = useState(true);
  const [includeBio, setIncludeBio] = useState(false);

  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
    copy: true,
    booking: true,
    seo: true,
    analytics: true,
    branding5: false,
    dfirst: false,
    care: false,
  });

  // Custom request wizard
  const [customNeed, setCustomNeed] = useState<CustomNeed>("internal-tool");
  const [customBudget, setCustomBudget] = useState<string>("");
  const [customTimeline, setCustomTimeline] = useState<string>("");
  const [customNotes, setCustomNotes] = useState<string>("");

  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [lastSerial, setLastSerial] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const bioPreviewUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("name", (contactName || "Your Name").trim());
    params.set("headline", includeBio ? (bioType === "pro" ? "Premium bio hub" : "Bio page") : "Bio page");
    if (contactPhone.trim()) params.set("phone", contactPhone.trim());
    if (contactEmail.trim()) params.set("email", contactEmail.trim());
    params.set("city", "Cairo");
    params.set("cta", "Request scope");
    params.set("href", "/contact");
    return `/bio?${params.toString()}`;
  }, [contactName, contactPhone, contactEmail, includeBio, bioType]);

  function buildQuoteText(serial?: string) {
    const addons = Object.entries(selectedAddons)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const lines = [
      `Adawaty — Quote${serial ? ` (${serial})` : ""}`,
      `Date: ${new Date().toLocaleString()}`,
      "",
      `Name: ${contactName.trim() || "—"}`,
      `Email: ${contactEmail.trim() || "—"}`,
      `Phone: ${contactPhone.trim() || "—"}`,
      "",
      `Website: ${includeWebsite ? websiteType : "No"}`,
      `Bio page: ${includeBio ? bioType : "No"}`,
      `Hosting: ${hostingTier} (${money(hostingTiers[hostingTier].usdPerMonth, currency)}/mo)`,
      `Add-ons: ${addons.length ? addons.join(", ") : "None"}`,
      "",
      `One-time total: ${money(totals.oneTime, currency)}`,
      `Monthly total: ${money(totals.monthly, currency)}/mo`,
      "",
      includeBio ? `Bio page preview: ${window.location.origin}${bioPreviewUrl}` : "",
    ].filter(Boolean);

    return lines.join("\n");
  }

  function openQuotePdf(serial?: string) {
    const addons = Object.entries(selectedAddons)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const safe = (s: string) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Adawaty Quote${serial ? " — " + safe(serial) : ""}</title>
  <style>
    @page { size: A4; margin: 18mm; }
    * { box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; color: #0b1220; }
    .top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
    .brand { font-weight: 800; font-size: 20px; letter-spacing: -0.02em; }
    .tag { color:#0a7a87; font-weight: 700; }
    .pill { display:inline-block; padding:6px 10px; border:1px solid #d7e2ea; border-radius:999px; font-size: 12px; }
    h1 { font-size: 28px; margin: 14px 0 8px; }
    .muted { color:#506171; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:14px; }
    .card { border:1px solid #d7e2ea; border-radius:14px; padding:12px 14px; }
    .card h3 { margin:0 0 6px; font-size: 13px; letter-spacing:0.02em; text-transform: uppercase; color:#213041; }
    .row { display:flex; justify-content:space-between; gap:12px; padding:8px 0; border-bottom:1px dashed #d7e2ea; }
    .row:last-child { border-bottom:0; }
    .k { color:#213041; }
    .v { font-weight:700; }
    .total { font-size: 18px; }
    .foot { margin-top: 14px; font-size: 12px; color:#506171; }
    a { color:#0a7a87; text-decoration: none; }
    .break { height: 10px; }
  </style>
</head>
<body>
  <div class="top">
    <div>
      <div class="brand">Adawaty</div>
      <div class="tag">Brand → Build → Demand</div>
      <div class="break"></div>
      <span class="pill">Estimate • Not a final contract</span>
      ${serial ? `<span class="pill" style="margin-left:8px;">Serial: ${safe(serial)}</span>` : ""}
    </div>
    <div class="muted" style="text-align:right; font-size:12px;">
      <div>${safe(new Date().toLocaleString())}</div>
      <div>alazzeh.ml@gmail.com</div>
    </div>
  </div>

  <h1>Pricing estimate</h1>
  <div class="muted">Built from your selections. We’ll confirm scope in a quick intake call.</div>

  <div class="grid">
    <div class="card">
      <h3>Contact</h3>
      <div class="row"><div class="k">Name</div><div class="v">${safe(contactName.trim() || "—")}</div></div>
      <div class="row"><div class="k">Email</div><div class="v">${safe(contactEmail.trim() || "—")}</div></div>
      <div class="row"><div class="k">Phone</div><div class="v">${safe(contactPhone.trim() || "—")}</div></div>
    </div>
    <div class="card">
      <h3>Scope</h3>
      <div class="row"><div class="k">Website</div><div class="v">${safe(includeWebsite ? websiteType : "No")}</div></div>
      <div class="row"><div class="k">Bio page</div><div class="v">${safe(includeBio ? bioType : "No")}</div></div>
      <div class="row"><div class="k">Hosting</div><div class="v">${safe(hostingTier)} (${safe(money(hostingTiers[hostingTier].usdPerMonth, currency))}/mo)</div></div>
      <div class="row"><div class="k">Add-ons</div><div class="v">${safe(addons.length ? addons.join(", ") : "None")}</div></div>
    </div>
  </div>

  <div class="grid" style="margin-top:12px;">
    <div class="card">
      <h3>One-time</h3>
      <div class="row"><div class="k">Build (website + bio)</div><div class="v">${safe(money(totals.website + totals.bio, currency))}</div></div>
      <div class="row"><div class="k">Add-ons</div><div class="v">${safe(money(totals.addOnOneTime, currency))}</div></div>
      <div class="row total"><div class="k">Total</div><div class="v">${safe(money(totals.oneTime, currency))}</div></div>
    </div>
    <div class="card">
      <h3>Monthly</h3>
      <div class="row"><div class="k">Hosting</div><div class="v">${safe(money(totals.hosting, currency))}/mo</div></div>
      <div class="row"><div class="k">Care / retainers</div><div class="v">${safe(money(totals.addOnMonthly, currency))}/mo</div></div>
      <div class="row total"><div class="k">Total</div><div class="v">${safe(money(totals.monthly, currency))}/mo</div></div>
    </div>
  </div>

  ${includeBio ? `
  <div class="foot">
    Bio page preview link: <a href="${safe(bioPreviewUrl)}">${safe(bioPreviewUrl)}</a>
  </div>
  ` : ""}

  <div class="foot">
    Notes: Pricing is a starting estimate. Final scope, timeline, and deliverables are confirmed after intake.
  </div>

  <script>
    window.onload = () => {
      setTimeout(() => window.print(), 250);
    };
  </script>
</body>
</html>`;

    const w = window.open("", "_blank");
    if (!w) throw new Error("Popup blocked. Please allow popups to export PDF.");
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  const totals = useMemo(() => {
    const website = includeWebsite ? websiteBase[websiteType].usdOneTime : 0;
    const bio = includeBio ? bioBase[bioType].usdOneTime : 0;
    const hosting = hostingTiers[hostingTier].usdPerMonth;

    const addOnOneTime = Object.entries(selectedAddons)
      .filter(([, v]) => v)
      .reduce((sum, [k]) => sum + (addOns[k]?.usdOneTime ?? 0), 0);

    const addOnMonthly = Object.entries(selectedAddons)
      .filter(([, v]) => v)
      .reduce((sum, [k]) => sum + (addOns[k]?.usdPerMonth ?? 0), 0);

    return {
      oneTime: website + bio + addOnOneTime,
      monthly: hosting + addOnMonthly,
      hosting,
      addOnOneTime,
      addOnMonthly,
      website,
      bio,
    };
  }, [includeWebsite, websiteType, includeBio, bioType, hostingTier, selectedAddons]);

  const title = `Pricing Calculator | ${site.name}`;
  const description =
    "Get a quick estimate for a website, personal bio page, and managed hosting — plus a guided path for internal tools, LMS, video, and custom builds.";


  return (
    <SiteLayout title={t("pricing.title")} subtitle={t("pricing.subtitle")}>
      <SeoHead title={title} description={description} path="/pricing-calculator" type="website" />

      <section className="pt-10">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Card className="glass premium-card rounded-2xl p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
                <div className="text-lg font-semibold">{t("pricing.buildYourQuote")}</div>
              </div>
              <div className="flex items-center gap-2">
                <PricingOnboardingTooltip />
                <Badge className="bg-white/6 border border-white/10 text-foreground">{t("pricing.badge.estimate")}</Badge>
              </div>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="web" className="w-full">
                <TabsList className="w-full justify-start bg-white/3 border border-white/10">
                  <TabsTrigger value="web" className="data-[state=active]:bg-white/6">
                    {t("pricing.tab.web")}
                  </TabsTrigger>
                  <TabsTrigger value="systems" className="data-[state=active]:bg-white/6">
                    {t("pricing.tab.systems")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="web" className="mt-6">
                  <div className="grid gap-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/3 p-4">
                        <Checkbox
                          id="include-website"
                          checked={includeWebsite}
                          onCheckedChange={(v) => setIncludeWebsite(Boolean(v))}
                        />
                        <div className="min-w-0">
                          <Label htmlFor="include-website" className="text-sm font-semibold">
                            {t("pricing.web.website")}
                          </Label>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t("pricing.web.websiteDesc")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/3 p-4">
                        <Checkbox
                          id="include-bio"
                          checked={includeBio}
                          onCheckedChange={(v) => setIncludeBio(Boolean(v))}
                        />
                        <div className="min-w-0">
                          <Label htmlFor="include-bio" className="text-sm font-semibold">
                            {t("pricing.web.bio")}
                          </Label>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t("pricing.web.bioDesc")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>{t("pricing.web.websiteType")}</Label>
                        <Select
                          value={websiteType}
                          onValueChange={(v) => setWebsiteType(v as WebsiteType)}
                          disabled={!includeWebsite}
                        >
                          <SelectTrigger className="bg-white/3 border-white/10">
                            <SelectValue placeholder={t("pricing.web.websiteType.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(websiteBase).map(([k, v]) => (
                              <SelectItem key={k} value={k}>
                                {t(v.labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {t(websiteBase[websiteType].noteKey)}
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label>{t("pricing.web.bioType")}</Label>
                        <Select
                          value={bioType}
                          onValueChange={(v) => setBioType(v as BioType)}
                          disabled={!includeBio}
                        >
                          <SelectTrigger className="bg-white/3 border-white/10">
                            <SelectValue placeholder={t("pricing.web.bioType.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(bioBase).map(([k, v]) => (
                              <SelectItem key={k} value={k}>
                                {t(v.labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">{t(bioBase[bioType].noteKey)}</p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>{t("pricing.web.hostingTier")}</Label>
                      <Select value={hostingTier} onValueChange={(v) => setHostingTier(v as HostingTier)}>
                        <SelectTrigger className="bg-white/3 border-white/10">
                          <SelectValue placeholder={t("pricing.web.hostingTier.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(hostingTiers).map(([k, v]) => (
                            <SelectItem key={k} value={k}>
                              {t(v.labelKey)} — {money(v.usdPerMonth, "USD")}/mo
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Server className="h-3.5 w-3.5" aria-hidden="true" />
                          {t(hostingTiers[hostingTier].noteKey)}
                        </span>
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-medium">{t("pricing.web.addOns")}</div>
                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        {Object.entries(addOns).map(([k, a]) => {
                          const checked = selectedAddons[k] ?? false;
                          return (
                            <div
                              key={k}
                              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/3 p-4"
                            >
                              <Checkbox
                                id={`addon-${k}`}
                                checked={checked}
                                onCheckedChange={(v) =>
                                  setSelectedAddons((prev) => ({
                                    ...prev,
                                    [k]: Boolean(v),
                                  }))
                                }
                              />
                              <div className="min-w-0">
                                <Label htmlFor={`addon-${k}`} className="text-sm font-semibold">
                                  {t(a.labelKey)}
                                  {a.usdOneTime ? (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      ({money(a.usdOneTime, currency)})
                                    </span>
                                  ) : null}
                                  {a.usdPerMonth ? (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      ({money(a.usdPerMonth, currency)}/mo)
                                    </span>
                                  ) : null}
                                </Label>
                                <p className="mt-1 text-xs text-muted-foreground">{t(a.noteKey)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Info className="mt-0.5 h-3.5 w-3.5" aria-hidden="true" />
                        <div>
                          {t("pricing.web.hostingSeparated")}
                          {t("pricing.web.bringYourOwn")}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="systems" className="mt-6">
                  <div className="grid gap-5">
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Settings className="h-4 w-4 text-primary" aria-hidden="true" />
                        {t("pricing.systems.guidedTitle")}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t("pricing.systems.guidedDesc")}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>{t("pricing.systems.need")}</Label>
                        <Select value={customNeed} onValueChange={(v) => setCustomNeed(v as CustomNeed)}>
                          <SelectTrigger className="bg-white/3 border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal-tool">Internal tool</SelectItem>
                            <SelectItem value="lms">LMS / learning portal</SelectItem>
                            <SelectItem value="video">Video / media system</SelectItem>
                            <SelectItem value="custom">Custom solution</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>{t("pricing.systems.timeline")}</Label>
                        <Select value={customTimeline} onValueChange={setCustomTimeline}>
                          <SelectTrigger className="bg-white/3 border-white/10">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2-4 weeks">2–4 weeks</SelectItem>
                            <SelectItem value="4-8 weeks">4–8 weeks</SelectItem>
                            <SelectItem value="8-12 weeks">8–12 weeks</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>{t("pricing.systems.budget")}</Label>
                      <Input
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        placeholder={t("pricing.systems.budget.placeholder")}
                        className="bg-white/3 border-white/10"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>{t("pricing.systems.requirements")}</Label>
                      <Textarea
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        placeholder={t("pricing.systems.requirements.placeholder")}
                        className="min-h-28 bg-white/3 border-white/10"
                      />
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {customNeedCopy[customNeed].icon}
                        {t(customNeedCopy[customNeed].labelKey)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t(customNeedCopy[customNeed].noteKey)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Info className="h-3.5 w-3.5" aria-hidden="true" />
                          {t(customNeedCopy[customNeed].estimateKey)}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>{t("form.name")}</Label>
                          <Input
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder={t("form.name.placeholder")}
                            className="bg-white/3 border-white/10"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>{t("form.email")}</Label>
                          <Input
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder={t("form.email.placeholder")}
                            type="email"
                            className="bg-white/3 border-white/10"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>{t("form.phone")}</Label>
                        <Input
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder={t("form.phone.placeholder")}
                          className="bg-white/3 border-white/10"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          size="lg"
                          className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]"
                          onClick={async () => {
                            if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
                              toast.error(t("form.required"));
                              return;
                            }
                            // Submit to Supabase
                            await insertLead({
                              source: "pricing",
                              name: contactName.trim(),
                              email: contactEmail.trim(),
                              phone: contactPhone.trim(),
                              request_type: customNeed || "custom-solution",
                              notes: [
                                customNotes,
                                customBudget && `Budget: ${customBudget}`,
                                customTimeline && `Timeline: ${customTimeline}`,
                              ].filter(Boolean).join("\n"),
                            });
                            toast.success(t("pricing.systems.submitted"), {
                              description: t("pricing.systems.submittedDesc"),
                            });
                            setContactName("");
                            setContactEmail("");
                            setContactPhone("");
                            setCustomBudget("");
                            setCustomTimeline("");
                            setCustomNotes("");
                          }}
                        >
                          {t("pricing.systems.submit")} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                          <Link href="/contact">{t("pricing.systems.openFullIntake")}</Link>
                        </Button>
                        <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                          <a
                            href={`mailto:alazzeh.ml@gmail.com?subject=${encodeURIComponent(
                              `Adawaty request: ${customNeed}`
                            )}&body=${encodeURIComponent(
                              `Need: ${customNeed}\nTimeline: ${customTimeline || ""}\nBudget: ${customBudget || ""}\n\nNotes:\n${customNotes || ""}`
                            )}`}
                          >
                            {t("pricing.systems.emailRequest")}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          <Card className="glass premium-card rounded-2xl p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold">{t("pricing.estimate.title")}</div>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger className="w-28 bg-white/3 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EGP">EGP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <div className="text-xs text-muted-foreground">{t("pricing.estimate.oneTime")}</div>
                <div className="mt-2 text-3xl sm:text-4xl font-semibold">
                  {money(totals.oneTime, currency)}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {t("pricing.estimate.oneTimeDesc")}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <div className="text-xs text-muted-foreground">{t("pricing.estimate.monthly")}</div>
                <div className="mt-2 text-3xl sm:text-4xl font-semibold">
                  {money(totals.monthly, currency)}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">{t("pricing.perMonth")}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {t("pricing.estimate.monthlyDescPrefix")} ({money(totals.hosting, currency)}{t("pricing.perMonth")}){totals.addOnMonthly ? ` ${t("pricing.estimate.plusAddons")}` : ""}.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5" aria-hidden="true" />
                  <div>
                    {t("pricing.estimate.disclaimer")}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="text-sm font-medium">{t("pricing.exportSection.title")}</div>
                <div className="text-xs text-muted-foreground">{t("pricing.exportSection.desc")}</div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>{t("form.name")}</Label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={t("form.name.placeholder")}
                      className="bg-white/3 border-white/10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("form.email")}</Label>
                    <Input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder={t("form.email.placeholder")}
                      type="email"
                      className="bg-white/3 border-white/10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("form.phone")}</Label>
                    <Input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder={t("form.phone.placeholder")}
                      className="bg-white/3 border-white/10"
                    />
                  </div>
                </div>

                {lastSerial ? (
                  <div className="text-xs text-muted-foreground">
                    {t("pricing.serial")}: <span className="text-foreground font-medium">{lastSerial}</span>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3">
                <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
                  <Link href="/contact">
                    {t("pricing.estimate.getFixedQuote")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                  <Link href="/solutions">{t("pricing.estimate.seeDeliverables")}</Link>
                </Button>

                {includeBio ? (
                  <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                    <Link href={bioPreviewUrl}>
                      <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" /> Preview bio page
                    </Link>
                  </Button>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-white/6 hover:bg-white/10"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(buildQuoteText(lastSerial ?? undefined));
                        toast.success("Copied", { description: "Quote copied to clipboard" });
                      } catch {
                        toast.error("Copy failed", { description: "Your browser blocked clipboard access." });
                      }
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" aria-hidden="true" /> Copy quote
                  </Button>

                  <Button
                    type="button"
                    className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]"
                    disabled={exporting}
                    onClick={async () => {
                      if (!contactName.trim() || !contactPhone.trim()) {
                        toast.error(t("form.required"));
                        return;
                      }
                      setExporting(true);
                      const loading = toast.loading("Preparing PDF…", { duration: 15000 });
                      try {
                        // Submit to Supabase + generate serial
                        const serial = `ADW-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
                        setLastSerial(serial);
                        // Fire-and-forget Supabase insert
                        insertLead({
                          source: "pricing",
                          name: contactName.trim(),
                          phone: contactPhone.trim(),
                          request_type: "quote-export",
                          pricing: {
                            serial,
                            oneTime: totals.oneTime,
                            monthly: totals.monthly,
                            currency,
                          },
                          notes: buildQuoteText(serial),
                        }).catch(() => {/* silent */});
                        openQuotePdf(serial);
                        toast.success("PDF ready", {
                          id: loading,
                          description: `${t("pricing.serial")}: ${serial}`,
                        });
                      } catch (err: any) {
                        toast.error(t("form.submitError"), {
                          id: loading,
                          description: err?.message ?? t("form.tryAgain"),
                        });
                      } finally {
                        setExporting(false);
                      }
                    }}
                  >
                    <FileDown className="mr-2 h-4 w-4" aria-hidden="true" /> Export PDF
                  </Button>
                </div>
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                <strong className="text-foreground">{t("pricing.hostingNote.title")}</strong> {t("pricing.hostingNote.body")}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium">{t("pricing.estimate.breakdown")}</div>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Link2 className="h-4 w-4" aria-hidden="true" /> {t("pricing.breakdown.build")}
                  </span>
                  <span className="text-foreground">{money(totals.website + totals.bio, currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" /> {t("pricing.breakdown.addonsOneTime")}
                  </span>
                  <span className="text-foreground">{money(totals.addOnOneTime, currency)}</span>
                </div>
                <div className="mt-2 circuit-divider" />
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-foreground">{t("pricing.breakdown.oneTimeTotal")}</span>
                  <span className="text-foreground">{money(totals.oneTime, currency)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Server className="h-4 w-4" aria-hidden="true" /> {t("pricing.breakdown.hostingMonthly")}
                  </span>
                  <span className="text-foreground">{money(totals.hosting, currency)}/mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" /> {t("pricing.breakdown.addonsMonthly")}
                  </span>
                  <span className="text-foreground">{money(totals.addOnMonthly, currency)}/mo</span>
                </div>
                <div className="mt-2 circuit-divider" />
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-foreground">{t("pricing.breakdown.monthlyTotal")}</span>
                  <span className="text-foreground">{money(totals.monthly, currency)}/mo</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-12 pb-6">
        <Card className="glass premium-card rounded-2xl p-7">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Server className="h-5 w-5 text-primary" aria-hidden="true" />
            {t("pricing.hosting.whyTitle")}
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            {t("pricing.hosting.whyDesc")}
          </p>
        </Card>
      </section>
    </SiteLayout>
  );
}
