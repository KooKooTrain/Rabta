"use client";

import { useRef } from "react";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Giant footer wordmark whose letters rise in a stagger when it enters view. */
export function WordmarkReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-ch]", {
          yPercent: 105,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.045,
          scrollTrigger: { trigger: ref.current, start: "top bottom", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} aria-hidden="true" className={cn("flex overflow-clip", className)}>
      {Array.from(text).map((ch, i) => (
        <span key={i} data-ch="" className="inline-block whitespace-pre">
          {ch}
        </span>
      ))}
    </p>
  );
}
