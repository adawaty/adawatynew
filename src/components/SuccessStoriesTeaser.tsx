/*
Success stories teaser section (home)
*/

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useI18n } from "@/contexts/I18nContext";

export default function SuccessStoriesTeaser() {
  const { t } = useI18n();
  return (
    <section className="mt-16 section-wash-2 rounded-3xl border border-white/10 p-4 sm:p-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">{t("home.successTeaser.title")}</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            {t("home.successTeaser.subtitle")}
          </p>
        </div>
        <Button asChild variant="secondary" className="hidden sm:inline-flex bg-white/6 hover:bg-white/10">
          <Link href="/for">{t("home.successTeaser.cta")}</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            t: "Lawyers",
            d: "Consultations up. Wrong-case leads down. Faster response.",
            href: "/for/lawyers",
          },
          {
            t: "Doctors / Clinics",
            d: "Bookings up. No-shows down. Patient questions reduced.",
            href: "/for/doctors",
          },
          {
            t: "Business owners",
            d: "Less manual handoff. Faster reporting. Workflow adoption.",
            href: "/for/business-owners",
          },
        ].map((x) => (
          <Card key={x.t} className="glass premium-card rounded-2xl p-6">
            <div className="text-lg font-semibold">
              <Link href={x.href} className="hover:text-primary transition-colors">
                {x.t}
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
            <div className="mt-5">
              <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                <Link href={x.href}>{t("home.successTeaser.view")}</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
