import { EmptyState } from "@/components/demo/EmptyState";
import { SampleWidgets } from "@/components/demo/SampleWidgets";
import { T } from "@/components/ui/Text";
import { site } from "@/config/site";

/**
 * /demo: the working prototype lives here.
 * The app bar, sidebar and AI chat come from app/demo/layout.tsx (AppShell).
 */
export default function DemoPage() {
  const { demo } = site;

  return (
    <div className="flex flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <header className="flex flex-col gap-3">
        <p className="label-mono flex items-center gap-3 text-muted">
          <span className="text-accent-text">[ Demo ]</span>
          <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
          <span>{site.competition.theme}</span>
        </p>
        <h1 className="font-display text-display-xl font-semibold">
          <T c={demo.title} />
        </h1>
        <p className="max-w-2xl text-muted">
          <T c={demo.subtitle} />
        </p>
      </header>

      {/* ← TOMORROW: replace <EmptyState /> with the problem-specific feature */}
      <EmptyState />

      {demo.showSampleWidgets && <SampleWidgets />}
    </div>
  );
}
