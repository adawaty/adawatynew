/*
Adawaty — localized content helpers
- Keeps canonical IDs/URLs stable
- Provides per-language text for services/industries/personas/solutions/audiences/case studies
*/

import {
  type Lang,
} from "@/contexts/I18nContext";

import {
  services as servicesEn,
  industries as industriesEn,
  personas as personasEn,
  solutions as solutionsEn,
  audiences as audiencesEn,
  caseStudies as caseStudiesEn,
  type Service,
  type Industry,
  type PersonaPage,
  type Solution,
  type Audience,
  type CaseStudy,
} from "@/lib/content";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

function merge<T extends Record<string, any>>(base: T, patch?: DeepPartial<T>): T {
  if (!patch) return base;
  const out: any = Array.isArray(base) ? [...base] : { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) out[k] = v;
    else if (v && typeof v === "object" && base[k] && typeof base[k] === "object") out[k] = merge(base[k], v as any);
    else out[k] = v;
  }
  return out;
}

const patches: Partial<Record<Exclude<Lang, "en">, {
  services: Record<string, DeepPartial<Service>>;
  industries: Record<string, DeepPartial<Industry>>;
  personas: Record<string, DeepPartial<PersonaPage>>;
  solutions: Record<string, DeepPartial<Solution>>;
  audiences: Record<string, DeepPartial<Audience>>;
  caseStudies: Record<string, DeepPartial<CaseStudy>>;
}>> = {
  fr: {
    services: {
      "brand-intelligence": {
        title: "Intelligence de marque \u0026 Positionnement",
        summary: "Stratégie assistée par IA, menée par l’humain — un récit évident et mémorisable.",
        bullets: [
          "Positionnement + proposition de valeur (clarté)",
          "ICP + segments",
          "Architecture d’offre (packs/retainers)",
          "Carte narrative concurrents + différenciation",
        ],
      },
      "brand-system": {
        title: "Système de marque (Identité + Assets)",
        summary: "Un système visuel cohérent, avec des templates et des règles faciles à maintenir.",
        bullets: [
          "Logo/marque (si nécessaire)",
          "Typo + couleurs + règles de mise en page",
          "Templates social et documents",
          "Guide de marque (cohérence)",
        ],
      },
      "dfy-website": {
        title: "Site DFY (Premium + Rapide)",
        summary: "Design et développement end-to-end avec instrumentation de conversion.",
        bullets: ["Architecture UX", "Design system responsive", "Performance + SEO", "Analytics + tracking"],
      },
      "content-engine": {
        title: "Content Engine (IA + Relecture)",
        summary: "Création de contenu, planification et analyse — en workflow répétable.",
        bullets: ["Capture de voix + prompt kits", "Templates + calendrier éditorial", "Workflow d’approbation", "Itération basée sur performance"],
      },
      "ai-visibility": {
        title: "Visibilité Recherche + IA (SEO/AEO/LLMSEO)",
        summary: "Apparaître dans Google ET dans les assistants IA.",
        bullets: ["SEO on-page + technique", "AEO: requêtes conversationnelles", "Audit visibilité IA + benchmarks", "Suivi citations/mentions"],
      },
      concierge: {
        title: "Partenaire Concierge (Croissance)",
        summary: "Mises à jour VIP continues — pour ne jamais stagner après le lancement.",
        bullets: ["Updates prioritaires + tests", "Roadmap mensuelle", "Itérations contenu + SEO", "Gouvernance + documentation"],
      },
    },
    industries: {
      ecommerce: {
        title: "E-commerce",
        summary: "Transformer la découverte en confiance et conversion — UX CRO-ready et visibilité à l’ère IA.",
      },
      saas: {
        title: "SaaS",
        summary: "Positionnement et demande qui rendent un produit complexe évident — puis scale via contenu + visibilité IA.",
      },
      "real-estate": {
        title: "Immobilier",
        summary: "Systèmes DFY pour confiance, leads et visibilité locale + IA.",
      },
    },
    personas: {
      lawyers: {
        title: "Sites pour Avocats (Autorité + Consultations)",
        summary: "Site premium orienté confiance avec intake + réservation — conçu pour convertir la recherche en demandes.",
      },
      doctors: {
        title: "Sites pour Médecins \u0026 Cliniques (Confiance + RDV)",
        summary: "Pages patient-friendly, avis et planning — pour augmenter les RDV et réduire les no-shows.",
      },
      "business-owners": {
        title: "Web + Systèmes pour Dirigeants (Demande + Workflows)",
        summary: "Un front premium + workflows internes: dashboards, approvals, pipelines, ERP-lite.",
      },
    },
    solutions: {
      "app-development": { title: "Développement d’apps (Web + Mobile)" },
      "bio-pages": { title: "Bio Pages (Hub de marque personnelle)" },
      "scheduling-intake": { title: "Planning + Intake (Réservation qui marche)" },
      "erp-workflows": { title: "ERP-lite (Workflows autour de votre business)" },
    },
    audiences: {
      personal: { title: "Marque personnelle", summary: "Fondateurs, dirigeants et créateurs qui veulent une présence premium." },
      smb: { title: "PME", summary: "Des équipes qui ont besoin d’un système DFY brand + web + demande." },
      enterprise: { title: "Grandes entreprises", summary: "Des systèmes scalables avec gouvernance et transfert de ownership." },
    },
    caseStudies: {
      "personal-brand-rebuild": { title: "Refonte de site de marque personnelle", highlightMetric: "+2× leads entrants" },
      "smb-turnkey-launch": { title: "Lancement DFY pour PME", highlightMetric: "Lancement en 21 jours" },
      "ai-visibility-foundations": { title: "Fondations de visibilité IA", highlightMetric: "Hausse en 4 semaines" },
    },
  },
  es: {
    services: {
      "brand-intelligence": {
        title: "Inteligencia de Marca \u0026 Posicionamiento",
        summary: "Estrategia asistida por IA, liderada por humanos — narrativa clara y repetible.",
      },
      "brand-system": { title: "Sistema de Marca (Identidad + Assets)" },
      "dfy-website": { title: "Web DFY (Premium + Rápida)" },
      "content-engine": { title: "Content Engine (IA + Revisión)" },
      "ai-visibility": { title: "Visibilidad en Búsqueda + IA (SEO/AEO/LLMSEO)" },
      concierge: { title: "Partner Concierge" },
    },
    industries: {
      ecommerce: { title: "E-commerce" },
      saas: { title: "SaaS" },
      "real-estate": { title: "Bienes Raíces" },
    },
    personas: {
      lawyers: { title: "Webs para Abogados (Autoridad + Consultas)" },
      doctors: { title: "Webs para Médicos \u0026 Clínicas (Confianza + Citas)" },
      "business-owners": { title: "Web + Sistemas para Empresarios (Demanda + Workflows)" },
    },
    solutions: {
      "app-development": { title: "Desarrollo de Apps (Web + Móvil)" },
      "bio-pages": { title: "Bio Pages (Hub de Marca Personal)" },
      "scheduling-intake": { title: "Agenda + Intake (Reservas que funcionan)" },
      "erp-workflows": { title: "ERP-lite (Workflows a tu medida)" },
    },
    audiences: {
      personal: { title: "Marca personal" },
      smb: { title: "PyMEs" },
      enterprise: { title: "Empresas" },
    },
    caseStudies: {
      "personal-brand-rebuild": { title: "Rebuild de web de marca personal" },
      "smb-turnkey-launch": { title: "Lanzamiento turnkey para PyME" },
      "ai-visibility-foundations": { title: "Fundamentos de visibilidad IA" },
    },
  },
  de: {
    services: {
      "brand-intelligence": { title: "Brand Intelligence \u0026 Positionierung" },
      "brand-system": { title: "Brand System (Identität + Assets)" },
      "dfy-website": { title: "DFY Website (Premium + Schnell)" },
      "content-engine": { title: "Content Engine (KI + Review)" },
      "ai-visibility": { title: "Search + KI-Sichtbarkeit (SEO/AEO/LLMSEO)" },
      concierge: { title: "Concierge Partner" },
    },
    industries: {
      ecommerce: { title: "E-Commerce" },
      saas: { title: "SaaS" },
      "real-estate": { title: "Immobilien" },
    },
    personas: {
      lawyers: { title: "Websites für Anwälte (Autorität + Erstgespräch)" },
      doctors: { title: "Websites für Ärzte \u0026 Kliniken (Vertrauen + Termine)" },
      "business-owners": { title: "Web + Systeme für Unternehmer (Nachfrage + Workflows)" },
    },
    solutions: {
      "app-development": { title: "App-Entwicklung (Web + Mobile)" },
      "bio-pages": { title: "Bio-Seiten (Personal Brand Hub)" },
      "scheduling-intake": { title: "Scheduling + Intake" },
      "erp-workflows": { title: "ERP-lite (Workflows für Ihr Business)" },
    },
    audiences: {
      personal: { title: "Personal Branding" },
      smb: { title: "KMU" },
      enterprise: { title: "Enterprises" },
    },
    caseStudies: {
      "personal-brand-rebuild": { title: "Personal-Brand Website Rebuild" },
      "smb-turnkey-launch": { title: "KMU Turnkey Launch" },
      "ai-visibility-foundations": { title: "KI-Sichtbarkeit: Foundations" },
    },
  },
  "ar-EG": {
    services: {
      "brand-intelligence": {
        title: "ذكاء البراند والتمركز",
        summary: "استراتيجية بمساعدة AI بس قيادة بشرية — قصة واضحة وسهلة تتكرر.",
        bullets: [
          "تمركز + عرض قيمة (وضوح عالي)",
          "تحديد عميلك المثالي + تقسيمات",
          "بناء الباكدجات/الريتينر",
          "خريطة منافسين + فرق واضح",
        ],
      },
      "brand-system": {
        title: "نظام البراند (هوية + أصول)",
        summary: "هوية متماسكة مع قواعد وقوالب تقدر تحافظ عليها من غير وجع دماغ.",
        bullets: [
          "لوغو/مارك (لو محتاج)",
          "خطوط + ألوان + قواعد layout",
          "قوالب سوشيال وملفات",
          "Brand guidelines للاتساق",
        ],
      },
      "dfy-website": {
        title: "موقع DFY (بريميوم + سريع)",
        summary: "ديزاين + تطوير end-to-end مع قياس وتحسين التحويل.",
        bullets: ["هيكلة UX", "UI system ريسبونسف", "سرعة + SEO", "Analytics + tracking"],
      },
      "content-engine": {
        title: "Content Engine (AI + مراجعة)",
        summary: "كونتنت على البراند + تخطيط وجدولة — كـ workflow يتكرر.",
        bullets: ["ضبط نبرة البراند + prompt kits", "قوالب + تقويم محتوى", "مراجعة/اعتماد", "تحسين بناءً على الأداء"],
      },
      "ai-visibility": {
        title: "ظهور في البحث + الـAI (SEO/AEO/LLMSEO)",
        summary: "تطلع في جوجل وكمان في أنظمة المساعدة بالذكاء.",
        bullets: ["On-page SEO + تكنيكال", "AEO: أسئلة بصياغة بشرية", "Audit + مقارنة منافسين", "متابعة mentions/citations"],
      },
      concierge: {
        title: "Concierge Partner",
        summary: "متابعة VIP بعد الإطلاق: تحديثات وتجارب وتحسين مستمر.",
        bullets: ["تحديثات وتجارب سريعة", "Roadmap شهري", "دورات تحسين SEO/كونتنت", "توثيق وحوكمة"],
      },
    },
    industries: {
      ecommerce: {
        title: "E-commerce",
        summary: "تحويل الزيارات لثقة وشراء — UX + محتوى + ظهور في عصر الـAI.",
      },
      saas: {
        title: "SaaS",
        summary: "تمركز وطلب يخلي المنتج الوِحِش يبقى واضح — وبعدين scale بالكونتنت.",
      },
      "real-estate": {
        title: "عقارات",
        summary: "ثقة وليدز وظهور محلي + AI — بنظام DFY.",
      },
    },
    personas: {
      lawyers: {
        title: "مواقع للمحامين (ثقة + استشارات)",
        summary: "موقع بريميوم يبني ثقة بسرعة + intake وحجز — عشان البحث يبقى استشارات فعلًا.",
        pains: [
          "شكل الموقع زي أي مكتب تاني",
          "ليدز غلط (قضايا مش مناسبة)",
          "العميل بيتردد لأنه مش واثق",
          "مفيش صفحات بتستهدف نية البحث لكل تخصص",
        ],
        outcomes: [
          "صفحات تخصصات واضحة + proof",
          "حجز استشارة + فورم يفلتر ويروّت",
          "Local SEO + صفحات سلطة",
          "سيستم تقدر تحدّثه من غير ما الجودة تقع",
        ],
        successStories: [
          {
            id: "law-1",
            headline: "من موقع عادي → بايبلاين استشارات",
            context: "مكتب متوسط كان محتاج ليدز أجود وروتينج حسب نوع القضية.",
            timeframe: "6 أسابيع",
            results: [
              { label: "طلبات الاستشارة", value: "+41%" },
              { label: "استفسارات غلط", value: "−28%" },
              { label: "زمن أول رد", value: "−52%" },
            ],
            whatWeDid: [
              "هيكلة صفحات التخصصات حسب نية البحث",
              "صفحات سلطة: بروفايل محامين + إطار لنتايج/قضايا",
              "فورم intake بقواعد routing حسب نوع القضية",
              "Local SEO + FAQ للأسئلة عالية النية",
            ],
          },
          {
            id: "law-2",
            headline: "Bio hub لمحامي كبير يحوّل الإحالات",
            context: "محامي كبير كان عايز صفحة واحدة بريميوم للإحالات وترافيك الميديا.",
            timeframe: "5 أيام",
            results: [
              { label: "مكالمات محجوزة من الإحالات", value: "+23%" },
              { label: "CTR من روابط واتساب", value: "+18%" },
              { label: "Drop-off على الموبايل", value: "−17%" },
            ],
            whatWeDid: [
              "Credibility stack فوق (خبرة/اعتمادات/ميديا)",
              "CTA واحد أساسي (حجز) + CTA ثانوي (واتساب)",
              "Tracking بالأحداث و UTM عشان نعرف المصدر",
            ],
          },
        ],
      },
      doctors: {
        title: "مواقع للدكاترة والعيادات (ثقة + حجز)",
        summary: "صفحات خدمات مفهومة للمريض + مراجعات + حجز — تقلل no-shows وتزود المواعيد.",
        pains: [
          "المريض مش فاهم يختار إيه",
          "الحجز يدوي وفيه no-shows",
          "ظهور ضعيف قدام المنافسين",
          "الموقع قديم وبيهز الثقة",
        ],
        outcomes: [
          "صفحات خدمات + FAQ بتجاوب",
          "حجز أونلاين + تأكيدات وتذكير",
          "فروع + مراجعات + Local SEO",
          "محتوى يزود الثقة في جوجل والـAI",
        ],
        successStories: [
          {
            id: "med-1",
            headline: "مواعيد أكتر… وno-shows أقل",
            context: "عيادة كانت محتاجة تجربة أوضح للمريض + سيستم حجز يقلل الاحتكاك.",
            timeframe: "8 أسابيع",
            results: [
              { label: "مواعيد محجوزة", value: "+34%" },
              { label: "نسبة عدم الحضور", value: "−21%" },
              { label: "مكالمات أسئلة بسيطة", value: "−29%" },
            ],
            whatWeDid: [
              "صفحات خدمات + FAQ كمسار قرار للمريض",
              "حجز مع buffers + تأكيد + reminders",
              "Local SEO للفروع والمراجعات والكيانات",
              "قياس: booked → showed → converted",
            ],
          },
          {
            id: "med-2",
            headline: "Bio page لدكتور يبني ثقة بسرعة",
            context: "دكتور متخصص كان عايز صفحة تجمع السوشيال والإعلانات والإحالات.",
            timeframe: "4 أيام",
            results: [
              { label: "وقت على الصفحة", value: "+27%" },
              { label: "تحويل الحجز", value: "+19%" },
              { label: "Bounce rate", value: "−14%" },
            ],
            whatWeDid: [
              "Trust stack فوق: تخصص + اعتمادات + نتايج",
              "FAQ لأسئلة المرضى الشائعة",
              "أداء موبايل سريع + خطوة واضحة",
            ],
          },
        ],
      },
      "business-owners": {
        title: "ويب + سيستم لرجال الأعمال (طلب + ووركفلو)",
        summary: "واجهة بريميوم + السيستم اللي وراها: داشبورد، موافقات، بايبلاين، و ERP-lite.",
        pains: [
          "التسويق متقطع ومش بيتقاس",
          "الفريق شغال واتساب وإكسيل",
          "العمليات بتبوظ مع النمو",
          "عايز سيستم ماشي مع شغلك بسرعة",
        ],
        outcomes: [
          "قصة واحدة عبر السيلز والموقع",
          "تتبع وتقارير واضحة",
          "سيستم مبني على ووركفلو حقيقي",
          "أتمتة تقلل الشغل اليدوي",
        ],
        successStories: [
          {
            id: "biz-1",
            headline: "ERP-lite اتعمل على مقاس الشغل",
            context: "شركة SME شغالة بإكسيل كانت محتاجة موافقات وبايبلاين وتقارير من غير ERP تقيل.",
            timeframe: "10 أسابيع",
            results: [
              { label: "handoffs يدوي", value: "−36%" },
              { label: "وقت تقرير أسبوعي", value: "−48%" },
              { label: "التسليم في ميعاده", value: "+12%" },
            ],
            whatWeDid: [
              "Workflow mapping (as-is → to-be) مع صلاحيات",
              "Dashboards للبايبلاين والموافقات والاستثناءات",
              "Integrations تقلل إدخال البيانات مرتين",
            ],
          },
          {
            id: "biz-2",
            headline: "Client portal MVP الناس بتستخدمه",
            context: "شركة خدمات كانت محتاجة portal للطلبات والستاتس والدفع.",
            timeframe: "6 أسابيع",
            results: [
              { label: "تذاكر دعم", value: "−22%" },
              { label: "شراء متكرر", value: "+16%" },
              { label: "زمن عمل عرض سعر", value: "−31%" },
            ],
            whatWeDid: [
              "هيكلة بسيطة: مهمة واحدة أساسية في كل شاشة",
              "Tracking للأحداث عشان نعرف التسرب",
              "تحسين onboarding لرفع activation",
            ],
          },
        ],
      },
    },
    solutions: {
      "app-development": { title: "تطوير تطبيقات (ويب + موبايل)" },
      "bio-pages": { title: "Bio Pages (صفحة شخصية بتبيع)" },
      "scheduling-intake": { title: "حجز + Intake" },
      "erp-workflows": { title: "ERP-lite (سيستم ماشي مع شغلك)" },
    },
    audiences: {
      personal: { title: "براند شخصي" },
      smb: { title: "شركات صغيرة/متوسطة" },
      enterprise: { title: "مؤسسات" },
    },
    caseStudies: {
      "personal-brand-rebuild": { title: "تجديد موقع براند شخصي" },
      "smb-turnkey-launch": { title: "إطلاق DFY لشركة" },
      "ai-visibility-foundations": { title: "أساسيات ظهور AI" },
    },
  },
};

