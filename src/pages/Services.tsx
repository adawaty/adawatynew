/*
Cairo Circuit Futurism — Services (5 pillars)
- Present the blended offering as an elite, end-to-end system
- Keep scannable: pillar grouping + concrete deliverables
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import type { ElementType } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { getServices } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import {
  ArrowRight,
  Radar,
  Shapes,
  MonitorSmartphone,
  PenLine,
  Search,
  Layers,
  CalendarCheck,
} from "lucide-react";

const pillarOrder = [
  "Brand Intelligence",
  "Brand System",
  "DFY Website",
  "Content Engine",
  "AI Visibility",
  "Concierge",
] as const;

const pillarMeta: Record<
  (typeof pillarOrder)[number],
  { icon: ElementType; eyebrow: string; note: string }
> = {
  "Brand Intelligence": {
    icon: Radar,
    eyebrow: "Clarity",
    note: "Positioning and offer architecture so your message lands immediately.",
  },
  "Brand System": {
    icon: Shapes,
    eyebrow: "Identity",
    note: "A maintainable system: templates + rules, not just a logo.",
  },
  "DFY Website": {
    icon: MonitorSmartphone,
    eyebrow: "Build",
    note: "Premium UI, performance, and conversion instrumentation.",
  },
  "Content Engine": {
    icon: PenLine,
    eyebrow: "Output",
    note: "On-brand content workflows powered by AI with human review.",
  },
  "AI Visibility": {
    icon: Search,
    eyebrow: "Discover",
    note: "SEO + AEO + LLMSEO so you show up in search and AI answers.",
  },
  Concierge: {
    icon: Layers,
    eyebrow: "Ongoing",
    note: "VIP iteration after launch: updates, experiments, governance.",
  },
};

export default function Services() {
  const { lang } = useI18n();
  const services = getServices(lang);
  const grouped = pillarOrder
    .map((pillar) => ({
      pillar,
      items: services.filter((s) => s.pillar === pillar),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <SiteLayout
      title="Services"
      subtitle="An elite DFY system: Brand → Build → Demand. Shipped in sprints, documented for ownership, and upgraded with AI workflows + visibility."
    >
      <SeoHead
        title={`Services | ${site.name}`}
        description="Done-for-you branding, websites, content workflows, and AI visibility (SEO/AEO/LLMSEO). Explore the 5 pillars and the AI Visibility Audit."
        path="/services"
        type="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Adawaty Services",
          url: new URL("/services", site.url).toString(),
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
        }}
      />
      {/* Pillars */}
      <section className="pt-10">
        <div className="grid gap-4">
          {grouped.map((g) => {
            const meta = pillarMeta[g.pillar];
            const Icon = meta.icon;

            return (
              <Card key={g.pillar} className="glass premium-card rounded-2xl p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      <div className="text-xs tracking-widest uppercase text-muted-foreground">
                        {meta.eyebrow}
                      </div>
                    </div>
                    <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-balance">
                      {g.pillar}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
                      {meta.note}
                    </p>
                  </div>

                  <Badge className="w-fit bg-white/6 border border-white/10 text-foreground">
                    Deliverables
                  </Badge>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {g.items.map((s) => (
                    <Card key={s.id} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-lg font-semibold">
                          <Link href={`/services/${s.id}`} className="hover:text-primary transition-colors">
                            {s.title}
                          </Link>
                        </div>
                        <span className="text-[11px] rounded-full bg-white/6 border border-white/10 px-2 py-1 text-muted-foreground">
                          {s.pillar}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                      <div className="mt-3">
                        <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                          <Link href={`/services/${s.id}`}>
                            View details <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>

                      <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* AI Visibility Audit */}
      <section className="mt-12">
        <Card className="glass premium-card rounded-2xl p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" aria-hidden="true" />
                <div className="text-xs tracking-widest uppercase text-muted-foreground">LLM answers</div>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-balance">AI Visibility Audit</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
                A structured audit to help your brand outrank competitors in AI assistants by strengthening entity clarity, page semantics,
                and “answer-worthiness”—so models select your brand more often.
              </p>
            </div>
            <Badge className="w-fit bg-accent/20 text-accent border border-accent/40">Audit outputs</Badge>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[{
              t: "Competitive answer map",
              d: "We identify the queries where competitors get cited in LLM answers (and why), then map gaps you can own.",
            },
            {
              t: "Entity + narrative clarity",
              d: "We tune your positioning, entity signals, and internal linking so assistants understand who you are, who you serve, and what you do.",
            },
            {
              t: "AEO + page upgrades",
              d: "We rewrite priority pages for direct answers (FAQs, comparisons, definitions), improve structure, and add proof signals that models trust.",
            }].map((x) => (
              <Card key={x.t} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <div className="text-lg font-semibold">{x.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <Card className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <div className="text-sm font-medium">What you get</div>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {[
                  "Query set + competitor benchmark (what the models say today)",
                  "Priority pages list + exact recommendations",
                  "LLM-ready content briefs (FAQs, comparisons, definitions)",
                  "Measurement plan: rankings, citations/mentions, and conversion signals",
                ].map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <div className="text-sm font-medium">How you outrank</div>
              <p className="mt-2 text-sm text-muted-foreground">
                LLMs reward clarity  + evidence  + coverage. We make your pages easier to cite than competitors: cleaner structure, stronger entity signals,
                and direct answers tied to proof.
              </p>
              <div className="mt-4">
                <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                  <Link href="/ai-visibility-audit">View audit details</Link>
                </Button>
              </div>
            </Card>
          </div>
        </Card>
      </section>

      {/* How it works */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">How we ship</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Elite outcomes come from tight loops. We work in sprints with visible progress and a clean handover.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[{
            t: "Audit + scope",
            d: "We map your current narrative, presence, and demand channels. Then we propose a sprint plan with deliverables.",
            i: Radar,
          },
          {
            t: "Sprints",
            d: "Each sprint has fixed outputs, weekly check-ins, and clear approvals. You see progress constantly—no black boxes.",
            i: CalendarCheck,
          },
          {
            t: "Handover + governance",
            d: "Templates, documentation, and AI workflow guardrails so the system stays consistent as you scale.",
            i: Layers,
          }].map((x) => (
            <Card key={x.t} className="glass premium-card rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <x.i className="h-5 w-5 text-accent" aria-hidden="true" />
                <div className="text-lg font-semibold">{x.t}</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 pb-6">
        <Card className="glass premium-card rounded-2xl p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-semibold">Recommended starting point</div>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Book a discovery call. We’ll audit your brand and presence, then propose the fastest DFY path to Brand → Build → Demand.
              </p>
            </div>
            <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
              <Link href="/contact">
                Book a call <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}
