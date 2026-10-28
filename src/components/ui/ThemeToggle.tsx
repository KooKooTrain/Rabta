"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Round light/dark switch. Saves the choice; otherwise follows the OS. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, getTheme, () => null);
  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-pressed={theme === null ? undefined : dark}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "relative inline-grid size-10 shrink-0 place-items-center overflow-hidden rounded-pill border border-line-strong text-fg transition-colors duration-[var(--dur-base)] ease-hover hover:border-fg hover:bg-fg hover:text-bg",
        className,
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(
          "col-start-1 row-start-1 size-[1.125rem] transition-[transform,opacity] duration-[var(--dur-slow)] ease-scale",
          dark ? "rotate-0 opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "col-start-1 row-start-1 size-[1.125rem] transition-[transform,opacity] duration-[var(--dur-slow)] ease-scale",
          dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 opacity-100",
        )}
      />
      <span className="sr-only">Dark mode</span>
    </button>
  );
}
