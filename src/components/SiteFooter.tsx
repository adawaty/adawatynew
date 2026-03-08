/*
Cairo Circuit Futurism — SiteFooter (updated)
*/

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail, Phone, ArrowUpRight } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <div className="text-lg font-semibold">Adawaty</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Elite DFY studio delivering Brand → Build → Demand: positioning, identity, premium websites, content workflows, and Search + AI Visibility.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                  <a href="mailto:alazzeh.ml@gmail.com">
                    <Mail className="mr-2 h-4 w-4" /> Email
                  </a>
                </Button>
                <Button asChild variant="secondary" className="bg-white/6 hover:bg-white/10">
                  <a href="tel:+201000000000">
                    <Phone className="mr-2 h-4 w-4" /> Call
                  </a>
                </Button>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <div className="text-sm font-medium">Studio</div>
                <div className="mt-2 flex flex-col gap-2 text-sm">
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                  <Link href="/work" className="text-muted-foreground hover:text-foreground">
                    Work
                  </Link>
                  <Link href="/industries" className="text-muted-foreground hover:text-foreground">
                    Industries
                  </Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Services</div>
                <div className="mt-2 flex flex-col gap-2 text-sm">
                  <Link href="/services/brand-intelligence" className="text-muted-foreground hover:text-foreground">
                    Brand Intelligence
                  </Link>
                  <Link href="/services/brand-system" className="text-muted-foreground hover:text-foreground">
                    Brand System
                  </Link>
                  <Link href="/services/dfy-website" className="text-muted-foreground hover:text-foreground">
                    DFY Website
                  </Link>
                  <Link href="/services/content-engine" className="text-muted-foreground hover:text-foreground">
                    Content Engine
                  </Link>
                  <Link href="/services/ai-visibility" className="text-muted-foreground hover:text-foreground">
                    Search + AI Visibility
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Get started</div>
                <div className="mt-2 flex flex-col gap-2 text-sm">
                  <Link className="text-muted-foreground hover:text-foreground inline-flex items-center" href="/contact">
                    Book a call <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 circuit-divider" />
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Adawaty. All rights reserved.</div>
            <div className="text-xs text-muted-foreground">Brand → Build → Demand. DFY for founders and teams.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