function localizeArray<T extends { id?: string; slug?: string }>(lang: Lang, base: T[], table: Record<string, DeepPartial<T>>): T[] {
  if (lang === "en") return base;
  const patchTable = (patches as any)[lang]?.[table === (patches as any)[lang]?.services ? "services" : ""];
  return base.map((item: any) => {
    const key = item.id ?? item.slug;
    const patch = table[key];
    return merge(item, patch);
  });
}

export function getServices(lang: Lang): Service[] {
  if (lang === "en") return servicesEn;
  const table = (patches as any)[lang]?.services as Record<string, any> | undefined;
  if (!table) return servicesEn;
  return servicesEn.map((s) => merge(s, table[s.id]));
}

export function getIndustries(lang: Lang): Industry[] {
  if (lang === "en") return industriesEn;
  const table = (patches as any)[lang]?.industries as Record<string, any> | undefined;
  if (!table) return industriesEn;
  return industriesEn.map((x) => merge(x, table[x.id]));
}

export function getPersonas(lang: Lang): PersonaPage[] {
  if (lang === "en") return personasEn;
  const table = (patches as any)[lang]?.personas as Record<string, any> | undefined;
  if (!table) return personasEn;
  return personasEn.map((x) => merge(x, table[x.id]));
}

export function getSolutions(lang: Lang): Solution[] {
  if (lang === "en") return solutionsEn;
  const table = (patches as any)[lang]?.solutions as Record<string, any> | undefined;
  if (!table) return solutionsEn;
  return solutionsEn.map((x) => merge(x, table[x.id]));
}

export function getAudiences(lang: Lang): Audience[] {
  if (lang === "en") return audiencesEn;
  const table = (patches as any)[lang]?.audiences as Record<string, any> | undefined;
  if (!table) return audiencesEn;
  return audiencesEn.map((x) => merge(x, table[x.id]));
}


export function getCaseStudyBySlug(lang: Lang, slug: string): CaseStudy | undefined {
  return getCaseStudies(lang).find((c) => c.slug === slug);
}

export function getCaseStudies(lang: Lang): CaseStudy[] {
  if (lang === "en") return caseStudiesEn;
  const table = (patches as any)[lang]?.caseStudies as Record<string, any> | undefined;
  if (!table) return caseStudiesEn;
  return caseStudiesEn.map((x) => merge(x, table[x.slug]));
}
