"use client";

import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { setTheme, getTheme, subscribeTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useSyncExternalStore } from "react";
import { useWorkspacePreferences } from "@/components/demo/WorkspacePreferences";

const pageNames: Record<string, string> = {
  "/demo": "Game",
  "/demo/history": "History",
  "/demo/family": "Family",
  "/demo/schedule": "Schedule",
  "/demo/settings": "Settings",
};

export function DemoHeader() {
  const pathname = usePathname();
  const { language } = useWorkspacePreferences();
  const page = pageNames[pathname] ?? "Game";
  const translatedPage = language === "ar" ? ({ Game: "اللعبة", History: "السجل", Family: "العائلة", Schedule: "الجدول", Settings: "الإعدادات" }[page] ?? page) : page;
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, getTheme, () => null);
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-40 h-[4.5rem] border-b border-line bg-bg/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Logo href="/demo" className="shrink-0 [&>span]:font-sans [&>span]:text-2xl [&>span]:font-semibold [&>span]:tracking-[-0.06em] [&>span]:normal-case" />
          <span aria-hidden="true" className="h-6 w-px shrink-0 bg-line-strong" />
          <h1 className="truncate text-xs font-medium uppercase tracking-[0.16em] text-muted sm:text-sm">{translatedPage}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <Link href="/" className="inline-flex items-center gap-2 rounded-pill text-sm text-muted transition-colors hover:text-fg">
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">{language === "ar" ? "العودة إلى الموقع" : "Back to site"}</span>
          </Link>
          <span aria-hidden="true" className="h-6 w-px bg-line-strong" />
          <div role="group" aria-label="Color theme" className="flex items-center gap-2.5 sm:gap-3">
            <button type="button" onClick={() => setTheme("light")} aria-label="Light mode" aria-pressed={theme === "light"} className={cn("grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg", !isDark && "bg-fg/5 text-fg")}>
              <Sun aria-hidden="true" className="size-[1.1rem]" />
            </button>
            <button type="button" onClick={() => setTheme("dark")} aria-label="Dark mode" aria-pressed={theme === "dark"} className={cn("grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg", isDark && "bg-fg/5 text-fg")}>
              <Moon aria-hidden="true" className="size-[1.05rem]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
