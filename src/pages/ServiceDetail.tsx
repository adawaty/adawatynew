/*
Cairo Circuit Futurism — Service detail (programmatic SEO)
- One page per service/pillar to target specific query clusters
- AIO/AEO friendly: definition, outcomes, FAQs, and structured data
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { services, site } from "@/lib/content";
import { ArrowRight, Sparkles, Search, ShieldCheck } from "lucide-react";
import NotFound from "@/pages/NotFound";

const faqByServiceId: Record<string, { q: string; a: string }[]> = {
  "ai-visibility": [
    {
      q: "What is LLM SEO (LLMSEO)?",
      a: "LLM SEO is optimizing your brand and pages so AI assistants can confidently cite and recommend you. It overlaps with SEO and AEO, but focuses on entity clarity, answer-worthiness, and brand mentions/citations across the web.",
    },
    {
      q: "How do you outrank competitors in AI answers?",
      a: "We improve: (1) entity clarity (who you are), (2) structured coverage (direct answers, FAQs, comparisons), and (3) proof signals (case studies, references, consistency). Then we track mentions and iterate.",
    },
    {
      q: "Does ranking #1 on Google guarantee AI citations?",
      a: "No. Strong rankings help, but AI assistants often cite sources based on clarity, relevance, and trust signals. We optimize for both classic rankings and AI citations.",
    },
  ],
  "brand-intelligence": [
    {
      q: "What do you mean by Brand Intelligence?",
      a: "A strategy sprint that clarifies positioning, audience, and offer structure. It turns your brand into a repeatable message that sales, content, and the website can all reuse.",
    },
    {
      q: "What’s the output of the sprint?",
      a: "A positioning doc, ICP segments, offer architecture, and a narrative map that guides your website and content engine.",
    },
  ],
  "dfy-website": [
    {
      q: "Can you build fast without sacrificing quality?",
      a: "Yes—because we use a tight design system, clear IA, and sprint delivery. We also instrument analytics so the site can be improved post-launch.",
    },
  ],
};

export default function ServiceDetail({ id }: { id: string }) {
  const service = services.find((s) => s.id === id);

  if (!service) return <NotFound />;

  const title = `${service.title} | ${site.name}`;
  const description = service.summary;

  const faqs = faqByServiceId[id] ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    areaServed: "Worldwide",
    serviceType: service.pillar,
    offers: {
      "@type": "Offer",
      url: new URL(`/contact`, site.url).toString(),
    },
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <SiteLayout
      title={service.title}
      subtitle={`${service.pillar} — DFY deliverables, built for clarity and AI-era discoverability.`}
    >
      <SeoHead
        title={title}
        description={description}
        path={`/services/${service.id}`}
        type="article"
        jsonLd={faqJsonLd ? [jsonLd, faqJsonLd] : jsonLd}
      />

      <section className="pt-10">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <Card className="glass rounded-2xl p-7">
            <div className="flex items-center justify-between gap-3">
              <Badge className="bg-white/6 border border-white/10 text-foreground">{service.pillar}</Badge>
              <span className="text-xs text-primary">DFY • sprint delivery</span>
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-balance">
              What you get (deliverables)
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-3xl">{service.summary}</p>

            <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
              {service.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
                <Link href="/contact">
                  Request scope <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/6 hover:bg-white/10">
                <Link href="/services">Back to services</Link>
              </Button>
            </div>
          </Card>

          <Card className="glass rounded-2xl p-7">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
              Why this matters in AI search
            </div>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Search className="h-4 w-4 text-primary" aria-hidden="true" />
                  Answer-worthiness
                </div>
                <p className="mt-1">
                  We structure content so assistants can lift direct answers (definitions, comparisons, FAQs), not vague marketing.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Trust signals
                </div>
                <p className="mt-1">
                  We connect claims to proof: measurable outcomes, clear scope, consistent entity signals, and clean semantics.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {faqs.length ? (
        <section className="mt-12">
          <Card className="glass rounded-2xl p-7">
            <div className="text-lg font-semibold">FAQ</div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {faqs.map((f) => (
                <Card key={f.q} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                  <div className="text-base font-semibold">{f.q}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </Card>
              ))}
            </div>
          </Card>
        </section>
      ) : null}

      <section className="mt-12 pb-6">
        <Card className="glass rounded-2xl p-7">
          <div className="text-lg font-semibold">Want this done-for-you?</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Book a call and we’ll propose the fastest DFY path from Brand → Build → Demand, including a measurement plan for SEO + AI visibility.
          </p>
          <div className="mt-5">
            <Button asChild>
              <Link href="/contact">Book a call</Link>
            </Button>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}
