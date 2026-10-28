"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Desktop nav: plain tabs with one underline that slides to the section
 * currently in view (home page only).
 */
export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const els = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    // Active = last nav section whose top has passed 40% of the viewport.
    // Scroll-based (not IntersectionObserver) so fast scrolls never leave it stale.
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let id: string | null = null;
      for (const el of els) if (el.getBoundingClientRect().top <= line) id = el.id;
      setActive(id);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const current = pathname === "/" ? active : null;

  // Underline: measure the active tab and move one bar under it
  const listRef = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const el = current ? list.querySelector<HTMLElement>(`[data-nav="${current}"]`) : null;
      setBar(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [current]);

  return (
    <nav aria-label="Primary" className={cn("items-stretch", className)}>
      <ul ref={listRef} className="relative flex items-stretch gap-1">
        {navItems.map((item) => {
          const isActive = current === item.id;
          return (
            <li key={item.id} className="flex">
              <Link
                href={item.href}
                data-nav={item.id}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative inline-flex items-center px-3 text-[0.9375rem] font-medium transition-colors duration-[var(--dur-base)] ease-hover",
                  "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-line-strong after:transition-transform after:duration-[var(--dur-base)] after:ease-hover hover:after:scale-x-100",
                  isActive ? "text-fg after:opacity-0" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-full bg-accent transition-[transform,width,opacity] duration-[var(--dur-slow)] ease-out-soft"
          style={{
            width: bar ? bar.w - 24 : 0,
            transform: `translateX(${bar ? bar.x + 12 : 0}px)`,
            opacity: bar ? 1 : 0,
          }}
        />
      </ul>
    </nav>
  );
}
