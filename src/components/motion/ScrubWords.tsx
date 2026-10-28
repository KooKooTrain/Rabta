"use client";

import { useRef } from "react";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Scroll-scrubbed statement: every `[data-w]` word inside goes from the tone's
 * faded colour to full ink as you scroll. With `pin`, the block is pinned on
 * desktop while it fills (Wastetide manifesto). Reduced motion: static ink.
 */
export function ScrubWords({
  children,
  pin = false,
  className,
}: {
  children: React.ReactNode;
  pin?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const words = el.querySelectorAll<HTMLElement>("[data-w]");
      // GSAP can't tween var(); resolve the tone's colours to real values
      const css = getComputedStyle(el);
      const tone = (name: string) => css.getPropertyValue(name).trim();
      const mm = gsap.matchMedia();
      const fade = (opts: ScrollTrigger.Vars) =>
        gsap.fromTo(
          words,
          { color: tone("--t-fade") },
          {
            color: (_: number, w: HTMLElement) => tone(w.classList.contains("emph") ? "--t-emph" : "--t-fg"),
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, scrub: 0.6, ...opts },
          },
        );
      mm.add(MQ.desktop, () => {
        fade(pin ? { start: "center center", end: "+=110%", pin: true } : { start: "top 80%", end: "bottom 45%" });
      });
      mm.add(MQ.mobile, () => {
        fade({ start: "top 85%", end: "bottom 50%" });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [pin] },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
