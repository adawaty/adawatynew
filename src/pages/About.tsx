/*
Cairo Circuit Futurism — About (updated)
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <SiteLayout
      title="Studio"
      subtitle="Adawaty is a DFY branding, website development, and solutions studio—your consultancy partner beyond digital transformation."
    >
      <SeoHead
        title={`Studio | ${site.name}`}
        description="About Adawaty: an elite DFY studio delivering Brand → Build → Demand with sprint delivery, systems, templates, and AI visibility."
        path="/about"
        type="website"
      />
      <section className="pt-10">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="glass premium-card rounded-2xl p-7 lg:col-span-2">
            <div className="text-lg font-semibold">What we do</div>
            <p className="mt-2 text-sm text-muted-foreground">
              We build premium brand and web systems end-to-end. That means we can define positioning and messaging,
              create the identity, design and develop the website, and deliver a launch kit—without handoffs.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              On top of that, we bring AI enablement in a friendly, practical way: voice kits, workflows, and guardrails so
              you can scale output without losing quality.
            </p>

            <div className="mt-6 circuit-divider" />

            <div className="mt-6 text-lg font-semibold">How we work</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                {
                  t: "Clarity first",
                  d: "Positioning and messaging before visuals.",
                },
                {
                  t: "Systems, not assets",
                  d: "We deliver reusable templates and rules.",
                },
                {
                  t: "Sprint delivery",
                  d: "Fast progress with stakeholder alignment.",
                },
                {
                  t: "Enablement",
                  d: "AI workflows + handover so you keep momentum.",
                },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border border-white/10 bg-white/3 p-5">
                  <div className="text-sm font-semibold">{x.t}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{x.d}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass premium-card rounded-2xl p-7">
            <div className="text-lg font-semibold">Who we serve</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Personal brands, SMBs, and enterprises looking for turnkey outcomes.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {[
                "Founders, executives, creators",
                "Product and service businesses",
                "Enterprise teams that need scalable systems",
              ].map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
