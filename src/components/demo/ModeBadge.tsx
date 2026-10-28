import { isLive } from "@/lib/ai";
import { cn } from "@/lib/utils";

/**
 * "Mock AI" / "Live AI" badge, computed on the server from env vars; no secret
 * reaches the client. Evaluated at build time for static output: rebuild or
 * restart `npm run dev` after changing .env.local.
 */
export function ModeBadge({ className }: { className?: string }) {
  const live = isLive();
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1",
        live ? "border-ink bg-lime text-ink" : "border-line-strong text-muted",
        className,
      )}
      title={live ? "Connected to a live AI provider" : "Using scripted mock replies (no API key set)"}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", live ? "live-dot bg-ink" : "bg-signal")}
      />
      {live ? "Live AI" : "Mock AI"}
    </span>
  );
}
