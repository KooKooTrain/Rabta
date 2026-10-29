import type { Team } from "@/lib/games/types";
import { cn } from "@/lib/utils";

/** Shared input look for the wizard's form fields. */
export const field =
  "h-11 w-full rounded-inner border border-line-strong bg-bg px-3 text-fg placeholder:text-muted transition-colors duration-[var(--dur-fast)] hover:border-fg focus-visible:border-fg";

export const smallBtn =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-pill border border-line-strong px-3.5 text-sm text-fg transition-colors duration-[var(--dur-fast)] hover:border-fg hover:bg-fg hover:text-bg disabled:pointer-events-none disabled:opacity-40";

export function StepHeader({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: React.ReactNode;
}) {
  return (
    <header className="flex max-w-3xl flex-col gap-4">
      <p className="label-caps text-muted">[ {label} ]</p>
      <h1 className="font-display text-display-lg">{title}</h1>
      {intro && <p className="text-lead text-muted">{intro}</p>}
    </header>
  );
}

/** A team's colour as a small round swatch (user data, so inline colour). */
export function Swatch({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-3.5 shrink-0 rounded-full border border-line-strong", className)}
      style={{ backgroundColor: color }}
    />
  );
}

export function TeamName({ team, className }: { team: Team; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Swatch color={team.color} />
      {team.name}
    </span>
  );
}
