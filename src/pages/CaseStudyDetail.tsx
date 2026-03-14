/*
Cairo Circuit Futurism — Case Study detail (updated)
- Shows client website screenshot when available
- Full challenge / solution / results layout
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site, clients } from "@/lib/content";
import { getCaseStudyBySlug } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ExternalLink, Globe } from "lucide-react";
import { useState } from "react";

// Map case study slug → client id (for screenshots)
const SLUG_TO_CLIENT: Record<string, string> = {
  "meteory-fire-safety": "meteory",
  "aithub-edtech": "aithub",
  "mrhesham-education": "mrhesham",
};

export default function CaseStudyDetail({ slug }: { slug: string }) {
  const { lang } = useI18n();
  const c = getCaseStudyBySlug(lang, slug);
  const [imgError, setImgError] = useState(false);

  if (!c) {
    return (
      <SiteLayout title="Case study not found" subtitle="The link may be outdated.">
        <div className="pt-10">
          <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
            <Link href="/work">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to work
            </Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const clientId = SLUG_TO_CLIENT[slug];
  const clientData = clientId ? clients.find((cl) => cl.id === clientId) : undefined;
  const screenshotPath = clientId ? `/screenshots/${clientId}.jpg` : null;

  return (
    <SiteLayout title={c.title} subtitle={c.summary}>
      <SeoHead
        title={`${c.title} | ${site.name}`}
        description={c.summary}
        path={`/work/${c.slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: c.title,
          description: c.summary,
          mainEntityOfPage: new URL(`/work/${c.slug}`, site.url).toString(),
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        }}
      />
      <section className="pt-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button asChild variant="secondary" size="sm" className="bg-white/6 hover:bg-white/10">
            <Link href="/work">
              <ArrowLeft className="mr-2 h-3.5 w-3.5" /> All work
            </Link>
          </Button>
          <Badge className="bg-white/6 border border-white/10 text-foreground">{c.category}</Badge>
          <span className="text-sm text-primary font-medium">{c.highlightMetric}</span>
        </div>

        {/* Screenshot */}
        {screenshotPath && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 aspect-[16/7] bg-white/3">
            {!imgError ? (
              <img
                src={screenshotPath}
                alt={`${c.title} website screenshot`}
                className="w-full h-full object-cover object-top"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Globe className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="glass rounded-2xl p-6 lg:col-span-2 space-y-6">
            <div>
              <div className="text-sm font-semibold mb-2">Challenge</div>
              <p className="text-sm text-muted-foreground">{c.challenge}</p>
            </div>

            <div className="circuit-divider" />

            <div>
              <div className="text-sm font-semibold mb-2">Solution</div>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                {c.solution.map((s) => (
                  <li key={s} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="circuit-divider" />

            <div>
              <div className="text-sm font-semibold mb-2">Results</div>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                {c.results.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="glass rounded-2xl p-6">
              <div className="text-sm font-semibold mb-3">Themes & Tools</div>
              <div className="flex flex-wrap gap-2">
                {c.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {clientData && (
                <>
                  <div className="mt-5 circuit-divider" />
                  <div className="mt-4">
                    <div className="text-sm font-semibold mb-1">Client</div>
                    <div className="text-sm text-muted-foreground">{clientData.name}</div>
                    <div className="text-xs text-muted-foreground/60 mt-0.5">{clientData.industry}</div>
                    <a
                      href={clientData.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> Visit site
                    </a>
                  </div>
                </>
              )}
            </Card>

            <Card className="glass rounded-2xl p-6 glow-border-teal">
              <div className="text-sm font-semibold mb-2">Want a similar outcome?</div>
              <p className="text-sm text-muted-foreground">
                We can propose a turnkey DFY scope with a sprint timeline — at no cost.
              </p>
              <div className="mt-4 grid gap-2">
                <Button asChild>
                  <Link href="/contact">
                    Start the conversation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                  <Link href="/work">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Work
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
