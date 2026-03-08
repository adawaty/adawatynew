/*
Cairo Circuit Futurism — Work (portfolio)
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { clients } from "@/lib/content";
import { getCaseStudies } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowRight } from "lucide-react";

export default function Work() {
  const { lang } = useI18n();
  const caseStudies = getCaseStudies(lang);
  return (
    <SiteLayout
      title="Work"
      subtitle="A starter set showing how we ship: clarity, systems, premium execution. Includes a composite case study and selected clients."
    >
      <SeoHead
        title={`Work | ${site.name}`}
        description="Examples of DFY outcomes: premium websites, turnkey launches, and AI visibility foundations."
        path="/work"
        type="website"
      />
      <section className="pt-10">
        <div className="glass premium-card rounded-2xl border border-white/10 bg-white/2 p-6">
          <div className="text-sm font-medium">Selected clients</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {clients.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs rounded-full bg-white/6 border border-white/10 px-3 py-1.5 hover:bg-white/10 transition-colors"
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {caseStudies.map((c) => (
            <Card key={c.slug} className="glass premium-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <Badge className="bg-white/6 border border-white/10 text-foreground">{c.category}</Badge>
                <span className="text-xs text-primary">{c.highlightMetric}</span>
              </div>
              <div className="mt-3 text-lg font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tools.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <Button asChild>
                  <Link href={`/work/${c.slug}`}>
                    View case study <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
