/*
Cairo Circuit Futurism — Persona detail ("for" pages)
- Approachable targeting: lawyers, doctors, business owners
- pSEO-friendly: pains/outcomes/solutions/FAQ
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { getPersonas, getSolutions } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import lawyerHero from "@/assets/generated/persona-lawyer-hero.png";
import doctorHero from "@/assets/generated/persona-doctor-hero.png";
import businessHero from "@/assets/generated/persona-business-hero.png";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PersonaDetail({ slug }: { slug: string }) {
  const { lang, dir, t } = useI18n();
  const DirArrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const personas = getPersonas(lang);
  const solutions = getSolutions(lang);
  const p = personas.find((x) => x.slug === slug);

  if (!p) {
    return (
      <SiteLayout>
        <SeoHead title={`${site.name} | Page not found`} description="Page not found" noindex path={`/for/${slug}`} />
        <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <p className="mt-2 text-muted-foreground">Try the personas hub.</p>
          <div className="mt-6">
            <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
              <Link href="/for">Back to “For”</Link>
            </Button>
          </div>
        </main>
      </SiteLayout>
    );
  }

  const successJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Success stories — ${p.title}`,
    itemListElement: p.successStories.map((s, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "CreativeWork",
        name: s.headline,
        description: s.context,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "For", item: `${site.url}/for` },
      { "@type": "ListItem", position: 3, name: p.title, item: `${site.url}/for/${p.slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What do I get, step-by-step?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We run DFY sprints: scope lock → architecture → design → build → launch → handover. Every sprint has visible deliverables.",
        },
      },
      {
        "@type": "Question",
        name: "Can you connect booking and forms to our workflow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We map the current process first, then connect scheduling, intake, routing, and reporting so your team actually uses it.",
        },
      },
    ],
  };

  const recSolutions = p.recommendedSolutions
    .map((id) => solutions.find((s) => s.id === id))
    .filter(Boolean);

  const heroBySlug: Record<string, string> = {
    lawyers: lawyerHero,
    doctors: doctorHero,
    "business-owners": businessHero,
  };
  const hero = heroBySlug[p.slug] ?? businessHero;

  return (
    <SiteLayout>
      <SeoHead
        title={p.seo.title}
        description={p.seo.description}
        path={`/for/${p.slug}`}
        type="article"
        jsonLd={[breadcrumbJsonLd, faqJsonLd, successJsonLd]}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3">
          <div className="absolute inset-0">
            <img src={hero} alt="Persona hero background" className="h-full w-full object-cover opacity-70" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          </div>
          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs tracking-[0.24em] uppercase text-primary/90">Built for</div>
            <h1 className="mt-3 text-3xl sm:text-5xl font-semibold leading-[1.05] text-balance">{p.title}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{p.summary}</p>
          </div>
          <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
            <Link href="/contact">Book a call</Link>
          </Button>
        </div>
          </div>
        </section>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">{t("persona.breakingTrust")}</div>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {p.pains.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">{t("persona.buildInstead")}</div>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {p.outcomes.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-semibold">{t("persona.successStories")}</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            {t("persona.successStories.subtitle")}
          </p>

          <div className="mt-6 grid gap-4">
            {p.successStories.map((s) => (
              <Card key={s.id} className="glass premium-card rounded-2xl p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="text-lg font-semibold">{s.headline}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.context}</div>
                    <div className="mt-3 text-xs text-muted-foreground">{t("persona.timeframe")}: {s.timeframe}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {s.results.map((r) => (
                      <div key={r.label} className="rounded-xl border border-white/10 bg-white/3 px-3 py-3 text-center">
                        <div className="text-lg font-semibold text-primary">{r.value}</div>
                        <div className="mt-1 text-[11px] leading-tight text-muted-foreground">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 circuit-divider" />

                <div className="mt-5">
                  <div className="text-sm font-semibold">{t("persona.shipped")}</div>
                  <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                    {s.whatWeDid.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">{t("persona.recommendedSolutions")}</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                {t("persona.recommendedSolutions.subtitle")}
              </p>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex bg-white/6 hover:bg-white/10">
              <Link href="/solutions">{t("persona.seeAllSolutions")}</Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {recSolutions.map((s) => (
              <Card key={s!.id} className="glass premium-card rounded-2xl p-6">
                <div className="text-lg font-semibold">
                  <Link href={`/solutions/${s!.slug}`} className="hover:text-primary transition-colors">
                    {s!.title}
                  </Link>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s!.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s!.deliverables.slice(0, 3).map((d) => (
                    <span key={d} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                      {d}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/3 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold">{t("persona.marketingPsychology")}</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            {t("persona.marketingPsychology.subtitle")}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[{
              t: "Halo effect",
              d: "Better aesthetics increase perceived competence—especially in high-stakes services.",
            },
            {
              t: "Cognitive load",
              d: "Fewer choices, clearer hierarchy, higher conversion.",
            },
            {
              t: "Loss aversion",
              d: "We frame costs of delay: missed bookings, weak trust, manual ops.",
            }].map((x) => (
              <Card key={x.t} className="glass rounded-2xl p-6">
                <div className="text-sm font-semibold">{x.t}</div>
                <div className="mt-2 text-sm text-muted-foreground">{x.d}</div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
