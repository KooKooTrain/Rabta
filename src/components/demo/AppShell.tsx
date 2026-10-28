import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { T } from "@/components/ui/Text";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { site } from "@/config/site";
import { plain } from "@/lib/copy";
import { ChatPanel } from "./ChatPanel";
import { DemoSidebar } from "./DemoSidebar";
import { ModeBadge } from "./ModeBadge";

/**
 * Prototype frame: app bar + sidebar + main canvas (+ AI chat on the right).
 * The page content (children) is the main canvas.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { demo } = site;

  return (
    <div data-tone="paper" className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 h-14 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="flex h-full items-center gap-3 px-4 lg:px-6">
          <Logo className="[&>span]:text-[1.0625rem]" />
          <span aria-hidden="true" className="hidden h-5 w-px bg-line md:block" />
          <p className="hidden truncate text-sm text-muted md:block">
            <T c={demo.title} tag={false} />
          </p>
          <span className="label-caps hidden rounded-pill bg-fg px-2.5 py-1 text-bg sm:inline-block">
            Prototype
          </span>
          <ModeBadge className="hidden min-[400px]:inline-flex" />
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

      <div className="flex flex-1 flex-col lg:flex-row">
        <DemoSidebar items={demo.nav} />

        <div className="min-w-0 flex-1 xl:grid xl:grid-cols-[minmax(0,1fr)_360px]">
          <main id="main" tabIndex={-1} className="min-w-0 outline-none">
            {children}
          </main>

          {demo.showChat && (
            <aside
              aria-label={`${demo.assistantName} chat`}
              className="border-t border-line xl:border-t-0 xl:border-s"
            >
              <div className="xl:sticky xl:top-14 xl:h-[calc(100dvh-3.5rem)]">
                <ChatPanel
                  assistantName={demo.assistantName}
                  suggestedPrompts={demo.suggestedPrompts.map(plain)}
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
