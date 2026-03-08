/*
Cairo Circuit Futurism — SEO Head helper
- Generates crawlable meta, canonical, OpenGraph, and JSON-LD
- Used per route to improve classic SEO + AI Overviews eligibility
*/

import { Helmet } from "react-helmet-async";
import { site } from "@/lib/content";
import { useI18n } from "@/contexts/I18nContext";

export type SeoProps = {
  title: string;
  description: string;
  path?: string; // leading slash
  image?: string; // absolute URL
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: unknown;
};

export default function SeoHead({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noindex,
  jsonLd,
}: SeoProps) {
  const { lang } = useI18n();
  const urlObj = new URL(path, site.url);
  urlObj.searchParams.set("lang", lang);
  const url = urlObj.toString();
  const ogImage = image ?? new URL("/og.png", site.url).toString();

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en" href={new URL(path, site.url).toString() + "?lang=en"} />
      <link rel="alternate" hrefLang="fr" href={new URL(path, site.url).toString() + "?lang=fr"} />
      <link rel="alternate" hrefLang="es" href={new URL(path, site.url).toString() + "?lang=es"} />
      <link rel="alternate" hrefLang="de" href={new URL(path, site.url).toString() + "?lang=de"} />
      <link rel="alternate" hrefLang="ar" href={new URL(path, site.url).toString() + "?lang=ar"} />
      <link rel="alternate" hrefLang="x-default" href={new URL(path, site.url).toString() + "?lang=en"} />

      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
