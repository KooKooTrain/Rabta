import { EmptyState } from "@/components/demo/EmptyState";
import { SampleWidgets } from "@/components/demo/SampleWidgets";
import { site } from "@/config/site";

/**
 * /demo: the working prototype lives here.
 * The workspace header and sidebar come from app/demo/layout.tsx (AppShell).
 */
export default function DemoPage() {
  const { demo } = site;

  return (
    <div className="flex flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-medium tracking-[-0.045em]">Analyze</h2>
        <p className="max-w-2xl text-muted">A clear view of how your family is doing.</p>
      </header>

      <EmptyState />

      {demo.showSampleWidgets && <SampleWidgets />}
    </div>
  );
}
