import { DemoHeader } from "@/components/demo/DemoHeader";
import { DemoSidebar } from "@/components/demo/DemoSidebar";
import { WorkspacePreferences } from "@/components/demo/WorkspacePreferences";
import { site } from "@/config/site";

/** Workspace frame: compact top identity, side navigation and page canvas. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WorkspacePreferences>
      <div data-tone="paper" className="min-h-dvh bg-bg text-fg">
        <DemoHeader />
        <div className="flex min-h-[calc(100dvh-4.5rem)]">
          <DemoSidebar items={site.demo.nav} />
          <main id="main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
            {children}
          </main>
        </div>
      </div>
    </WorkspacePreferences>
  );
}
