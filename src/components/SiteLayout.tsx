/*
Cairo Circuit Futurism — Layout shell
*/

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-primary"
      >
        Skip to content
      </a>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-radial-glow" />

      <SiteHeader />

      {(title || subtitle) && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12">
          <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p> : null}
          <div className="mt-8 circuit-divider" />
        </div>
      )}

      <main id="main" className="mx-auto max-w-6xl px-4 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
