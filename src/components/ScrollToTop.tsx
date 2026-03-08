/*
Scroll-to-top on navigation
- Wouter keeps scroll position by default (SPA behavior)
- This restores expected "new page loads at top" UX
*/

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // next frame for layout stability
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    });
  }, [location]);

  return null;
}
