import { cn } from "@/lib/utils";

/** Outlined pill tag (the only rounded shape besides donut cards). */
export function Pill({
  className,
  children,
  dot = false,
  ...props
}: { dot?: boolean } & React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-line-strong px-3.5 py-1 text-sm whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-accent" />}
      {children}
    </span>
  );
}
