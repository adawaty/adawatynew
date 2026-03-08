/*
Cairo Circuit Futurism — Personas hub (/for)
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { getPersonas } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function For() {
  const { lang, t } = useI18n();
  const personas = getPersonas(lang);
  return (
    <SiteLayout>
      <SeoHead
        title={`${site.name} | ${t("nav.for")}`}
        description={t("for.subtitle")}
        path="/for"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("nav.for"),
          url: `${site.url}/for`,
        }}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs tracking-[0.24em] uppercase text-primary/90">{t("nav.for")}</div>
            <h1 className="mt-3 text-3xl sm:text-5xl font-semibold leading-[1.05] text-balance">
              {t("for.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {t("for.subtitle")}
            </p>
          </div>
          <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
            <Link href="/contact">{t("for.cta")}</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((p) => (
            <Card key={p.id} className="glass premium-card rounded-2xl p-6">
              <div className="text-lg font-semibold">
                <Link href={`/for/${p.slug}`} className="hover:text-primary transition-colors">
                  {p.title}
                </Link>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-5">
                <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                  <Link href={`/for/${p.slug}`}>{t("for.button")}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </SiteLayout>
  );
}
