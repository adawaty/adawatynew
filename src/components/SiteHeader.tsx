/*
Cairo Circuit Futurism — SiteHeader (enhanced)
- Scroll-aware glass effect with blur transition
- Animated logo dot with neon pulse
- Active route indicator with teal underline
- Smooth mobile drawer
*/

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu, Sparkles, X, ChevronDown } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  { href: "/services", key: "nav.services" },
  { href: "/solutions", key: "nav.solutions" },
  { href: "/for", key: "nav.for" },
  { href: "/industries", key: "nav.industries" },
  { href: "/work", key: "nav.work" },
  { href: "/about", key: "nav.studio" },
] as const;

export default function SiteHeader() {
  const [location] = useLocation();
  const { t, dir } = useI18n();
  const brandName = dir === "rtl" ? "أدواتي" : "Adawaty";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => location, [location]);

  // Scroll-aware header
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min((y / docH) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] z-10 overflow-hidden">
        <motion.div
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, oklch(0.76 0.18 190), oklch(0.86 0.16 85))",
          }}
          animate={{ scaleX: scrollProgress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      {/* Utility bar */}
      <div
        className={cn(
          "hidden sm:block border-b transition-all duration-300",
          scrolled
            ? "border-white/6 bg-[oklch(0.13_0.025_255/0.95)] backdrop-blur-xl"
            : "border-white/10 bg-background/60 backdrop-blur"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-9 items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px]">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                />
                ISO-ready delivery
              </span>
              <a className="premium-focus hover:text-foreground transition-colors" href="mailto:alazzeh.ml@gmail.com">
                alazzeh.ml@gmail.com
              </a>
              <span className="opacity-40">•</span>
              <a className="premium-focus hover:text-foreground transition-colors" href="tel:+201000000000">
                +20 100 000 0000
              </a>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link className="premium-focus hover:text-foreground transition-colors" href="/ai-visibility-audit">
                {t("nav.aiAudit")}
              </Link>
              <span className="opacity-40">•</span>
              <Link className="premium-focus hover:text-foreground transition-colors" href="/pricing-calculator">
                {t("nav.pricingCalc")}
              </Link>
              <span className="opacity-40">•</span>
              <Link className="premium-focus hover:text-foreground font-medium text-primary transition-colors" href="/contact">
                {t("cta.requestScope")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-[oklch(0.13_0.025_255/0.95)] backdrop-blur-xl shadow-[0_1px_0_oklch(1_0_0/0.07),0_4px_24px_oklch(0_0_0/0.3)]"
            : "glass bg-background/60"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between overflow-x-hidden">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5 min-w-0">
              <div className="relative h-9 w-9 rounded-xl bg-primary/15 ring-1 ring-primary/30 grid place-items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="logo-dot relative h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="font-semibold tracking-tight truncate max-w-[36vw] sm:max-w-none group-hover:text-primary transition-colors">
                  {brandName}
                </div>
                <div className="text-[10px] text-muted-foreground -mt-0.5 font-mono">
                  {dir === "rtl" ? "براند ← بناء ← طلب" : "Brand → Build → Demand"}
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm rounded-lg transition-colors",
                    "hover:bg-white/5 hover:text-foreground",
                    active === item.href ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {t(item.key)}
                  {active === item.href && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                      style={{
                        background: "linear-gradient(90deg, oklch(0.76 0.18 190), oklch(0.86 0.16 85))",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA buttons */}
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex bg-white/6 hover:bg-white/10 border border-white/10"
              >
                <Link href="/pricing-calculator">{t("nav.pricing")}</Link>
              </Button>

              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex shadow-[0_0_30px_oklch(0.76_0.18_190/0.3)]"
              >
                <Link href="/contact">
                  {t("cta.book")} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>

              <div className="sm:hidden">
                <LanguageSwitcher />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-lg"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Mobile drawer */}
          <AnimatePresence>
            {open && (
              <motion.div
                ref={drawerRef}
                key="mobile-nav"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="md:hidden overflow-hidden"
              >
                <div className="pb-5">
                  <div className="circuit-divider mb-4" />

                  {/* Quick links */}
                  <div className="flex flex-wrap gap-2 px-1 mb-3">
                    <Link
                      className="chip chip-teal text-[11px]"
                      href="/ai-visibility-audit"
                      onClick={() => setOpen(false)}
                    >
                      <Sparkles className="h-3 w-3" /> {t("nav.aiAudit")}
                    </Link>
                    <Link
                      className="chip text-[11px]"
                      href="/pricing-calculator"
                      onClick={() => setOpen(false)}
                    >
                      {t("nav.pricing")}
                    </Link>
                  </div>

                  <div className="circuit-divider mb-3" />

                  {/* Main nav links */}
                  <motion.div
                    className="flex flex-col gap-0.5"
                    variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                    initial="hidden"
                    animate="show"
                  >
                    {nav.map((item) => (
                      <motion.div
                        key={item.href}
                        variants={{
                          hidden: { opacity: 0, x: -8 },
                          show: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors",
                            active === item.href
                              ? "bg-primary/12 text-primary border border-primary/20"
                              : "hover:bg-white/5 text-foreground"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          {t(item.key)}
                          {active === item.href && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="mt-4 px-1">
                    <Button asChild className="w-full shadow-[0_0_30px_oklch(0.76_0.18_190/0.25)]">
                      <Link href="/contact" onClick={() => setOpen(false)}>
                        {t("cta.book")} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
