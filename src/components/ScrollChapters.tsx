/*
Cairo Circuit Futurism — Scroll Chapters (scroll-stopper)
- Goal: pinned, cinematic section that advances in “chapters” as you scroll
- Tech: Framer Motion useScroll/useTransform
- Constraints: respect prefers-reduced-motion, keep text readable
*/

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { useI18n } from "@/contexts/I18nContext";

export type ScrollChapter = {
  eyebrow?: string;
  title: string;
  body: string;
  bullets?: string[];
};

export default function ScrollChapters({
  chapters,
  className,
}: {
  chapters: ScrollChapter[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { t, dir } = useI18n();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const steps = useMemo(() => {
    const n = Math.max(1, chapters.length);
    return Array.from({ length: n }, (_, i) => i / (n - 1 || 1));
  }, [chapters.length]);

  return (
    <section ref={ref} className={className}>
      <div className="relative min-h-[260vh]">
        <div className="sticky top-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3">
            {/* animated circuit grid */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute inset-0 bg-grid" />
              <div className="absolute inset-0 bg-radial-glow" />
              {!reduceMotion && <div className="absolute inset-0 scanlines" />}
            </div>

            <div className="relative grid gap-6 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_0.95fr]">
              <div>
                <div className="text-xs tracking-[0.24em] uppercase text-primary/90">{t("home.scrollStopper.eyebrow")}</div>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold leading-[1.05] text-balance">
                  {t("home.scrollStopper.title")}
                  <span className="text-muted-foreground"> {t("home.scrollStopper.subtitle")}</span>
                </h2>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  {t("home.scrollStopper.desc")}
                </p>

                {/* progress */}
                <div className="mt-6">
                  <div className="h-1.5 w-full rounded-full bg-white/6 overflow-hidden border border-white/10">
                    <motion.div
                      className={`h-full w-full ${dir === "rtl" ? "origin-right" : "origin-left"} bg-gradient-to-r from-primary to-accent`}
                      style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>{t("home.scrollStopper.progress1")}</span>
                    <span>{t("home.scrollStopper.progress2")}</span>
                    <span>{t("home.scrollStopper.progress3")}</span>
                    <span>{t("home.scrollStopper.progress4")}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="grid gap-4">
                  {chapters.map((c, idx) => {
                    const start = steps[idx] ?? 0;
                    const prev = steps[Math.max(0, idx - 1)] ?? 0;
                    const next = steps[Math.min(steps.length - 1, idx + 1)] ?? 1;

                    const opacity = reduceMotion
                      ? 1
                      : useTransform(scrollYProgress, [prev, start, next], [0.18, 1, 0.18]);

                    const y = reduceMotion ? 0 : useTransform(scrollYProgress, [prev, start, next], [18, 0, -18]);

                    const scale = reduceMotion
                      ? 1
                      : useTransform(scrollYProgress, [prev, start, next], [0.98, 1, 0.98]);

                    return (
                      <motion.article
                        key={c.title}
                        className="glass rounded-2xl p-6 border border-white/10"
                        style={{ opacity, y, scale }}
                      >
                        {c.eyebrow ? (
                          <div className="text-[11px] tracking-[0.22em] uppercase text-accent/90">{c.eyebrow}</div>
                        ) : null}
                        <div className="mt-2 text-lg font-semibold">{c.title}</div>
                        <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                        {c.bullets?.length ? (
                          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            {c.bullets.map((b) => (
                              <li key={b} className="flex gap-2">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
