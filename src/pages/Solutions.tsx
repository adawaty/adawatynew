/*
Cairo Circuit Futururism — Solutions hub
- pSEO-friendly hub page for high-intent “deliverable” queries
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { getSolutions } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Solutions() {
  const { lang, t } = useI18n();
  const solutions = getSolutions(lang);
  return (
    <SiteLayout>
      <SeoHead
        title={`${site.name} | ${t("nav.solutions")}`}
        description={t("solutions.subtitle")}
        path="/solutions"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("nav.solutions"),
          url: `${site.url}/solutions`,
        }}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs tracking-[0.24em] uppercase text-primary/90">{t("solutions.eyebrow")}</div>
            <h1 className="mt-3 text-3xl sm:text-5xl font-semibold leading-[1.05] text-balance">
              {t("solutions.title")}
              <span className="text-muted-foreground"> {t("solutions.dfytag")}.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {t("solutions.subtitle")}
            </p>
          </div>
          <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
            <Link href="/contact">{t("solutions.cta")}</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {solutions.map((s) => (
            <Card key={s.id} className="glass premium-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">
                    <Link href={`/solutions/${s.slug}`} className="hover:text-primary transition-colors">
                      {s.title}
                    </Link>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                </div>
                <span className="text-[11px] shrink-0 rounded-full bg-white/6 border border-white/10 px-2 py-1 text-muted-foreground">
                  DFY
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {s.whoItsFor.slice(0, 3).map((x) => (
                  <span key={x} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                    {x}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                  <Link href={`/solutions/${s.slug}`}>{t("solutions.view")}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/3 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold">{t("solutions.steps.title")}</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            {t("solutions.steps.subtitle")}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: t("solutions.step0.t"),
                d: t("solutions.step0.d"),
              },
              {
                t: t("solutions.step1.t"),
                d: t("solutions.step1.d"),
              },
              {
                t: t("solutions.step2.t"),
                d: t("solutions.step2.d"),
              },
              {
                t: t("solutions.step3.t"),
                d: t("solutions.step3.d"),
              },
              {
                t: t("solutions.step4.t"),
                d: t("solutions.step4.d"),
              },
              {
                t: t("solutions.stepPost.t"),
                d: t("solutions.stepPost.d"),
              },
            ].map((x) => (
              <Card key={x.t} className="glass premium-card rounded-2xl p-6">
                <div className="text-sm font-semibold">{x.t}</div>
                <div className="mt-2 text-sm text-muted-foreground">{x.d}</div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}
