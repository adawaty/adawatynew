/*
Cairo Circuit Futurism — Industries (programmatic SEO index)
- Lists target sectors and links to detailed pages
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { site } from "@/lib/content";
import { getIndustries } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowRight, Building2 } from "lucide-react";

export default function Industries() {
  const { lang } = useI18n();
  const industries = getIndustries(lang);
  return (
    <SiteLayout
      title="Industries"
      subtitle="Programmatic pages designed to rank: sector-specific pains, outcomes, and the DFY pillars that solve them."
    >
      <SeoHead
        title={`Industries | ${site.name}`}
        description="Industry landing pages for e-commerce, SaaS, and real estate—built for Google search and AI Overviews with clear, cite-worthy content."
        path="/industries"
        type="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Industries",
          url: new URL("/industries", site.url).toString(),
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
        }}
      />

      <section className="pt-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {industries.map((i) => (
            <Card key={i.id} className="glass premium-card rounded-2xl p-7">
              <div className="flex items-center justify-between gap-3">
                <Badge className="bg-white/6 border border-white/10 text-foreground">Industry page</Badge>
                <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-3 text-xl font-semibold">{i.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{i.summary}</p>
              <div className="mt-5">
                <Button asChild>
                  <Link href={`/industries/${i.id}`}>
                    View page <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 pb-6">
        <Card className="glass premium-card rounded-2xl p-7">
          <div className="text-lg font-semibold">Why industry pages help you own results</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            Google and AI Overviews reward pages that answer specific questions with clear structure. Each industry page is built
            to match sector intent: pains, outcomes, and the exact DFY deliverables.
          </p>
          <div className="mt-5">
            <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
              <Link href="/ai-visibility-audit">Start with an AI Visibility Audit</Link>
            </Button>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}
