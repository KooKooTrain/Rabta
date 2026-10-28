"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Demo navigation from site.demo.nav. Items are buttons that only switch the
 * highlighted state today. Tomorrow they can become real routes
 * (app/demo/<name>/page.tsx + <Link>) or drive tabs inside page.tsx.
 */
export function DemoSidebar({ items }: { items: { label: string; icon: IconName }[] }) {
  const [active, setActive] = useState(0);

  const item = (it: { label: string; icon: IconName }, i: number, layout: "row" | "col") => (
    <li key={it.label} className={layout === "row" ? "shrink-0" : undefined}>
      <button
        type="button"
        onClick={() => setActive(i)}
        aria-current={active === i ? "true" : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-pill text-sm font-medium transition-colors duration-[var(--dur-fast)] ease-hover",
          layout === "col" ? "w-full px-3 py-2.5" : "px-3.5 py-2",
          active === i
            ? "bg-fg text-bg"
            : "text-muted hover:bg-fg/5 hover:text-fg",
        )}
      >
        <Icon name={it.icon} className="size-4" />
        {it.label}
      </button>
    </li>
  );

  return (
    <>
      {/* < lg: horizontal scrollable tabs */}
      <nav aria-label="Prototype sections" className="border-b border-line lg:hidden">
        <ul className="flex gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
          {items.map((it, i) => item(it, i, "row"))}
        </ul>
      </nav>

      {/* ≥ lg: sidebar */}
      <aside className="hidden w-60 shrink-0 border-e border-line lg:block">
        <nav
          aria-label="Prototype sections"
          className="sticky top-14 flex h-[calc(100dvh-3.5rem)] flex-col gap-6 p-4"
        >
          <p className="label-mono px-3 pt-2 text-subtle">Workspace</p>
          <ul className="-mt-3 flex flex-col gap-1">{items.map((it, i) => item(it, i, "col"))}</ul>
          <div className="mt-auto rounded-tile bg-soft p-4">
            <p className="label-mono text-subtle">Sample data</p>
            <p className="mt-2 text-sm text-muted">
              Everything shown here is illustrative. No real family data is used.
            </p>
          </div>
        </nav>
      </aside>
    </>
  );
}
