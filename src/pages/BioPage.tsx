/*
Cairo Circuit Futurism — Bio Page (generated)
- Lightweight, shareable personal hub
- Supports query params for quick previews from Pricing Calculator
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/contexts/I18nContext";
import { Link2, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

function qp(url: string) {
  try {
    const u = new URL(url);
    return u.searchParams;
  } catch {
    // relative
    return new URL(url, "https://example.com").searchParams;
  }
}

export default function BioPage() {
  const { t } = useI18n();
  const params = qp(window.location.href);

  const name = (params.get("name") || "Your Name").trim();
  const headline = (params.get("headline") || "Brand → Build → Demand").trim();
  const city = (params.get("city") || "Cairo").trim();
  const phone = (params.get("phone") || "").trim();
  const email = (params.get("email") || "").trim();
  const primaryCta = (params.get("cta") || "Book a call").trim();
  const primaryHref = (params.get("href") || "/contact").trim();

  // simple link list (comma separated pairs): label|url,label|url
  const linksRaw = (params.get("links") || "Website|/ , WhatsApp|https://wa.me/").trim();
  const links = linksRaw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const [label, url] = x.split("|").map((p) => (p ?? "").trim());
      return { label: label || "Link", url: url || "/" };
    })
    .slice(0, 8);

  return (
    <SiteLayout>
      <SeoHead
        title={`${name} | Bio Page`}
        description={`Bio page for ${name}: ${headline}.`}
        path="/bio"
        type="website"
      />

      <section className="pt-10 pb-16">
        <div className="mx-auto max-w-2xl">
          <Card className="glass rounded-3xl p-7 sm:p-10 overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Badge className="bg-primary/20 text-primary border border-primary/40">Bio Page</Badge>
                <h1 className="mt-3 text-3xl sm:text-5xl font-semibold leading-[1.08] break-words">{name}</h1>
                <p className="mt-3 text-base sm:text-lg text-muted-foreground">{headline}</p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {city}
                  </span>
                  {phone ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1.5 hover:bg-white/6"
                      href={`tel:${phone}`}
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {phone}
                    </a>
                  ) : null}
                  {email ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1.5 hover:bg-white/6"
                      href={`mailto:${email}`}
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {email}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="hidden sm:block h-12 w-12 rounded-2xl bg-primary/15 ring-1 ring-primary/35 grid place-items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_22px_oklch(0.73_0.16_190/0.55)]" />
              </div>
            </div>

            <div className="mt-7 grid gap-3">
              {links.map((l) => (
                <a
                  key={`${l.label}-${l.url}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-3 hover:bg-white/6 premium-focus"
                  href={l.url}
                  target={l.url.startsWith("http") ? "_blank" : "_self"}
                  rel={l.url.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span className="inline-flex items-center gap-2 min-w-0">
                    <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-medium truncate">{l.label}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className="mt-7">
              <Button asChild size="lg" className="w-full shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
                <a href={primaryHref}>{primaryCta}</a>
              </Button>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                {t("cta.requestScope")} • {t("hero.badge")}
              </div>
            </div>
          </Card>

          <div className="mt-6 text-xs text-muted-foreground text-center">
            Tip: this is a preview template. We’ll customize copy, proof, offers, tracking, and booking.
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
