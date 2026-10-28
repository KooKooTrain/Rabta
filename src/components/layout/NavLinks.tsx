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
      <ul className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = current === item.id;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-[0.9375rem] text-muted transition-colors duration-[var(--dur-base)] ease-hover hover:text-fg",
                  "after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-[left_center] after:scale-x-0 after:bg-current after:transition-transform after:duration-[var(--dur-base)] after:ease-hover hover:after:scale-x-100 rtl:after:origin-[right_center]",
                  isActive && "text-fg after:scale-x-100",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full bg-saffron transition-[opacity,transform] duration-[var(--dur-base)] ease-out-soft",
                    isActive ? "scale-100 opacity-100" : "scale-0 opacity-0",
                  )}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
