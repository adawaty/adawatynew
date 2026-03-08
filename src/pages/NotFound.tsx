/*
Cairo Circuit Futurism — NotFound (updated)
*/

import SiteLayout from "@/components/SiteLayout";
import SeoHead from "@/components/SeoHead";
import { site } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <SiteLayout title="Page not found" subtitle="The page you requested does not exist.">
      <SeoHead title={`404 | ${site.name}`} description="Page not found." path="/404" noindex />
      <div className="pt-10 flex flex-wrap gap-2">
        <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
          <Link href="/work">View work</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}
