import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { LinkItem } from "@/config/types";
import { T } from "./Text";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

// Pill in the marquee's condensed caps; the arrow sits in a round chip.
const base =
  "group/btn relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-pill font-display leading-none whitespace-nowrap " +
  "transition-[color,background-color,border-color] duration-[var(--dur-wipe)] ease-wipe focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  // A block of --wipe colour slides up from the bottom on hover (::before)
  primary:
    "bg-accent text-accent-fg hover:text-wipe-fg " +
    "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-wipe before:[clip-path:inset(100%_0_0_0)] " +
    "before:transition-[clip-path] before:duration-[var(--dur-wipe)] before:ease-wipe hover:before:[clip-path:inset(0_0_0_0)]",
  secondary:
    "border border-line-strong text-fg duration-[var(--dur-base)] ease-hover hover:border-fg hover:bg-fg hover:text-bg",
  ghost: "text-fg underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-11 ps-5 pe-1.5 text-[1.125rem]",
  lg: "h-14 ps-7 pe-2 text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)]",
};
const plainSizes: Record<Size, string> = {
  md: "px-5",
  lg: "px-7",
};
const chipSizes: Record<Size, string> = {
  md: "size-8",
  lg: "size-10",
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

const buttonClass = (variant: Variant, size: Size, icon: boolean, className?: string) =>
  cn(
    base,
    variants[variant],
    sizes[size],
    !icon && plainSizes[size],
    "disabled:pointer-events-none disabled:opacity-40",
    className,
  );

function ArrowChip({ size, Arrow }: { size: Size; Arrow: typeof ArrowRight }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-current/15 transition-transform duration-[var(--dur-base)] ease-hover group-hover/btn:translate-x-[3px] rtl:group-hover/btn:-translate-x-[3px]",
        chipSizes[size],
      )}
    >
      <Arrow className="size-4 rtl:-scale-x-100" />
    </span>
  );
}

/** A real <button> with the same look as Button (for actions, not navigation). */
export function ActionButton({
  variant = "primary",
  size = "md",
  icon = true,
  type = "button",
  className,
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  icon?: boolean;
} & React.ComponentProps<"button">) {
  return (
    <button type={type} className={buttonClass(variant, size, icon, className)} {...props}>
      <span className="pt-[0.08em]">{children}</span>
      {icon && <ArrowChip size={size} Arrow={ArrowRight} />}
    </button>
  );
}

export function Button({
  link,
  variant = "primary",
  size = "md",
  className,
  icon = true,
}: {
  link: LinkItem;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: boolean;
}) {
  const external = isExternal(link.href);
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      <span className="pt-[0.08em]">
        <T c={link.label} rich={false} />
      </span>
      {icon && <ArrowChip size={size} Arrow={Arrow} />}
    </>
  );
  const cls = buttonClass(variant, size, icon, className);

  return external ? (
    <a href={link.href} className={cls} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {content}
    </Link>
  );
}
