"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useWorkspacePreferences } from "@/components/demo/WorkspacePreferences";

const routes: Record<string, string> = {
  Analyze: "/demo",
  History: "/demo/history",
  Family: "/demo/family",
  Schedule: "/demo/schedule",
  Settings: "/demo/settings",
};
const arabicLabels: Record<string, string> = { Analyze: "تحليل", History: "السجل", Family: "العائلة", Schedule: "الجدول", Settings: "الإعدادات" };

export function DemoSidebar({ items }: { items: { label: string; icon: IconName }[] }) {
  const pathname = usePathname();
  const { language } = useWorkspacePreferences();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("sticky top-[4.5rem] flex h-[calc(100dvh-4.5rem)] w-14 shrink-0 flex-col border-e border-line bg-bg transition-[width] duration-200 lg:w-60", collapsed && "lg:w-[4.75rem]")}>
      <div className={cn("flex h-16 items-center border-b border-line px-2 lg:px-3", collapsed ? "justify-center" : "justify-center lg:justify-between lg:px-5")}>
        {!collapsed && <p className="hidden text-xs font-medium uppercase tracking-[0.14em] text-subtle lg:block">{language === "ar" ? "مساحة العمل" : "Workspace"}</p>}
        <button type="button" onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} title={collapsed ? "Expand navigation" : "Collapse navigation"} className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg">
          {collapsed ? <ChevronRight aria-hidden="true" className="size-4" /> : <ChevronLeft aria-hidden="true" className="size-4" />}
        </button>
      </div>
      <nav aria-label="Workspace pages" className="flex-1 p-3">
        <ul className="flex flex-col gap-1.5">
          {items.map(({ label, icon }) => {
            const href = routes[label] ?? "/demo";
            const active = pathname === href;
            return <li key={label}>
              <Link href={href} aria-label={language === "ar" ? arabicLabels[label] : label} aria-current={active ? "page" : undefined} title={collapsed || undefined ? (language === "ar" ? arabicLabels[label] : label) : undefined} className={cn("flex min-h-11 items-center rounded-xl text-sm font-medium transition-colors", collapsed ? "justify-center px-2 lg:px-2" : "justify-center gap-3 px-3.5 lg:justify-start", active ? "bg-fg text-bg" : "text-muted hover:bg-fg/5 hover:text-fg")}>
                <Icon name={icon} className="size-[1.1rem] shrink-0" />
                {!collapsed && <span className="hidden lg:inline">{language === "ar" ? arabicLabels[label] : label}</span>}
              </Link>
            </li>;
          })}
        </ul>
      </nav>
      <div className={cn("border-t border-line p-3", collapsed && "px-2")}>
        <div className={cn("rounded-xl bg-soft text-muted", collapsed ? "grid size-10 place-items-center" : "grid size-10 place-items-center lg:block lg:h-auto lg:w-auto lg:p-4")} title={collapsed ? "Sample data" : undefined}>
          <Icon name="database" className="size-4" />
          {!collapsed && <div className="hidden lg:block"><p className="mt-2 text-xs font-medium text-fg">{language === "ar" ? "بيانات تجريبية" : "Sample data"}</p><p className="mt-1 text-xs leading-relaxed">{language === "ar" ? "كل ما يظهر هنا للتوضيح فقط." : "Everything here is illustrative. No real family data is used."}</p></div>}
        </div>
      </div>
    </aside>
  );
}
