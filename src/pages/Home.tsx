/*
Cairo Circuit Futurism — Home (narrative upgrade)
- DFY branding + websites + solutions studio
- Persuasive (ethical): clarity, specificity, proof, risk reversal
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import BrandBuildDemandDiagram from "@/components/BrandBuildDemandDiagram";
import ScrollChapters from "@/components/ScrollChapters";
import SuccessStoriesTeaser from "@/components/SuccessStoriesTeaser";
import { site } from "@/lib/content";
import heroImg from "@/assets/adawaty-hero-education-industry-02.jpeg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { clients } from "@/lib/content";
import { getServices, getAudiences, getCaseStudies } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Workflow,
  BarChart3,
  PenTool,
  Laptop,
  Wand2,
  ShieldCheck,
  Timer,
  Files,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const reduceMotion = useReducedMotion();
  const { t, lang, dir } = useI18n();
  const services = getServices(lang);
  const audiences = getAudiences(lang);
  const caseStudies = getCaseStudies(lang);
  const DirArrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    	<SiteLayout>
      <SeoHead
        title={`${site.name} | DFY Branding, Web & AI Visibility`}
        description="Adawaty is a DFY studio delivering Brand → Build → Demand: positioning, identity, premium websites, apps, content workflows, and Search + AI Visibility (SEO/AEO/LLMSEO)."
        path="/"
        type="website"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: site.url,
            potentialAction: {
              "@type": "SearchAction",
              target: `${site.url}/?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      {/* Hero */}
      <section className="pt-12 sm:pt-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/6 to-white/2">
          {!reduceMotion ? (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-24 opacity-60"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-radial-glow" />
            </motion.div>
          ) : null}
          <div className="absolute inset-0">
            {!reduceMotion ? (
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                animate={{ scale: [1, 1.03, 1], x: [0, -10, 0], y: [0, 6, 0] }}
                transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
              >
                <img
              src={heroImg}
              alt="Abstract hero background"
              className="h-full w-full object-cover opacity-65"
              loading="eager"
              fetchPriority="high"
              width={1376}
              height={768}
                />
              </motion.div>
            ) : (
              <img
                src={heroImg}
                alt="Abstract hero background"
                className="h-full w-full object-cover opacity-65"
                loading="eager"
                fetchPriority="high"
                width={1376}
                height={768}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          </div>

          <div className="relative grid gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
              initial="hidden"
              animate="show"
              className="max-w-2xl"
            >
              <motion.div variants={fade}>
                <Badge className="bg-primary/20 text-primary border border-primary/40">
                  {t("hero.badge")}
                </Badge>
              </motion.div>
              <motion.h1
                variants={fade}
                className="mt-4 text-4xl sm:text-6xl font-semibold leading-[1.05] text-balance"
              >
                {t("hero.h1")}
                <span className="text-muted-foreground"> {t("hero.h1.sub")}</span>
              </motion.h1>
              <motion.p variants={fade} className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl">
                {t("hero.p")}
              </motion.p>

              <motion.div variants={fade} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.73_0.16_190/0.25)]">
                  <Link href="/contact">
                    {t("cta.getPlan")} <DirArrow className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="bg-white/6 hover:bg-white/10">
                  <Link href="/work">{t("cta.seeProof")}</Link>
                </Button>
              </motion.div>

              <motion.div variants={fade} className="mt-7 flex flex-wrap gap-2">
                {[t("hero.chip.1"), t("hero.chip.2"), t("hero.chip.3"), t("hero.chip.4")].map((t) => (
                  <span
                    key={t}
                    className="text-xs rounded-full bg-white/6 border border-white/10 px-3 py-1.5 text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <div className="relative">
              <div className="glass premium-card rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                  {t("home.premiumSystem.title")}
                </div>
                <div className="mt-4 grid gap-3">
                  {[
                    { icon: PenTool, t: t("home.premiumSystem.p1.t"), d: t("home.premiumSystem.p1.d") },
                    { icon: Laptop, t: t("home.premiumSystem.p2.t"), d: t("home.premiumSystem.p2.d") },
                    { icon: Wand2, t: t("home.premiumSystem.p3.t"), d: t("home.premiumSystem.p3.d") },
                    { icon: BarChart3, t: t("home.premiumSystem.p4.t"), d: t("home.premiumSystem.p4.d") }
                  ].map((x) => (
                    <div key={x.t} className="premium-card rounded-xl border border-white/10 bg-white/3 px-4 py-3">
                      <div className="flex items-start gap-3">
                        <x.icon className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                        <div>
                          <div className="text-sm font-semibold">{x.t}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{x.d}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip (Meteory-style signals, Met71-style calm cards) */}
      <section className="mt-16">
        <div className="grid gap-3 sm:grid-cols-3">
          {[{
            k: t("home.trust.sprints.k"),
            v: t("home.trust.sprints.v"),
          },
          {
            k: t("home.trust.handover.k"),
            v: t("home.trust.handover.v"),
          },
          {
            k: t("home.trust.ai.k"),
            v: t("home.trust.ai.v"),
          }].map((x) => (
            <Card key={x.k} className="glass premium-card rounded-2xl p-5">
              <div className="text-sm font-semibold">{x.k}</div>
              <div className="mt-1 text-sm text-muted-foreground">{x.v}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Scroll stopper: Personas */}
      <ScrollChapters
        className="mt-16"
        chapters={[
          {
            eyebrow: t("home.chapter.law.eyebrow"),
            title: t("home.chapter.law.title"),
            body: t("home.chapter.law.body"),
            bullets: [t("home.chapter.law.b1"), t("home.chapter.law.b2"), t("home.chapter.law.b3")],
          },
          {
            eyebrow: t("home.chapter.med.eyebrow"),
            title: t("home.chapter.med.title"),
            body: t("home.chapter.med.body"),
            bullets: [t("home.chapter.med.b1"), t("home.chapter.med.b2"), t("home.chapter.med.b3")],
          },
          {
            eyebrow: t("home.chapter.biz.eyebrow"),
            title: t("home.chapter.biz.title"),
            body: t("home.chapter.biz.body"),
            bullets: [t("home.chapter.biz.b1"), t("home.chapter.biz.b2"), t("home.chapter.biz.b3")],
          },
          {
            eyebrow: t("home.chapter.exec.eyebrow"),
            title: t("home.chapter.exec.title"),
            body: t("home.chapter.exec.body"),
            bullets: [t("home.chapter.exec.b1"), t("home.chapter.exec.b2"), t("home.chapter.exec.b3")],
          },
        ]}
      />

      {/* Niche / differentiation */}
      <section className="mt-16">
        <div className="glass premium-card rounded-2xl border border-white/10 bg-white/2 px-4 py-4 sm:px-6">
          <BrandBuildDemandDiagram className="w-full h-auto" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-balance">One niche: Brand → Build → Demand (DFY, end-to-end).</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl text-balance">
              Many vendors deliver pieces. Adawaty delivers the full system—strategy, build, content, and discoverability—so your team keeps momentum after launch.
            </p>
          </div>
          <Card className="glass premium-card rounded-2xl p-6">
            <div className="text-sm font-medium">Risk reversal</div>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {[
                "Fixed scope per sprint (clear deliverables)",
                "Weekly check-ins + visible progress",
                "Handover docs and templates included",
                "AI workflows with safety boundaries",
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <SuccessStoriesTeaser />

      {/* Digital + Web (integrated) */}
      <section className="mt-16 section-wash-1 rounded-3xl border border-white/10 p-4 sm:p-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">Digital + Web, integrated</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl text-balance">
              Not “a website” and “marketing” as separate vendors. We build the digital experience and the demand engine together.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
              <Link href="/solutions">{t("home.pillars.cta")}</Link>
            </Button>
            <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
              <Link href="/for">Choose your page</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[{
            t: "Experience (UI/UX)",
            d: "Clear hierarchy, fast trust, and one primary action per section.",
            chips: ["IA", "UX writing", "CRO"],
          },
          {
            t: "Build (performance)",
            d: "A premium site that loads fast, tracks conversions, and is easy to iterate.",
            chips: ["Core Web Vitals", "Analytics", "Landing pages"],
          },
          {
            t: "Demand (SEO + AI)",
            d: "Content + visibility so buyers find you in Google, AI Overviews, and assistants.",
            chips: ["AEO", "LLMSEO", "Programmatic pages"],
          }].map((x) => (
            <Card key={x.t} className="glass premium-card rounded-2xl p-6">
              <div className="text-lg font-semibold">{x.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {x.chips.map((c) => (
                  <span key={c} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                    {c}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mt-16 section-wash-3 rounded-3xl border border-white/10 p-4 sm:p-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">{t("home.pillars.title")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {t("home.pillars.subtitle")}
            </p>
          </div>
          <Button asChild variant="secondary" className="hidden sm:inline-flex bg-white/6 hover:bg-white/10">
            <Link href="/solutions">See solutions</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services
            .filter((x) => x.pillar !== "Concierge")
            .map((s) => (
              <Card key={s.id} className="glass premium-card rounded-2xl p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-lg font-semibold">
                      <Link href={`/services/${s.id}`} className="hover:text-primary transition-colors">
                        {s.title}
                      </Link>
                    </div>
                    <span className="text-[11px] rounded-full bg-white/6 border border-white/10 px-2 py-1 text-muted-foreground">
                      {s.pillar}
                    </span>
                  </div>
                  <span className="text-[11px] rounded-full bg-white/6 border border-white/10 px-2 py-1 text-muted-foreground">
                    {s.pillar}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.bullets.slice(0, 2).map((b) => (
                    <span key={b} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                      {b}
                    </span>
                  ))}
                </div>
              </Card>
            ))}

          <Card className="glass premium-card rounded-2xl p-6 ring-1 ring-accent/50">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold">{t("home.pillars.concierge")}</div>
              <span className="text-[11px] rounded-full bg-accent/20 border border-accent/40 px-2 py-1 text-accent">
                {t("home.pillars.ongoing")}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("home.pillars.conciergeDesc")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {services
                .find((x) => x.pillar === "Concierge")
                ?.bullets.slice(0, 2)
                .map((b) => (
                  <span key={b} className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1">
                    {b}
                  </span>
                ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Packages (decision simplifier) */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">{t("home.packages.title")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {t("home.packages.subtitle")}
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              t: t("home.packages.starter.t"),
              tag: t("home.packages.starter.tag"),
              b: [t("home.packages.starter.b1"), t("home.packages.starter.b2"), t("home.packages.starter.b3"), t("home.packages.starter.b4")],
            },
            {
              t: t("home.packages.growth.t"),
              tag: t("home.packages.growth.tag"),
              b: [t("home.packages.growth.b1"), t("home.packages.growth.b2"), t("home.packages.growth.b3"), t("home.packages.growth.b4")],
              highlight: true,
            },
            {
              t: t("home.packages.enterprise.t"),
              tag: t("home.packages.enterprise.tag"),
              b: [t("home.packages.enterprise.b1"), t("home.packages.enterprise.b2"), t("home.packages.enterprise.b3"), t("home.packages.enterprise.b4")],
            },
          ].map((p) => (
            <Card
              key={p.t}
              className={
                "glass rounded-2xl p-6 " +
                (p.highlight ? "ring-1 ring-primary/60 shadow-[0_0_60px_oklch(0.73_0.16_190/0.18)]" : "")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{p.t}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.tag}</div>
                </div>
                {p.highlight ? (
                  <Badge className="bg-accent/25 text-accent border border-accent/40">{t("home.packages.mostChosen")}</Badge>
                ) : null}
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                {p.b.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Button asChild className="w-full">
                  <Link href="/contact">{t("home.packages.cta")}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Audiences (diagonal cut) */}
      <section className="mt-18 diag-top rounded-3xl bg-white/2 border border-white/10">
        <div className="px-6 py-14 sm:px-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-balance">{t("home.audiences.title")}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {t("home.audiences.subtitle")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {audiences.map((i) => (
              <Card key={i.id} className="glass premium-card rounded-2xl p-6">
                <div className="text-lg font-semibold">{i.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{i.summary}</p>
                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  {i.outcomes.slice(0, 3).map((o) => (
                    <li key={o} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">{t("home.clients.title")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {t("home.clients.subtitle")}
            </p>
          </div>
          <Button asChild variant="secondary" className="hidden sm:inline-flex bg-white/6 hover:bg-white/10">
            <Link href="/contact">{t("home.clients.cta")}</Link>
          </Button>
        </div>

        <div className="mt-6 glass rounded-2xl border border-white/10 bg-white/2 p-6">
          <div className="flex flex-wrap gap-2">
            {clients.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs rounded-full bg-white/6 border border-white/10 px-3 py-1.5 hover:bg-white/10 transition-colors"
              >
                <span className="text-foreground">{c.name}</span>
                <span className="text-muted-foreground"> — {c.industry}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">{t("home.proof.title")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {t("home.work.subtitle")}
            </p>
          </div>
          <Button asChild variant="secondary" className="hidden sm:inline-flex bg-white/6 hover:bg-white/10">
            <Link href="/work">{t("home.proof.browseAll")}</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {caseStudies.slice(0, 3).map((c) => (
            <Card key={c.slug} className="glass premium-card rounded-2xl p-6">
              <Badge className="bg-white/6 border border-white/10 text-foreground">{c.category}</Badge>
              <div className="mt-3 text-lg font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
              <div className="mt-5">
                <Button asChild>
                  <Link href={`/work/${c.slug}`}>
                    {t("home.proof.view")} <DirArrow className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="mt-16">
        <h2 className="text-2xl sm:text-3xl font-semibold">{t("home.howWeWork.title")}</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Strategy		 and systems, delivered in sprints—so you launch faster and keep control.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Discover", d: "Audit brand, offer, audience, constraints." },
            { n: "02", t: "Design", d: "Messaging + identity + UX structure." },
            { n: "03", t: "Build", d: "Website, templates, assets, analytics." },
            { n: "04", t: "Enable", d: "AI workflows and handover so you scale." },
          ].map((s) => (
            <Card key={s.n} className="glass premium-card rounded-2xl p-6">
              <div className="text-xs text-muted-foreground">{s.n}</div>
              <div className="mt-2 text-lg font-semibold">{s.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-16 diag-bottom rounded-3xl bg-gradient-to-b from-white/6 to-white/2 border border-white/10">
        <div className="px-6 py-14 sm:px-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-balance">Ready for a turnkey upgrade?</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Tell us what you want to launch or improve. We’ll propose a DFY scope with a sprint timeline and clear deliverables.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Start the conversation</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/6 hover:bg-white/10">
              <Link href="/services">Explore services</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
