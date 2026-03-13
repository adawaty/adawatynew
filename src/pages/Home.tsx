/*
Cairo Circuit Futurism — Home (enhanced)
- Animated hero with floating stats, neon glows, gradient text
- Live metric counters, animated cards, glow dividers
- Supabase-ready CTAs
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
  BarChart3,
  PenTool,
  Laptop,
  Wand2,
  ShieldCheck,
  Zap,
  Globe,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  Clock,
} from "lucide-react";
import { motion, useReducedMotion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// ── Variants ──────────────────────────────────────────────────────────────────
const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = (delay = 0.07): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="stat-number">
      {val}
      {suffix}
    </span>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle, center = false }: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={stagger(0.07)}
      className={center ? "text-center" : ""}
    >
      {eyebrow && (
        <motion.div variants={fade} className="mb-2">
          <span className="chip chip-teal">{eyebrow}</span>
        </motion.div>
      )}
      <motion.h2 variants={fade} className="text-2xl sm:text-3xl font-semibold text-balance">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fade} className={`mt-2 text-muted-foreground max-w-2xl ${center ? "mx-auto" : ""} text-balance`}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
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
          { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url },
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

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="pt-10 sm:pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 hero-gradient-mesh opacity-70" />

          {/* Hero image */}
          <div className="absolute inset-0">
            {!reduceMotion ? (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.04, 1], x: [0, -8, 0], y: [0, 5, 0] }}
                transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
              >
                <img
                  src={heroImg}
                  alt="Adawaty hero"
                  className="h-full w-full object-cover opacity-50"
                  loading="eager"
                  fetchPriority="high"
                  width={1376}
                  height={768}
                />
              </motion.div>
            ) : (
              <img
                src={heroImg}
                alt="Adawaty hero"
                className="h-full w-full object-cover opacity-50"
                loading="eager"
                fetchPriority="high"
                width={1376}
                height={768}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/20" />
          </div>

          {/* Scanlines overlay */}
          {!reduceMotion && <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />}

          {/* Content */}
          <div className="relative grid gap-10 px-5 py-12 sm:px-10 sm:py-18 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left: copy */}
            <motion.div
              variants={stagger(0.08)}
              initial="hidden"
              animate="show"
              className="max-w-2xl"
            >
              <motion.div variants={fade}>
                <Badge className="bg-primary/15 text-primary border border-primary/35 gap-1.5 py-1 px-3">
                  <motion.span
                    animate={!reduceMotion ? { opacity: [0.4, 1, 0.4] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-1.5 w-1.5 rounded-full bg-primary inline-block"
                  />
                  {t("hero.badge")}
                </Badge>
              </motion.div>

              <motion.h1
                variants={fade}
                className="mt-5 text-4xl sm:text-6xl font-semibold leading-[1.06] text-balance"
              >
                {t("hero.h1")}{" "}
                <span className="gradient-text">{t("hero.h1.sub")}</span>
              </motion.h1>

              <motion.p variants={fade} className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {t("hero.p")}
              </motion.p>

              <motion.div variants={fade} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="shadow-[0_0_50px_oklch(0.76_0.18_190/0.35)] hover:shadow-[0_0_60px_oklch(0.76_0.18_190/0.50)] transition-shadow"
                >
                  <Link href="/contact">
                    {t("cta.getPlan")} <DirArrow className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="bg-white/6 hover:bg-white/10 border border-white/10">
                  <Link href="/work">{t("cta.seeProof")}</Link>
                </Button>
              </motion.div>

              <motion.div variants={fade} className="mt-6 flex flex-wrap gap-2">
                {[t("hero.chip.1"), t("hero.chip.2"), t("hero.chip.3"), t("hero.chip.4")].map((chip) => (
                  <span key={chip} className="chip">{chip}</span>
                ))}
              </motion.div>

              {/* Trust signals row */}
              <motion.div variants={fade} className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {[
                  { icon: Users, label: "13+ clients served" },
                  { icon: Star, label: "5-star rated" },
                  { icon: Clock, label: "4–8 week sprints" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span>{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: feature card */}
            <motion.div
              variants={fade}
              initial="hidden"
              animate="show"
              className="relative self-center"
            >
              <div className="glass-strong rounded-2xl p-5 sm:p-6 animated-border">
                <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                  <Sparkles className="h-4 w-4 text-accent" />
                  {t("home.premiumSystem.title")}
                </div>
                <div className="grid gap-3">
                  {[
                    { icon: PenTool, t: t("home.premiumSystem.p1.t"), d: t("home.premiumSystem.p1.d"), color: "text-primary" },
                    { icon: Laptop, t: t("home.premiumSystem.p2.t"), d: t("home.premiumSystem.p2.d"), color: "text-accent" },
                    { icon: Wand2, t: t("home.premiumSystem.p3.t"), d: t("home.premiumSystem.p3.d"), color: "text-primary" },
                    { icon: BarChart3, t: t("home.premiumSystem.p4.t"), d: t("home.premiumSystem.p4.d"), color: "text-accent" },
                  ].map((x, i) => (
                    <motion.div
                      key={x.t}
                      initial={!reduceMotion ? { opacity: 0, x: 12 } : {}}
                      animate={!reduceMotion ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="premium-card rounded-xl border border-white/8 bg-white/3 px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <x.icon className={`mt-0.5 h-4 w-4 shrink-0 ${x.color}`} />
                        <div>
                          <div className="text-sm font-semibold">{x.t}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{x.d}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              {!reduceMotion && (
                <motion.div
                  className="absolute -top-4 -right-4 glass rounded-xl border border-white/12 px-3 py-2 text-xs font-semibold float"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <span className="text-accent">✦</span> DFY Studio
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── METRICS STRIP ─────────────────────────────────────────────────── */}
      <section className="mt-12">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { value: 13, suffix: "+", label: "Clients delivered", icon: Users, color: "text-primary" },
            { value: 4, suffix: "–8wk", label: "Sprint timelines", icon: Clock, color: "text-accent" },
            { value: 7, suffix: " langs", label: "Multilingual UI", icon: Globe, color: "text-primary" },
            { value: 100, suffix: "%", label: "DFY end-to-end", icon: CheckCircle2, color: "text-accent" },
          ].map((m) => (
            <Card key={m.label} className="glass premium-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    <Counter to={m.value} suffix={m.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
                </div>
                <m.icon className={`h-5 w-5 ${m.color} mt-0.5`} />
              </div>
              <div className="mt-3 metric-bar">
                <div className="metric-bar-fill" style={{ width: "100%" }} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
      <section className="mt-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { k: t("home.trust.sprints.k"), v: t("home.trust.sprints.v"), icon: Zap },
            { k: t("home.trust.handover.k"), v: t("home.trust.handover.v"), icon: ShieldCheck },
            { k: t("home.trust.ai.k"), v: t("home.trust.ai.v"), icon: TrendingUp },
          ].map((x) => (
            <Card key={x.k} className="glass premium-card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
                  <x.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{x.k}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground leading-snug">{x.v}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── SCROLL CHAPTERS ───────────────────────────────────────────────── */}
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

      {/* ── BRAND BUILD DEMAND ────────────────────────────────────────────── */}
      <section className="mt-16">
        <div className="glass-strong rounded-2xl border border-white/10 bg-white/2 px-4 py-5 sm:px-6 glow-border-teal">
          <BrandBuildDemandDiagram className="w-full h-auto" />
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <SectionHeading
              title="One niche: Brand → Build → Demand (DFY, end-to-end)."
              subtitle="Many vendors deliver pieces. Adawaty delivers the full system—strategy, build, content, and discoverability—so your team keeps momentum after launch."
            />
          </div>
          <Card className="glass premium-card rounded-2xl p-6 glow-border-amber">
            <div className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Risk reversal
            </div>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {[
                "Fixed scope per sprint (clear deliverables)",
                "Weekly check-ins + visible progress",
                "Handover docs and templates included",
                "AI workflows with safety boundaries",
              ].map((x) => (
                <li key={x} className="flex gap-2 items-start">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <SuccessStoriesTeaser />

      {/* ── DIGITAL + WEB ─────────────────────────────────────────────────── */}
      <section className="mt-16 section-wash-1 rounded-3xl border border-white/10 p-5 sm:p-8">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading
            title="Digital + Web, integrated"
            subtitle="Not a website and marketing as separate vendors. We build the digital experience and the demand engine together."
          />
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Button asChild variant="secondary" size="sm" className="bg-white/6 hover:bg-white/10">
              <Link href="/solutions">{t("home.pillars.cta")}</Link>
            </Button>
            <Button asChild variant="secondary" size="sm" className="bg-white/6 hover:bg-white/10">
              <Link href="/for">Choose your page</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: PenTool,
              t: "Experience (UI/UX)",
              d: "Clear hierarchy, fast trust, and one primary action per section.",
              chips: ["IA", "UX writing", "CRO"],
              color: "text-primary",
              bg: "bg-primary/10 border-primary/20",
            },
            {
              icon: Laptop,
              t: "Build (performance)",
              d: "A premium site that loads fast, tracks conversions, and is easy to iterate.",
              chips: ["Core Web Vitals", "Analytics", "Landing pages"],
              color: "text-accent",
              bg: "bg-accent/10 border-accent/20",
            },
            {
              icon: TrendingUp,
              t: "Demand (SEO + AI)",
              d: "Content + visibility so buyers find you in Google, AI Overviews, and assistants.",
              chips: ["AEO", "LLMSEO", "Programmatic pages"],
              color: "text-primary",
              bg: "bg-primary/10 border-primary/20",
            },
          ].map((x, i) => (
            <motion.div
              key={x.t}
              initial={!reduceMotion ? { opacity: 0, y: 20 } : {}}
              whileInView={!reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <Card className="glass premium-card rounded-2xl p-6 h-full">
                <div className={`h-9 w-9 rounded-xl border grid place-items-center mb-4 ${x.bg}`}>
                  <x.icon className={`h-4.5 w-4.5 ${x.color}`} />
                </div>
                <div className="text-base font-semibold">{x.t}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{x.d}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {x.chips.map((c) => (
                    <span key={c} className="chip text-[11px]">{c}</span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section className="mt-16 section-wash-3 rounded-3xl border border-white/10 p-5 sm:p-8">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading
            title={t("home.pillars.title")}
            subtitle={t("home.pillars.subtitle")}
          />
          <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex bg-white/6 hover:bg-white/10">
            <Link href="/solutions">See solutions</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services
            .filter((x) => x.pillar !== "Concierge")
            .map((s, i) => (
              <motion.div
                key={s.id}
                initial={!reduceMotion ? { opacity: 0, y: 16 } : {}}
                whileInView={!reduceMotion ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                viewport={{ once: true, margin: "-30px" }}
              >
                <Card className="glass premium-card rounded-2xl p-6 h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-base font-semibold">
                      <Link href={`/services/${s.id}`} className="hover:text-primary transition-colors">
                        {s.title}
                      </Link>
                    </div>
                    <span className="chip chip-teal text-[10px] shrink-0">{s.pillar}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.bullets.slice(0, 2).map((b) => (
                      <span key={b} className="chip text-[11px]">{b}</span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}

          <Card className="glass premium-card rounded-2xl p-6 ring-1 ring-accent/40 glow-border-amber">
            <div className="flex items-start justify-between gap-2">
              <div className="text-base font-semibold">{t("home.pillars.concierge")}</div>
              <span className="chip chip-amber text-[10px] shrink-0">{t("home.pillars.ongoing")}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("home.pillars.conciergeDesc")}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {services
                .find((x) => x.pillar === "Concierge")
                ?.bullets.slice(0, 2)
                .map((b) => (
                  <span key={b} className="chip text-[11px]">{b}</span>
                ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ── PACKAGES ──────────────────────────────────────────────────────── */}
      <section className="mt-16">
        <SectionHeading
          title={t("home.packages.title")}
          subtitle={t("home.packages.subtitle")}
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              t: t("home.packages.starter.t"),
              tag: t("home.packages.starter.tag"),
              b: [
                t("home.packages.starter.b1"),
                t("home.packages.starter.b2"),
                t("home.packages.starter.b3"),
                t("home.packages.starter.b4"),
              ],
            },
            {
              t: t("home.packages.growth.t"),
              tag: t("home.packages.growth.tag"),
              b: [
                t("home.packages.growth.b1"),
                t("home.packages.growth.b2"),
                t("home.packages.growth.b3"),
                t("home.packages.growth.b4"),
              ],
              highlight: true,
            },
            {
              t: t("home.packages.enterprise.t"),
              tag: t("home.packages.enterprise.tag"),
              b: [
                t("home.packages.enterprise.b1"),
                t("home.packages.enterprise.b2"),
                t("home.packages.enterprise.b3"),
                t("home.packages.enterprise.b4"),
              ],
            },
          ].map((p, i) => (
            <motion.div
              key={p.t}
              initial={!reduceMotion ? { opacity: 0, y: 20 } : {}}
              whileInView={!reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-30px" }}
            >
              <Card
                className={
                  "glass rounded-2xl p-6 h-full flex flex-col " +
                  (p.highlight
                    ? "ring-1 ring-primary/50 shadow-[0_0_60px_oklch(0.76_0.18_190/0.18)] glow-border-teal"
                    : "")
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold">{p.t}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{p.tag}</div>
                  </div>
                  {p.highlight && (
                    <Badge className="bg-accent/20 text-accent border border-accent/35 shrink-0">
                      {t("home.packages.mostChosen")}
                    </Badge>
                  )}
                </div>

                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground flex-1">
                  {p.b.map((x) => (
                    <li key={x} className="flex gap-2 items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  <Button asChild className="w-full" variant={p.highlight ? "default" : "secondary"}>
                    <Link href="/contact">{t("home.packages.cta")}</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AUDIENCES ─────────────────────────────────────────────────────── */}
      <section className="mt-18 diag-top rounded-3xl bg-white/2 border border-white/10">
        <div className="px-6 py-14 sm:px-10">
          <SectionHeading
            title={t("home.audiences.title")}
            subtitle={t("home.audiences.subtitle")}
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {audiences.map((aud, i) => (
              <motion.div
                key={aud.id}
                initial={!reduceMotion ? { opacity: 0, y: 16 } : {}}
                whileInView={!reduceMotion ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.09, duration: 0.45 }}
                viewport={{ once: true }}
              >
                <Card className="glass premium-card rounded-2xl p-6 h-full">
                  <div className="text-base font-semibold">{aud.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{aud.summary}</p>
                  <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                    {aud.outcomes.slice(0, 3).map((o) => (
                      <li key={o} className="flex gap-2 items-start">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ───────────────────────────────────────────────────────── */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading
            title={t("home.clients.title")}
            subtitle={t("home.clients.subtitle")}
          />
          <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex bg-white/6 hover:bg-white/10">
            <Link href="/contact">{t("home.clients.cta")}</Link>
          </Button>
        </div>

        <div className="mt-6 glass rounded-2xl border border-white/10 bg-white/2 p-5">
          <div className="flex flex-wrap gap-2">
            {clients.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="chip hover:chip-teal transition-all duration-150"
              >
                <span className="text-foreground font-medium">{c.name}</span>
                <span className="text-muted-foreground/60"> — {c.industry}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK / PROOF ──────────────────────────────────────────────────── */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading
            title={t("home.proof.title")}
            subtitle={t("home.work.subtitle")}
          />
          <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex bg-white/6 hover:bg-white/10">
            <Link href="/work">{t("home.proof.browseAll")}</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {caseStudies.slice(0, 3).map((c, i) => (
            <motion.div
              key={c.slug}
              initial={!reduceMotion ? { opacity: 0, y: 18 } : {}}
              whileInView={!reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="glass premium-card rounded-2xl p-6 h-full flex flex-col">
                <Badge className="bg-white/6 border border-white/10 text-foreground self-start">{c.category}</Badge>
                <div className="mt-3 text-base font-semibold flex-1">{c.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
                {c.highlightMetric && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary self-start">
                    <TrendingUp className="h-3.5 w-3.5" /> {c.highlightMetric}
                  </div>
                )}
                <div className="mt-5">
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/work/${c.slug}`}>
                      {t("home.proof.view")} <DirArrow className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW WE WORK ───────────────────────────────────────────────────── */}
      <section className="mt-16">
        <SectionHeading
          title={t("home.howWeWork.title")}
          subtitle="Strategy and systems, delivered in sprints—so you launch faster and keep control."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Discover", d: "Audit brand, offer, audience, constraints.", color: "border-primary/25 bg-primary/5" },
            { n: "02", t: "Design", d: "Messaging + identity + UX structure.", color: "border-accent/25 bg-accent/5" },
            { n: "03", t: "Build", d: "Website, templates, assets, analytics.", color: "border-primary/25 bg-primary/5" },
            { n: "04", t: "Enable", d: "AI workflows and handover so you scale.", color: "border-accent/25 bg-accent/5" },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={!reduceMotion ? { opacity: 0, y: 16 } : {}}
              whileInView={!reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              viewport={{ once: true }}
            >
              <Card className={`glass premium-card rounded-2xl p-6 border ${s.color} h-full`}>
                <div className="step-number">{s.n}</div>
                <div className="mt-1 text-base font-semibold">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="mt-16 diag-bottom rounded-3xl relative overflow-hidden border border-white/10">
        <div className="absolute inset-0 hero-gradient-mesh opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/4 to-white/1 pointer-events-none" />
        <div className="relative px-6 py-14 sm:px-12">
          <motion.div
            initial={!reduceMotion ? { opacity: 0, y: 20 } : {}}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <div className="chip chip-teal mb-4 inline-flex">
              <Sparkles className="h-3 w-3" /> Ready when you are
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-balance max-w-2xl">
              Ready for a{" "}
              <span className="gradient-text">turnkey upgrade?</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
              Tell us what you want to launch or improve. We'll propose a DFY scope with a sprint timeline and clear deliverables.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="shadow-[0_0_50px_oklch(0.76_0.18_190/0.35)]"
              >
                <Link href="/contact">
                  Start the conversation <DirArrow className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/6 hover:bg-white/10">
                <Link href="/services">Explore services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
