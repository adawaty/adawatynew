/*
Cairo Circuit Futurism — AI Visibility Audit (programmatic SEO landing)
Keyword cluster target: AI visibility audit, LLM SEO audit, AEO audit, AI Overviews optimization.
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { site } from "@/lib/content";
import { ArrowRight, Search, ShieldCheck, Spline, BarChart3 } from "lucide-react";

export default function AiVisibilityAudit() {
  const title = `AI Visibility Audit | ${site.name}`;
  const description =
    "A structured audit to improve your brand’s presence in Google Search, AI Overviews, and AI assistants via entity clarity, AEO content, and competitor benchmarks.";

  const faq = [
    {
      q: "What is an AI Visibility Audit?",
      a: "An audit that evaluates how your brand appears in AI answers and search results today, why competitors get cited, and what to change on your site and across the web to earn more citations and visibility.",
    },
    {
      q: "How is this different from a normal SEO audit?",
      a: "Traditional SEO audits focus heavily on rankings and technical checks. This audit also focuses on answer-worthiness (AEO), entity clarity, and citation signals that influence AI Overviews and LLM answers.",
    },
    {
      q: "How do you measure improvement?",
      a: "We track a fixed query set, brand mentions/citations in AI answers, and classic SEO indicators (index coverage, impressions, rankings). We connect that to conversions so the work stays business-driven.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <SiteLayout
      title="AI Visibility Audit"
      subtitle="Outrank competitors in AI answers by improving entity clarity, answer-worthiness, and proof signals."
    >
      <SeoHead title={title} description={description} path="/ai-visibility-audit" type="article" jsonLd={faqJsonLd} />

      <section className="pt-10">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Card className="glass rounded-2xl p-7">
            <div className="flex items-center justify-between gap-3">
              <Badge className="bg-accent/20 text-accent border border-accent/40">AEO + LLMSEO</Badge>
              <span className="text-xs text-primary">Audit → plan → upgrades</span>
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-balance">What we audit</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-3xl">{description}</p>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {[{
                t: "Competitive answer map",
                d: "Which competitors show up for your money queries—and which sources the models cite.",
                i: Search,
              },
              {
                t: "Entity clarity",
                d: "Who you are, what you do, and why you’re the best answer—expressed consistently across pages.",
                i: Spline,
              },
              {
                t: "Proof + structure",
                d: "Content structure that’s easy to cite + evidence signals (case studies, benchmarks, consistency).",
                i: ShieldCheck,
              }].map((x) => (
                <Card key={x.t} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                  <div className="flex items-center gap-2">
                    <x.i className="h-5 w-5 text-primary" aria-hidden="true" />
                    <div className="text-base font-semibold">{x.t}</div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
                </Card>
              ))}
            </div>

            <div className="mt-6 circuit-divider" />

            <h3 className="mt-6 text-lg font-semibold">Audit outputs</h3>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {[
                "Query set + benchmark (what AI assistants say today)",
                "Page-by-page fixes (structure, semantics, internal links)",
                "LLM-ready content briefs (FAQs, comparisons, definitions)",
                "Measurement plan (impressions, rankings, citations/mentions, conversions)",
              ].map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
                <Link href="/contact">
                  Request an audit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/6 hover:bg-white/10">
                <Link href="/services">See all services</Link>
              </Button>
            </div>
          </Card>

          <Card className="glass rounded-2xl p-7">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4 text-accent" aria-hidden="true" />
              How you “own the results”
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              AI Overviews and assistants prefer sources that are clear, specific, and consistently referenced. We help you win by:
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {[
                "Answer-first page structure (definitions, FAQs, comparisons)",
                "Strong entity signals and internal linking (no ambiguity)",
                "Proof signals that are easy to cite (work, benchmarks, repeatable claims)",
                "Distributed presence: mentions and references beyond your site",
              ].map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-6">
              <div className="text-sm font-medium">Pro tip</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Don’t chase every keyword. Pick the exact questions your best buyers ask, then become the most cite-worthy source for those.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-12 pb-6">
        <Card className="glass rounded-2xl p-7">
          <div className="text-lg font-semibold">FAQ</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {faq.map((f) => (
              <Card key={f.q} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <div className="text-base font-semibold">{f.q}</div>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </Card>
            ))}
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}
