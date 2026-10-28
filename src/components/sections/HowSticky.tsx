"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Desktop (lg+) scrollytelling: the left column sticks and crossfades between
 * `mocks` as each `[data-step]` element in `children` crosses the viewport centre.
 * Below lg the mock column is hidden and steps carry their own compact mocks.
 */
export function HowSticky({ mocks, children }: { mocks: ReactNode[]; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    root.setAttribute("data-how-dim", "");
    steps[0]?.setAttribute("data-active", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number((entry.target as HTMLElement).dataset.step);
          steps.forEach((s, j) => s.toggleAttribute("data-active", j === i));
          setActive(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      root.removeAttribute("data-how-dim");
    };
  }, []);

  return (
    <div ref={rootRef} className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--header-h)+2.5rem)] grid">
          {mocks.map((mock, i) => (
            <div
              key={i}
              aria-hidden={i !== active}
              className={cn(
                "[grid-area:1/1] transition-[opacity,transform] duration-[var(--dur-slow)] ease-out-soft",
                i === active ? "opacity-100" : "pointer-events-none translate-y-3 scale-[0.98] opacity-0",
              )}
            >
              {mock}
            </div>
          ))}
          <ol className="mt-5 flex gap-2" aria-hidden="true">
            {mocks.map((_, i) => (
              <li
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-pill transition-colors duration-[var(--dur-slow)] ease-out-soft",
                  i <= active ? "bg-accent" : "bg-line",
                )}
              />
            ))}
          </ol>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:col-span-6 lg:col-start-7 lg:gap-0">{children}</div>
    </div>
  );
}
