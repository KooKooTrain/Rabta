"use client";

import { useRef } from "react";
import { MQ, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Children marked `[data-scatter]` fly in from below with a random tilt and
 * settle, staggered, as they enter the viewport (Chande stamp collage).
 * Reduced motion: no animation.
 */
export function ScatterIn({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-scatter]", ref.current);
        gsap.set(items, {
          autoAlpha: 0,
          y: () => gsap.utils.random(90, 180),
          rotation: () => gsap.utils.random(-22, 22),
          scale: 0.86,
        });
        ScrollTrigger.batch(items, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
