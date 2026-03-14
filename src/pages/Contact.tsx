/*
Cairo Circuit Futurism — Contact (Neon-connected)
- Fully controlled inputs — no stale form ref bug
- Submits to /api/lead-requests → Neon Postgres
- Shows real API errors, never loops
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site, services } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { insertLead } from "@/lib/neonService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  Loader2,
  Send,
  ArrowRight,
  Zap,
  Shield,
  MessageSquare,
} from "lucide-react";

export default function Contact() {
  // Controlled inputs — avoids stale e.currentTarget ref in async handler
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState<string | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [serial,     setSerial]     = useState<string | undefined>();

  // Extra guard: ref so rapid double-clicks can't slip through between renders
  const inFlight = useRef(false);

  const { lang, t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Double-submit guard
    if (submitting || inFlight.current) return;

    const n = name.trim();
    const p = phone.trim();
    const em = email.trim();
    const msg = message.trim();
    const svc = service ?? "";

    if (!n)  { toast.error("Please enter your name.");         return; }
    if (!p)  { toast.error("Please enter your phone number."); return; }

    inFlight.current = true;
    setSubmitting(true);

    try {
      const result = await insertLead({
        source: "contact",
        lang,
        name: n,
        email: em || undefined,
        phone: p,
        request_type: svc || "general",
        notes: msg || undefined,
      });

      if (result.ok) {
        setSerial(result.serial);
        setSubmitted(true);
        // Clear fields
        setName(""); setEmail(""); setPhone(""); setMessage(""); setService(undefined);
        toast.success(t("contact.received"));
      } else {
        toast.error(result.error ?? "Submission failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Network error — please check your connection.");
    } finally {
      setSubmitting(false);
      inFlight.current = false;
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSerial(undefined);
  };

  return (
    <SiteLayout title={t("contact.title")} subtitle={t("contact.subtitle")}>
      <SeoHead
        title={`Contact | ${site.name}`}
        description="Request a DFY scope for Brand → Build → Demand. Get a clear next step and a sprint plan."
        path="/contact"
        type="website"
      />

      {/* Trust chips */}
      <div className="pt-4 flex flex-wrap gap-2 mb-8">
        {[
          { icon: Zap,     label: "Respond within 24 h" },
          { icon: Shield,  label: "No spam, ever" },
          { icon: Clock,   label: "Free consultation" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="chip chip-teal">
            <Icon className="h-3 w-3" /> {label}
          </span>
        ))}
      </div>

      <section>
        <div className="grid gap-5 lg:grid-cols-3">

          {/* ── Form card ── */}
          <Card className="glass rounded-2xl p-7 lg:col-span-2 glow-border-teal">
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-5"
                >
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/25 grid place-items-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                      animate={{ scale: [1, 1.6, 1.6], opacity: [0.8, 0, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{t("contact.received")}</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      Your request has been saved. We'll review it and reach out within 24 hours with a clear next step.
                    </p>
                    {serial && (
                      <p className="mt-3 text-xs text-muted-foreground/60 font-mono tracking-wider">
                        Ref: {serial}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-white/6 hover:bg-white/10"
                    onClick={resetForm}
                  >
                    Submit another request
                  </Button>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Tell us about your project
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="cf-name">
                        {t("form.name")} <span className="text-destructive text-xs">*</span>
                      </Label>
                      <Input
                        id="cf-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        placeholder={t("form.name.placeholder")}
                        className="bg-white/4 border-white/12 focus:border-primary/40 focus:bg-white/6 transition-colors"
                        disabled={submitting}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cf-email">{t("form.email")}</Label>
                      <Input
                        id="cf-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        spellCheck={false}
                        placeholder={t("form.email.placeholder")}
                        className="bg-white/4 border-white/12 focus:border-primary/40 focus:bg-white/6 transition-colors"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="cf-phone">
                        {t("form.phone")} <span className="text-destructive text-xs">*</span>
                      </Label>
                      <Input
                        id="cf-phone"
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        placeholder={t("form.phone.placeholder")}
                        className="bg-white/4 border-white/12 focus:border-primary/40 focus:bg-white/6 transition-colors"
                        disabled={submitting}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cf-service">{t("contact.service")}</Label>
                      <Select value={service} onValueChange={setService} disabled={submitting}>
                        <SelectTrigger id="cf-service" className="bg-white/4 border-white/12">
                          <SelectValue placeholder={t("contact.service.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                          ))}
                          <SelectItem value="not-sure">{t("contact.service.notSure")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cf-message">{t("form.message")}</Label>
                    <Textarea
                      id="cf-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("contact.message.placeholder")}
                      className="min-h-32 bg-white/4 border-white/12 focus:border-primary/40 focus:bg-white/6 transition-colors resize-none"
                      disabled={submitting}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="shadow-[0_0_40px_oklch(0.76_0.18_190/0.25)] gap-2"
                    >
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> {t("form.sending")}</>
                      ) : (
                        <>{t("contact.send")} <Send className="h-4 w-4" /></>
                      )}
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      {t("contact.preferEmail")}{" "}
                      <a className="underline hover:text-foreground transition-colors" href="mailto:alazzeh.ml@gmail.com">
                        alazzeh.ml@gmail.com
                      </a>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>

          {/* ── Info sidebar ── */}
          <div className="flex flex-col gap-4">
            <Card className="glass rounded-2xl p-6">
              <div className="text-base font-semibold mb-4">Direct lines</div>
              <div className="grid gap-3">
                {[
                  { icon: Mail,  label: "Email",               value: "alazzeh.ml@gmail.com", href: "mailto:alazzeh.ml@gmail.com", color: "bg-primary/10 border-primary/20 text-primary" },
                  { icon: Phone, label: "Phone / WhatsApp",    value: "+20 10 0000 0000",      href: "tel:+201000000000",           color: "bg-accent/10 border-accent/20 text-accent" },
                  { icon: Clock, label: "Working hours",       value: "Sun–Thu, 9:00–18:00",   href: undefined,                    color: "bg-white/6 border-white/12 text-muted-foreground" },
                  { icon: MapPin,label: "Location",            value: "Cairo, Egypt — Remote-first", href: undefined,              color: "bg-white/6 border-white/12 text-muted-foreground" },
                ].map(({ icon: Icon, label, value, href, color }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/2 p-4 hover:bg-white/4 transition-colors">
                    <div className={`h-8 w-8 rounded-lg border grid place-items-center shrink-0 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">{label}</div>
                      {href
                        ? <a href={href} className="text-sm hover:text-primary transition-colors mt-0.5 block">{value}</a>
                        : <div className="text-sm mt-0.5">{value}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass rounded-2xl p-6 glow-border-amber">
              <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-accent" /> What happens next
              </div>
              <ol className="grid gap-3">
                {[
                  "We review your request (same day)",
                  "We send a DFY scope proposal",
                  "You approve the sprint plan",
                  "We start building 🚀",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="h-5 w-5 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold grid place-items-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
