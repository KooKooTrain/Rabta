import { T } from "@/components/ui/Text";
import { PixelField } from "@/components/visuals/PixelField";
import { site } from "@/config/site";

/** Placeholder canvas for the problem-specific feature. Replace in app/demo/page.tsx. */
export function EmptyState() {
  const { emptyState } = site.demo;
  return (
    <section
      aria-labelledby="empty-heading"
      className="flex flex-col items-start gap-6 border border-dashed border-line-strong bg-surface p-6 sm:flex-row sm:items-center sm:p-8"
    >
      <PixelField palette="signal" direction="radial" className="aspect-[3/2] w-36 shrink-0 sm:w-44" />
      <div className="flex min-w-0 flex-col gap-3">
        <p className="label-mono text-accent-text">
          <T c={emptyState.eyebrow} rich={false} />
        </p>
        <h2 id="empty-heading" className="font-display text-display-lg">
          <T c={emptyState.heading} />
        </h2>
        <p className="max-w-lg text-muted">
          <T c={emptyState.body} />
        </p>
        <code className="label-mono w-fit border border-line bg-bg px-2 py-1 normal-case tracking-normal text-fg">
          src/app/demo/page.tsx
        </code>
      </div>
    </section>
  );
}
