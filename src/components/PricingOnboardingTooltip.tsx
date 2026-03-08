/*
Pricing calculator onboarding tooltip (runs once)
*/

import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const STORAGE_KEY = "adawaty_pricing_onboarding_v1";

export default function PricingOnboardingTooltip() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;
    const t = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          aria-label="How pricing works"
        >
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end" className="max-w-sm">
        <div className="grid gap-2">
          <div className="font-semibold">How to use this calculator</div>
          <div className="text-sm text-muted-foreground">
            1) Choose <strong>Web presence</strong> for a website/bio + hosting.
            <br />
            2) Choose <strong>Systems</strong> for internal tools, LMS, video, or anything custom.
            <br />
            3) Use <strong>Export</strong> to generate a serial so we can review your exact selection.
          </div>
          <div className="pt-1">
            <Button
              size="sm"
              onClick={() => {
                localStorage.setItem(STORAGE_KEY, "1");
                setOpen(false);
              }}
            >
              Got it
            </Button>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
