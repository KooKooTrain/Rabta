import { cn } from "@/lib/utils";

/**
 * [PLACEHOLDER] logo mark: a 2×2 Kin Tile (home arch, person, kin, AI spark).
 * Replace these paths with the team logo, or set site.brand.logo to an image.
 * Uses fixed brand colours so it reads on light and dark headers.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-8 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="30" height="30" rx="7" fill="var(--color-forest)" />
      <path d="M8.5 25V15.5a6.5 6.5 0 0 1 13 0V25z" fill="var(--color-sage)" />
      <rect x="34" width="30" height="30" rx="7" fill="var(--color-blush)" />
      <circle cx="49" cy="11" r="4.2" fill="var(--color-ember-ink)" />
      <path d="M41 25a8 8 0 0 1 16 0z" fill="var(--color-ember-ink)" />
      <rect y="34" width="30" height="30" rx="7" fill="var(--color-saffron)" />
      <path
        d="M15 39c.9 6.6 3.5 9.2 10 10-6.5.9-9.1 3.5-10 10-.9-6.5-3.5-9.1-10-10 6.5-.8 9.1-3.4 10-10z"
        fill="var(--color-ink)"
      />
      <rect x="34" y="34" width="30" height="30" rx="7" fill="var(--color-sage)" />
      <circle cx="46" cy="46" r="6" fill="var(--color-forest)" />
      <circle cx="55" cy="54" r="3.4" fill="var(--color-forest)" />
    </svg>
  );
}
