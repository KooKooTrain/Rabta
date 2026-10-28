import { cn } from "@/lib/utils";

/** Rounded hairline card on the tone's surface colour. `interactive` adds a border hover. */
export function Card({
  className,
  interactive = false,
  children,
  ...props
}: { interactive?: boolean } & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-card border border-line bg-surface p-6 md:p-7",
        interactive &&
          "transition-[border-color] duration-[var(--dur-base)] ease-hover hover:border-fg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
