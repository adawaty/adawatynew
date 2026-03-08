/*
Cairo Circuit Futurism — Industry detail (programmatic SEO)
- One page per industry with pains/outcomes and recommended pillars
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { site } from "@/lib/content";
import { getIndustries, getServices } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import NotFound from "@/pages/NotFound";
import { ArrowRight, Target, TrendingUp } from "lucide-react";

export default function IndustryDetail({ id }: { id: string }) {
  const { lang } = useI18n();
  const industries = getIndustries(lang);
  const services = getServices(lang);
  const industry = industries.find((x) => x.id === id);
  if (!industry) return <NotFound />;

  const recommended = industry.recommendedServices
    .map((sid) => services.find((s) => s.id === sid))
    .filter(Boolean) as typeof services;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: industry.seo.title,
    description: industry.seo.description,
    url: new URL(`/industries/${industry.id}`, site.url).toString(),
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  };

  return (
    <SiteLayout title={industry.title} subtitle={industry.summary}>
      <SeoHead
        title={industry.seo.title}
        description={industry.seo.description}
        path={`/industries/${industry.id}`}
        type="article"
        jsonLd={jsonLd}
      />

      <section className="pt-10">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="glass premium-card rounded-2xl p-7 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <Badge className="bg-white/6 border border-white/10 text-foreground">Sector</Badge>
              <span className="text-xs text-primary">Programmatic landing</span>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div className="text-lg font-semibold">Common pains</div>
                </div>
                <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  {industry.pains.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div className="text-lg font-semibold">Outcomes</div>
                </div>
                <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  {industry.outcomes.map((o) => (
                    <li key={o} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="mt-6 circuit-divider" />

            <div className="mt-6 text-lg font-semibold">Recommended pillars</div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {recommended.map((s) => (
                <Card key={s.id} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold">{s.title}</div>
                    <span className="text-[11px] rounded-full bg-white/6 border border-white/10 px-2 py-1 text-muted-foreground">
                      {s.pillar}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                  <div className="mt-4">
                    <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                      <Link href={`/services/${s.id}`}>
                        View deliverables <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="glass premium-card rounded-2xl p-7">
            <div className="text-sm font-medium">Best starting point</div>
            <p className="mt-2 text-sm text-muted-foreground">
              If you want to own Google + AI results in this sector, start with an AI Visibility Audit, then execute pillar upgrades.
            </p>
            <div className="mt-5 grid gap-2">
              <Button asChild>
                <Link href="/ai-visibility-audit">
                  View audit page <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                <Link href="/industries">Back to industries</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-12 pb-6">
        <Card className="glass premium-card rounded-2xl p-7">
          <div className="text-lg font-semibold">Ready to build demand in {industry.title}?</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Tell us your current stage and targets. We’ll propose a DFY scope and sprint plan aligned to the buyer intent in your sector.
          </p>
          <div className="mt-5">
            <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
              <Link href="/contact">Request scope</Link>
            </Button>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}
