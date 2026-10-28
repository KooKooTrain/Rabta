"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole app. Any element with `data-reveal` fades/rises in
 * when it enters the viewport (styles in globals.css). Set `style={{"--i": n}}`
 * for stagger. Mounted once in the root layout; renders nothing.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    const observeAll = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-shown])")
        .forEach((el) => io.observe(el));

    observeAll();
    // Pick up elements added later (client navigation, streamed content)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
