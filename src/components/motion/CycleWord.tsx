"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Cycles through words with a masked vertical slide. All words share one grid
 * cell, so the widest word reserves the space (no layout shift). Decorative:
 * pair it with an sr-only static sentence.
 */
export function CycleWord({
  words,
  interval = 2400,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActive((a) => (a + 1) % words.length);
      }
    }, interval);
    return () => window.clearInterval(timer);
  }, [reduced, words.length, interval]);

  return (
    <span
      aria-hidden="true"
      className={cn("inline-grid overflow-clip align-bottom [overflow-clip-margin:0.15em]", className)}
    >
      {words.map((w, i) => {
        const state = i === active ? "in" : i === (active - 1 + words.length) % words.length ? "out" : "wait";
        return (
          <span
            key={w}
            className={cn(
              "col-start-1 row-start-1 transition-[transform,opacity] duration-[var(--dur-slower)] ease-out-soft",
              state === "in" && "translate-y-0 opacity-100",
              state === "out" && "-translate-y-full opacity-0",
              state === "wait" && "translate-y-full opacity-0",
            )}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}
