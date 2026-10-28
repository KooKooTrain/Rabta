"use client";

import { useRef, type ReactNode } from "react";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/**
 * Wastetide pinned stack. Desktop (motion allowed): the section pins and each
 * card slides up over the previous one, which shrinks back so its edge shows.
 * Elsewhere the cards are a normal list that stacks with CSS `sticky`.
 * The `data-stack` attribute switches the layout only while the effect runs.
 */
export function HowStack({ heading, cards }: { heading: ReactNode; cards: ReactNode[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        el.setAttribute("data-stack", "");
        const items = gsap.utils.toArray<HTMLElement>("[data-card]", el);
        const headerH = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const below = () => window.innerHeight;
        gsap.set(items.slice(1), { y: below });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: `top top+=${Math.round(headerH - 16)}`,
            end: `+=${items.length * 85}%`,
            pin: true,
            scrub: 0.7,
          },
        });
        items.forEach((card, i) => {
          if (i === 0) return;
          tl.fromTo(card, { y: below }, { y: i * 22, immediateRender: false }, i - 1);
          for (let j = 0; j < i; j++) {
            tl.to(items[j], { scale: 1 - (i - j) * 0.045, y: j * 22, transformOrigin: "50% 0%" }, i - 1);
          }
        });
        tl.to({}, { duration: 0.35 }); // short hold before unpinning
        return () => el.removeAttribute("data-stack");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="group/how grid gap-10 lg:grid-cols-12 lg:gap-8 group-data-[stack]/how:lg:h-[calc(100svh-var(--header-h)+1rem)] group-data-[stack]/how:lg:items-center"
    >
      <div className="lg:col-span-5">{heading}</div>
      <ol className="flex flex-col gap-5 lg:col-span-7 group-data-[stack]/how:lg:relative group-data-[stack]/how:lg:block group-data-[stack]/how:lg:h-[min(36rem,72svh)]">
        {cards.map((card, i) => (
          <li
            key={i}
            data-card=""
            className="sticky group-data-[stack]/how:lg:absolute group-data-[stack]/how:lg:inset-x-0 group-data-[stack]/how:lg:top-0 group-data-[stack]/how:lg:h-[calc(100%-3rem)]"
            style={{ top: `calc(var(--header-h) + 1rem + ${i * 0.85}rem)`, zIndex: i + 1 }}
          >
            {card}
          </li>
        ))}
      </ol>
    </div>
  );
}
