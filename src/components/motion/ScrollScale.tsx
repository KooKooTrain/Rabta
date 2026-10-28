"use client";

import { useRef } from "react";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Scales its content up from `from` to 1 (and fades from 0.2) while it
 * scrolls into view, scrubbed. Used for giant section headlines.
 */
export function ScrollScale({
  children,
  from = 0.78,
  className,
}: {
  children: React.ReactNode;
  from?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ref.current,
          { scale: from, opacity: 0.2 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 95%", end: "top 35%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [from] },
  );

  return (
    <div ref={ref} className={cn("origin-center", className)}>
      {children}
    </div>
  );
}
