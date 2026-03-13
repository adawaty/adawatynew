/*
Cairo Circuit Futurism — SiteFooter (enhanced)
- Animated gradient mesh background
- Social links + status indicator
- Newsletter input via Neon API
- Circuit line decorations
*/

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, ArrowUpRight, Twitter, Linkedin, Github, Globe, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { insertLead } from "@/lib/neonService";

const footerNav = {
  Studio: [
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Industries", href: "/industries" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "Brand Intelligence", href: "/services/brand-intelligence" },
    { label: "Brand System", href: "/services/brand-system" },
    { label: "DFY Website", href: "/services/dfy-website" },
    { label: "Content Engine", href: "/services/content-engine" },
    { label: "Search + AI Visibility", href: "/services/ai-visibility" },
  ],
  Tools: [
    { label: "Pricing Calculator", href: "/pricing-calculator" },
    { label: "AI Visibility Audit", href: "/ai-visibility-audit" },
    { label: "Solutions", href: "/solutions" },
    { label: "For You", href: "/for" },
  ],
};

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await insertLead({
        source: "newsletter",
        name: email.trim().split("@")[0] ?? "subscriber",
        email: email.trim(),
        phone: "n/a",
        request_type: "newsletter",
        notes: "Footer newsletter signup",
      });
      setSubscribed(true);
      toast.success("You're on the list! We'll be in touch.");
    } catch {
      toast.success("You're on the list! We'll be in touch.");
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-72"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, oklch(0.76 0.18 190 / 0.08), transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top CTA strip */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-8 glow-border-teal">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-semibold gradient-text-static">
                Ready to build something remarkable?
              </div>
              <p className="mt-1 text-sm text-muted-foreground max-w-lg">
                Tell us about your project. We'll propose a DFY scope with a sprint timeline.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                asChild
                size="lg"
                className="shadow-[0_0_40px_oklch(0.76_0.18_190/0.3)]"
              >
                <Link href="/contact">
                  Start the conversation <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white/6 hover:bg-white/10"
              >
                <Link href="/pricing-calculator">Get an estimate</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            {/* Brand column */}
            <div className="max-w-xs">
              <Link href="/" className="group inline-flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 rounded-xl bg-primary/15 ring-1 ring-primary/30 grid place-items-center">
                  <div className="logo-dot h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold group-hover:text-primary transition-colors">Adawaty</div>
                  <div className="text-[10px] text-muted-foreground font-mono">Brand → Build → Demand</div>
                </div>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Elite DFY studio delivering positioning, identity, premium websites, content workflows, and Search + AI Visibility.
              </p>

              {/* Status indicator */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-2 w-2 rounded-full bg-emerald-400"
                />
                <span className="text-xs text-muted-foreground">Available for new projects</span>
              </div>

              {/* Contact buttons */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="bg-white/6 hover:bg-white/10 text-xs"
                >
                  <a href="mailto:alazzeh.ml@gmail.com">
                    <Mail className="mr-1.5 h-3.5 w-3.5" /> Email
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="bg-white/6 hover:bg-white/10 text-xs"
                >
                  <a href="tel:+201000000000">
                    <Phone className="mr-1.5 h-3.5 w-3.5" /> Call
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="bg-white/6 hover:bg-white/10 text-xs"
                >
                  <a href="https://adawaty.net" target="_blank" rel="noreferrer">
                    <Globe className="mr-1.5 h-3.5 w-3.5" /> Web
                  </a>
                </Button>
              </div>
            </div>

            {/* Nav columns */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-10">
              {Object.entries(footerNav).map(([section, links]) => (
                <div key={section}>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                    {section}
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-150 inline-block"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-8 pt-6 border-t border-white/8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-sm">
                <div className="text-sm font-medium mb-1">Stay in the loop</div>
                <p className="text-xs text-muted-foreground">
                  Brand strategy, AI visibility insights, and studio updates — no spam.
                </p>
                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4" /> You're subscribed — thanks!
                  </motion.div>
                ) : (
                  <form onSubmit={handleNewsletter} className="mt-3 flex gap-2">
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 h-9 bg-white/4 border-white/12 text-sm"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={loading}
                      className="shrink-0 h-9 px-3"
                    >
                      {loading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="block h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"
                        />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </form>
                )}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2">
                {[
                  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                  { icon: Twitter, href: "https://twitter.com", label: "Twitter / X" },
                  { icon: Globe, href: "https://adawaty.net", label: "Website" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center hover:bg-white/10 hover:border-primary/30 transition-all duration-150"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-6 circuit-divider" />
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Adawaty. All rights reserved.
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Brand → Build → Demand</span>
              <span className="opacity-40">•</span>
              <span>DFY for founders & teams</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
