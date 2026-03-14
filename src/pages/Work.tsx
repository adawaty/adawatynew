/*
Cairo Circuit Futurism — Work / أعمالنا (portfolio)
- Live screenshots of client websites
- Classified by industry and niche
- Case study cards linked to detail pages
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { clients } from "@/lib/content";
import { getCaseStudies } from "@/lib/contentLocalized";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowRight, ExternalLink, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Industry groups with color coding
const INDUSTRY_GROUPS = [
  {
    label: "Industrial & Manufacturing",
    labelAr: "الصناعة والتصنيع",
    color: "bg-orange-500/15 border-orange-500/30 text-orange-300",
    badge: "bg-orange-500/10 border-orange-500/20 text-orange-300",
    ids: ["meteory", "sparx", "altawfeek", "tawplast", "el-etehad", "egyspring"],
  },
  {
    label: "Food, FMCG & Distribution",
    labelAr: "الغذاء والتوزيع",
    color: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    ids: ["3a", "crownycup", "bello-food", "nextsupply"],
  },
  {
    label: "Healthcare & Medical",
    labelAr: "الرعاية الصحية",
    color: "bg-blue-500/15 border-blue-500/30 text-blue-300",
    badge: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    ids: ["dnc"],
  },
  {
    label: "Education & EdTech",
    labelAr: "التعليم والتكنولوجيا التعليمية",
    color: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    badge: "bg-violet-500/10 border-violet-500/20 text-violet-300",
    ids: ["coursatee", "aithub", "mrhesham"],
  },
  {
    label: "Technology & Web Services",
    labelAr: "التقنية وخدمات الويب",
    color: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
    badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
    ids: ["hostocta"],
  },
];

const ALL_FILTER = "All";

function ClientCard({ client, groupColor }: {
  client: { id: string; name: string; url: string; industry: string; note?: string };
  groupColor: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass premium-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
        {/* Screenshot */}
        <div className="relative aspect-[16/9] overflow-hidden bg-white/3">
          {!imgError ? (
            <img
              src={`/screenshots/${client.id}.jpg`}
              alt={`${client.name} website screenshot`}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Globe className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <a
              href={client.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-white hover:bg-white/20 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" /> Visit site
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="text-sm font-semibold leading-tight">{client.name}</div>
          <div className="mt-1.5">
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${groupColor}`}>
              {client.industry}
            </span>
          </div>
          {client.note && (
            <p className="mt-2 text-xs text-muted-foreground">{client.note}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default function Work() {
  const { lang } = useI18n();
  const caseStudies = getCaseStudies(lang);
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);

  const filters = [ALL_FILTER, ...INDUSTRY_GROUPS.map((g) => g.label)];

  // Build flat client list with group info
  const clientsWithGroup = clients.map((client) => {
    const group = INDUSTRY_GROUPS.find((g) => g.ids.includes(client.id));
    return { client, group };
  });

  const filtered = activeFilter === ALL_FILTER
    ? clientsWithGroup
    : clientsWithGroup.filter(({ group }) => group?.label === activeFilter);

  const isRtl = lang === "ar-EG";

  return (
    <SiteLayout
      title={isRtl ? "أعمالنا" : "Work"}
      subtitle={
        isRtl
          ? "لقطات حية من مواقع عملائنا — مصنّفة حسب الصناعة والتخصص"
          : "Live screenshots of client websites — classified by industry and niche"
      }
    >
      <SeoHead
        title={`Work | ${site.name}`}
        description="Live portfolio of client websites by Adawaty — industrial, food, healthcare, education and technology sectors."
        path="/work"
        type="website"
      />

      {/* ── Filter tabs ── */}
      <div className="pt-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                activeFilter === f
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-white/4 border-white/10 text-muted-foreground hover:bg-white/8 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grouped or filtered client grid ── */}
      {activeFilter === ALL_FILTER ? (
        // Show all groups
        <div className="space-y-12">
          {INDUSTRY_GROUPS.map((group) => {
            const groupClients = clients.filter((c) => group.ids.includes(c.id));
            if (groupClients.length === 0) return null;
            return (
              <section key={group.label}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`h-0.5 w-8 rounded-full bg-current opacity-50`} />
                  <h2 className="text-base font-semibold">{isRtl ? group.labelAr : group.label}</h2>
                  <span className="text-xs text-muted-foreground">
                    {groupClients.length} {groupClients.length === 1 ? "client" : "clients"}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groupClients.map((client) => (
                    <ClientCard key={client.id} client={client} groupColor={group.badge} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // Filtered view
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ client, group }) => (
            <ClientCard
              key={client.id}
              client={client}
              groupColor={group?.badge ?? "bg-white/6 border-white/10 text-muted-foreground"}
            />
          ))}
        </div>
      )}

      {/* ── Case Studies ── */}
      <section className="mt-16">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {isRtl ? "دراسات حالة" : "Case Studies"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRtl
              ? "أمثلة مفصّلة توضح كيف نُنجز: وضوح، أنظمة، تنفيذ متميز"
              : "Detailed examples showing how we deliver: clarity, systems, premium execution"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Card className="glass premium-card rounded-2xl p-6 h-full flex flex-col hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <Badge className="bg-white/6 border border-white/10 text-foreground">
                    {c.category}
                  </Badge>
                  <span className="text-xs text-primary font-medium">{c.highlightMetric}</span>
                </div>
                <div className="mt-3 text-lg font-semibold leading-snug">{c.title}</div>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{c.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="text-xs rounded-full bg-white/6 border border-white/10 px-2.5 py-1"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <Button asChild className="w-full gap-2">
                    <Link href={`/work/${c.slug}`}>
                      {isRtl ? "عرض دراسة الحالة" : "View case study"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mt-16">
        <Card className="glass-strong rounded-2xl p-8 glow-border-teal text-center">
          <div className="text-xl font-semibold gradient-text-static">
            {isRtl ? "هل تريد نتائج مماثلة؟" : "Want similar results for your business?"}
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {isRtl
              ? "نقترح نطاق عمل DFY مع جدول زمني للسبرنت — مجاناً."
              : "We'll propose a DFY scope with a sprint timeline — at no cost."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="shadow-[0_0_40px_oklch(0.76_0.18_190/0.3)]">
              <Link href="/contact">
                {isRtl ? "ابدأ المحادثة" : "Start the conversation"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/6 hover:bg-white/10">
              <Link href="/pricing-calculator">
                {isRtl ? "احسب السعر" : "Get an estimate"}
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}
