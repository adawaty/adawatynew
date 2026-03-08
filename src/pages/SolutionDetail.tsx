/*
Cairo Circuit Futurism — Solution detail page
- High-intent landing pages: deliverables, timeline, integrations, FAQ schema
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { getSolutions } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import appHero from "@/assets/generated/solution-apps-hero.png";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SolutionDetail({ slug }: { slug: string }) {
  const { lang } = useI18n();
  const solutions = getSolutions(lang);
  const s = solutions.find((x) => x.slug === slug);

  if (!s) {
    return (
      <SiteLayout>
        <SeoHead title={`${site.name} | Solution not found`} description="Solution not found" noindex path={`/solutions/${slug}`} />
        <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-semibold">Solution not found</h1>
          <p className="mt-2 text-muted-foreground">Try the solutions hub.</p>
          <div className="mt-6">
            <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
              <Link href="/solutions">Back to solutions</Link>
            </Button>
          </div>
        </main>
      </SiteLayout>
    );
  }

  const hero = s.slug === "app-development" ? appHero : undefined;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.summary,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: "EG",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${site.url}/solutions` },
      { "@type": "ListItem", position: 3, name: s.title, item: `${site.url}/solutions/${s.slug}` },
    ],
  };

  return (
    <SiteLayout>
      <SeoHead
        title={s.seo.title}
        description={s.seo.description}
        path={`/solutions/${s.slug}`}
        type="article"
        jsonLd={[serviceJsonLd, faqJsonLd, breadcrumbJsonLd]}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3">
          {hero ? (
            <div className="absolute inset-0">
              <img src={hero} alt="Solution hero background" className="h-full w-full object-cover opacity-70" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
            </div>
          ) : null}
          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs tracking-[0.24em] uppercase text-primary/90">Solution</div>
            <h1 className="mt-3 text-3xl sm:text-5xl font-semibold leading-[1.05] text-balance">{s.title}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{s.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.whoItsFor.map((x) => (
                <span key={x} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                  {x}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
              <Link href="/contact">Request scope</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/6 hover:bg-white/10">
              <Link href="/solutions">All solutions</Link>
            </Button>
          </div>
        </div>
          </div>
        </section>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Card className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="text-sm font-semibold">Deliverables</div>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {s.deliverables.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Timeline</div>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {s.timeline.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 circuit-divider" />
            <div className="mt-6 text-sm font-semibold">Integrations</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.integrations.map((i) => (
                <span key={i} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                  {i}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {s.faqs.length ? (
          <section className="mt-12">
            <h2 className="text-2xl sm:text-3xl font-semibold">FAQs</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {s.faqs.map((f) => (
                <Card key={f.q} className="glass rounded-2xl p-6">
                  <div className="text-sm font-semibold">{f.q}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{f.a}</div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/3 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold">Want this built for your exact workflow?</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            We’ll map your current process, remove bottlenecks, then build the smallest system that works—fast. No chaos, no handoffs.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
              <Link href="/contact">Book a call</Link>
            </Button>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
