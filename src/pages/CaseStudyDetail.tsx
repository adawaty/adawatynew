/*
Cairo Circuit Futurism — Case Study detail (updated)
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { getCaseStudyBySlug } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function CaseStudyDetail({ slug }: { slug: string }) {
  const { lang } = useI18n();
  const c = getCaseStudyBySlug(lang, slug);

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
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-white/6 border border-white/10 text-foreground">{c.category}</Badge>
          <span className="text-sm text-primary">{c.highlightMetric}</span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="text-sm font-medium">Challenge</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.challenge}</p>

            <div className="mt-6 text-sm font-medium">Solution</div>
            <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
              {c.solution.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-sm font-medium">Results</div>
            <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
              {c.results.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-medium">Themes</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.tools.map((t) => (
                <span key={t} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 circuit-divider" />

            <div className="mt-6 text-sm font-medium">Want a similar outcome?</div>
            <p className="mt-2 text-sm text-muted-foreground">
              We can propose a turnkey DFY scope with a sprint timeline.
            </p>
            <div className="mt-4 grid gap-2">
              <Button asChild>
                <Link href="/contact">
                  Book a call <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                <Link href="/work">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
