"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Slider: horizontal snap row with an brand progress bar and round prev/next
 * buttons below xl. At xl+ the cards sit in one row and the controls hide.
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
        // Only sideways swipes scroll the row natively; vertical wheel stays
        // with Lenis (prevent-wheel made the page jump and stick over it)
        data-lenis-prevent-horizontal=""
        className="-mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] pt-2 pb-4 [scrollbar-width:none] xl:mx-0 xl:grid xl:gap-6 xl:overflow-visible xl:px-0"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {children}
      </ul>
      <div className="mt-8 flex items-center gap-2 xl:hidden">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface" aria-hidden="true">
          <span
            className="absolute inset-y-0 start-0 rounded-full bg-accent transition-[width] duration-[var(--dur-base)] ease-hover"
            style={{ width: `${Math.max(progress, 1 / Math.max(count, 1)) * 100}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => step(-1)}
          className="grid size-11 place-items-center rounded-full bg-accent text-accent-fg transition-colors hover:bg-fg hover:text-bg"
        >
          <ChevronLeft aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          <span className="sr-only">Previous member</span>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="grid size-11 place-items-center rounded-full bg-accent text-accent-fg transition-colors hover:bg-fg hover:text-bg"
        >
          <ChevronRight aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          <span className="sr-only">Next member</span>
        </button>
      </div>
    </div>
  );
}
