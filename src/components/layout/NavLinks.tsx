"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Desktop nav. Highlights the section currently in view (home page only). */
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

  return (
    <nav aria-label="Primary" className={cn("items-center", className)}>
      <ul className="flex items-center">
        {navItems.map((item, i) => {
          const isActive = current === item.id;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "label-mono inline-flex items-baseline gap-1.5 px-3 py-2 transition-colors duration-[var(--dur-base)] ease-hover",
                  isActive ? "bg-fg text-bg" : "text-fg hover:bg-fg/[0.07]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("text-[0.625rem]", isActive ? "text-signal" : "text-accent-text")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
