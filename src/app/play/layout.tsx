import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Play",
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-tone="paper" className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 h-14 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="flex h-full items-center gap-3 px-4 lg:px-6">
          <Logo className="[&>span]:text-[1.0625rem]" />
          <span className="label-caps rounded-pill bg-fg px-2.5 py-1 text-bg">[ Game day ]</span>
          <Link
            href="/"
            className="ms-auto inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm text-muted transition-colors duration-[var(--dur-fast)] hover:bg-fg/5 hover:text-fg"
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            <span className="hidden sm:inline">Back to site</span>
            <span className="sm:hidden">Site</span>
          </Link>
          <ThemeToggle className="size-9" />
        </div>
      </header>
      <main id="main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
        {children}
      </main>
    </div>
  );
}
