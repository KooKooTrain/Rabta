"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Chande-style slider: horizontal snap row with a lime progress bar and square
 * prev/next buttons below lg. At lg+ the cards sit in a grid and the controls hide.
 */
export function TeamSlider({ children, count }: { children: ReactNode; count: number }) {
  const ref = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? Math.abs(el.scrollLeft) / max : 1);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const rtl = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    el.scrollBy({ left: dir * rtl * (card.getBoundingClientRect().width + 16), behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={ref}
        data-lenis-prevent-wheel=""
        className="-mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:gap-8 lg:overflow-visible lg:px-0"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {children}
      </ul>
      <div className="mt-8 flex items-stretch gap-px lg:hidden">
        <div className="relative h-11 flex-1 bg-surface" aria-hidden="true">
          <span
            className="absolute inset-y-0 start-0 bg-lime transition-[width] duration-[var(--dur-base)] ease-hover"
            style={{ width: `${Math.max(progress, 1 / Math.max(count, 1)) * 100}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => step(-1)}
          className="grid size-11 place-items-center bg-lime text-ink transition-colors hover:bg-paper"
        >
          <ChevronLeft aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          <span className="sr-only">Previous member</span>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="grid size-11 place-items-center bg-lime text-ink transition-colors hover:bg-paper"
        >
          <ChevronRight aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          <span className="sr-only">Next member</span>
        </button>
      </div>
    </div>
  );
}
