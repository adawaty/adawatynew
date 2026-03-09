/*
Cairo Circuit Futurism — SiteHeader (updated nav)
*/

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu, Sparkles } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { useMemo, useState } from "react";

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

  const active = useMemo(() => location, [location]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Meteory-inspired utility bar (fast trust + contact) */}
      <div className="hidden sm:block border-b border-white/10 bg-background/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-10 items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/6 border border-white/10 px-2 py-1">
                <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> ISO-ready delivery
              </span>
              <a className="premium-focus hover:text-foreground" href="mailto:alazzeh.ml@gmail.com">alazzeh.ml@gmail.com</a>
              <span className="opacity-50">•</span>
              <a className="premium-focus hover:text-foreground" href="tel:+201000000000">+20 100 000 0000</a>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link className="premium-focus hover:text-foreground" href="/ai-visibility-audit">{t("nav.aiAudit")}</Link>
              <span className="opacity-50">•</span>
              <Link className="premium-focus hover:text-foreground" href="/contact">{t("cta.requestScope")}</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="glass bg-background/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between overflow-x-hidden">
            <Link href="/" className="group flex items-center gap-2 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-primary/20 ring-1 ring-primary/40 grid place-items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_22px_oklch(0.73_0.16_190/0.55)]" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="font-semibold tracking-tight truncate max-w-[36vw] sm:max-w-none">{brandName}</div>
                <div className="text-xs text-muted-foreground -mt-0.5">
                  {dir === "rtl" ? "براند ← بناء ← طلب" : "Brand → Build → Demand"}
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg transition-colors",
                    "hover:bg-white/5 hover:text-foreground",
                    active === item.href ? "bg-white/6 text-foreground" : "text-muted-foreground"
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">

              <Button asChild className="hidden sm:inline-flex">
                <Link href="/contact">
                  {t("cta.book")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <div className="sm:hidden">
                <LanguageSwitcher />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {open ? (
            <div className="md:hidden pb-4">
              <div className="circuit-divider mb-3" />
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 px-3">
                  <Link className="text-xs text-muted-foreground hover:text-foreground" href="/ai-visibility-audit" onClick={() => setOpen(false)}>
                    {t("nav.aiAudit")}
                  </Link>
                  <span className="text-xs text-muted-foreground/50">•</span>
                  <Link className="text-xs text-muted-foreground hover:text-foreground" href="/contact" onClick={() => setOpen(false)}>
                    {t("cta.requestScope")}
                  </Link>
                </div>
                <div className="circuit-divider" />

                <div className="flex flex-col gap-1">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm",
                        active === item.href ? "bg-white/6" : "hover:bg-white/5",
                        "text-foreground"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                  <Button asChild className="mt-2">
                    <Link href="/contact" onClick={() => setOpen(false)}>
                      {t("cta.book")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
