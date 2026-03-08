/*
Back-to-top button
- Appears after the user scrolls down
- Uses existing Button styles for consistency
*/

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        type="button"
        size="icon"
        className="rounded-full shadow-[0_0_30px_oklch(0.73_0.16_190/0.25)]"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
