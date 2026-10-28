import { cn } from "@/lib/utils";

/** Hairline card on the tone's surface colour. `interactive` adds hover lift. */
export function Card({
  className,
  interactive = false,
  children,
  ...props
}: { interactive?: boolean } & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-md border border-line bg-surface p-6 md:p-7",
        interactive &&
          "transition-[transform,border-color,box-shadow] duration-[var(--dur-base)] ease-hover hover:-translate-y-0.5 hover:border-line-strong hover:shadow-hair",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
