import { cn } from "@/lib/utils";

/**
 * [PLACEHOLDER] logo mark: a 2×2 block of squares and quarter-circles (two
 * "heads", two "shoulders"). Replace these paths with the team logo, or set
 * site.brand.logo to an image. Ink parts use currentColor; one part is signal.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="14" height="14" fill="currentColor" />
      <path d="M18 14V0a14 14 0 0 1 14 14z" fill="var(--color-signal)" />
      <path d="M14 18v14A14 14 0 0 1 0 18z" fill="currentColor" />
      <rect x="18" y="18" width="14" height="14" fill="currentColor" />
    </svg>
  );
}
