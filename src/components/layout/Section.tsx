import { site } from "@/config/site";
import type { Tone } from "@/config/types";
import { cn } from "@/lib/utils";

const showGrid: boolean = site.flags.showBlueprintGrid;

/**
 * Section wrapper: sets the tone (colours flip via tokens.css), the anchor id,
 * vertical rhythm and the dashed blueprint guides at the container edges.
 */
export function Section({
  id,
  tone,
  className,
  innerClassName,
  padded = true,
  guides = true,
  children,
  ...props
}: {
  id: string;
  tone: Tone;
  padded?: boolean;
  guides?: boolean;
  innerClassName?: string;
} & React.ComponentProps<"section">) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn("relative bg-bg text-fg", className)}
      {...props}
    >
      {showGrid && guides && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
        >
          <div className="container-site relative h-full">
            <div className="absolute inset-y-0 start-[var(--gutter)] border-s border-dashed border-line" />
            <div className="absolute inset-y-0 end-[var(--gutter)] border-e border-dashed border-line" />
          </div>
        </div>
      )}
      <div className={cn("relative", padded && "py-section", innerClassName)}>{children}</div>
    </section>
  );
}
