import type { Copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { T } from "./Text";

/** Mono "[ 02 ] LABEL" line used above section headings. */
export function Eyebrow({
  c,
  index,
  className,
}: {
  c: Copy;
  index?: number;
  className?: string;
}) {
  return (
    <p className={cn("label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-muted", className)}>
      {index !== undefined && (
        <span className="text-accent-text">[ {String(index).padStart(2, "0")} ]</span>
      )}
      <span>
        <T c={c} rich={false} />
      </span>
    </p>
  );
}
