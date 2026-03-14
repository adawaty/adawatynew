/*
Cairo Circuit Futurism — Contact
- No backend. Contact via WhatsApp or email only.
- WhatsApp: +1 (339) 399-1355
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
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  ArrowRight,
  Zap,
  Shield,
  MessageSquare,
  MessageCircle,
  Send,
} from "lucide-react";

const WA_NUMBER = "13393991355"; // E.164 without +
const WA_DISPLAY = "+1 (339) 399-1355";

function buildWhatsAppUrl(name: string, service: string, message: string) {
  const body = [
    `Hi Adawaty! 👋`,
    name    ? `Name: ${name}` : "",
    service ? `Interested in: ${service}` : "",
    message ? `\nMessage: ${message}` : "",
  ].filter(Boolean).join("\n");
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(body)}`;
}

export default function Contact() {
  const [name,    setName]    = useState("");
  const [service, setService] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");
  const { t } = useI18n();

  const serviceLabel = services.find((s) => s.id === service)?.title ?? service ?? "";

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(name, serviceLabel, message), "_blank", "noopener");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Adawaty request${serviceLabel ? ` — ${serviceLabel}` : ""}`);
    const body    = encodeURIComponent(
      [name ? `Name: ${name}` : "", message].filter(Boolean).join("\n\n")
    );
    window.location.href = `mailto:alazzeh.ml@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <SiteLayout title={t("contact.title")} subtitle={t("contact.subtitle")}>
      <SeoHead
        title={`Contact | ${site.name}`}
        description="Get in touch with Adawaty — DFY branding, web & AI enablement."
        path="/contact"
        type="website"
      />

      {/* Trust chips */}
      <div className="pt-4 flex flex-wrap gap-2 mb-8">
        {[
          { icon: Zap,    label: "Respond within 24 h" },
          { icon: Shield, label: "No spam, ever" },
          { icon: Clock,  label: "Free consultation" },
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
            <div className="flex items-center gap-2 text-sm font-semibold mb-5">
              <MessageSquare className="h-4 w-4 text-primary" />
              Tell us about your project
            </div>

            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="cf-name">{t("form.name")}</Label>
                  <Input
                    id="cf-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder={t("form.name.placeholder")}
                    className="bg-white/4 border-white/12 focus:border-primary/40 focus:bg-white/6 transition-colors"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cf-service">{t("contact.service")}</Label>
                  <Select value={service} onValueChange={setService}>
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
                  className="min-h-28 bg-white/4 border-white/12 focus:border-primary/40 focus:bg-white/6 transition-colors resize-none"
                />
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  size="lg"
                  onClick={handleWhatsApp}
                  className="gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-[0_0_40px_#25D36640] flex-1"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp us
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleEmail}
                  className="gap-2 bg-white/6 hover:bg-white/10 flex-1"
                >
                  <Send className="h-4 w-4" />
                  Send email
                </Button>
              </div>

              <p className="text-xs text-muted-foreground/60 text-center">
                Fill in any fields you'd like to pre-fill in the message — then choose how to send.
              </p>
            </div>
          </Card>

          {/* ── Info sidebar ── */}
          <div className="flex flex-col gap-4">
            <Card className="glass rounded-2xl p-6">
              <div className="text-base font-semibold mb-4">Direct lines</div>
              <div className="grid gap-3">
                {[
                  {
                    icon: MessageCircle,
                    label: "WhatsApp Business",
                    value: WA_DISPLAY,
                    href: `https://wa.me/${WA_NUMBER}`,
                    color: "bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366]",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "alazzeh.ml@gmail.com",
                    href: "mailto:alazzeh.ml@gmail.com",
                    color: "bg-primary/10 border-primary/20 text-primary",
                  },
                  {
                    icon: Phone,
                    label: "Phone / Call",
                    value: WA_DISPLAY,
                    href: `tel:+${WA_NUMBER}`,
                    color: "bg-accent/10 border-accent/20 text-accent",
                  },
                  {
                    icon: Clock,
                    label: "Working hours",
                    value: "Sun–Thu, 9:00–18:00 (Cairo)",
                    href: undefined,
                    color: "bg-white/6 border-white/12 text-muted-foreground",
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: "Cairo, Egypt — Remote-first",
                    href: undefined,
                    color: "bg-white/6 border-white/12 text-muted-foreground",
                  },
                ].map(({ icon: Icon, label, value, href, color }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/2 p-3.5 hover:bg-white/4 transition-colors">
                    <div className={`h-8 w-8 rounded-lg border grid place-items-center shrink-0 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">{label}</div>
                      {href
                        ? <a href={href} target="_blank" rel="noopener" className="text-sm hover:text-primary transition-colors mt-0.5 block">{value}</a>
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
                  "We review your project brief",
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
