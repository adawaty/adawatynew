/*
Cairo Circuit Futurism — Contact
- Local-only form (no backend). On submit: toast.
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
import { useState } from "react";
import { submitLeadRequest } from "@/lib/leadRequests";
import { useI18n } from "@/contexts/I18nContext";

export default function Contact() {
  const [service, setService] = useState<string | undefined>(undefined);
  const { lang, t } = useI18n();

  return (
    <SiteLayout
      title={t("contact.title")}
      subtitle={t("contact.subtitle")}
    >
      <SeoHead
        title={`Contact | ${site.name}`}
        description="Request a DFY scope for Brand → Build → Demand. Get a clear next step and a sprint plan."
        path="/contact"
        type="website"
      />
      <section className="pt-10">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="glass rounded-2xl p-7 lg:col-span-2">
            <form
              className="grid gap-5"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);

                const name = String(fd.get("name") ?? "").trim();
                const email = String(fd.get("email") ?? "").trim();
                const phone = String(fd.get("phone") ?? "").trim();
                if (!phone) {
                  toast.error(t("form.required"));
                  return;
                }
                const msg = String(fd.get("message") ?? "").trim();
                const interested = String(fd.get("service") ?? "").trim();

                const loading = toast.loading(t("form.sending"), { duration: 15000 });
                try {
                  const { serial } = await submitLeadRequest({
                    source: "contact",
                    lang,
                    name,
                    ...(email ? { email } : {}),
                    phone,
                    request_type: interested || undefined,
                    notes: msg,
                  });
                  toast.success(t("contact.received"), {
                    id: loading,
                    description: `${t("pricing.serial")}: ${serial}`,
                  });
                  form.reset();
                  setService(undefined);
                } catch (err: any) {
                  toast.error(t("form.submitError"), {
                    id: loading,
                    description: err?.message ?? t("form.tryAgain"),
                  });
                }
              }}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("form.name")}</Label>
                  <Input id="name" name="name" required autoComplete="name" placeholder={t("form.name.placeholder")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("form.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder={t("form.email.placeholder")}
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">{t("form.phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={t("form.phone.placeholder")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service">{t("contact.service")}</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service" className="bg-white/3 border-white/10">
                      <SelectValue placeholder={t("contact.service.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="not-sure">{t("contact.service.notSure")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="service" value={service ?? ""} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">{t("form.message")}</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder={t("contact.message.placeholder")}
                  className="min-h-32 bg-white/3 border-white/10"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" size="lg">
                  {t("contact.send")}
                </Button>
                <div className="text-xs text-muted-foreground">
                  {t("contact.preferEmail")} <a className="underline hover:text-foreground" href="mailto:alazzeh.ml@gmail.com">alazzeh.ml@gmail.com</a>
                </div>
              </div>
            </form>
          </Card>

          <Card className="glass rounded-2xl p-7">
            <div className="text-lg font-semibold">Direct lines</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your official business contacts here (phone/WhatsApp/address).
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="text-sm font-semibold">Email</div>
                <a className="mt-1 block text-sm text-muted-foreground underline hover:text-foreground" href="mailto:alazzeh.ml@gmail.com">
                  alazzeh.ml@gmail.com
                </a>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="text-sm font-semibold">Phone</div>
                <div className="mt-1 text-sm text-muted-foreground">+20 10 0000 0000 (replace)</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="text-sm font-semibold">Working hours</div>
                <div className="mt-1 text-sm text-muted-foreground">Sun–Thu, 9:00–18:00</div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
