import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { LinkItem } from "@/config/types";
import { T } from "./Text";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden font-mono text-[0.8125rem] font-semibold uppercase tracking-[0.06em] whitespace-nowrap " +
  "transition-[color,background-color,border-color] duration-[var(--dur-wipe)] ease-wipe focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  // A block of --wipe colour slides up from the bottom on hover (::before)
  primary:
    "bg-accent text-accent-fg hover:text-wipe-fg " +
    "before:absolute before:inset-0 before:-z-10 before:bg-wipe before:[clip-path:inset(100%_0_0_0)] " +
    "before:transition-[clip-path] before:duration-[var(--dur-wipe)] before:ease-wipe hover:before:[clip-path:inset(0_0_0_0)]",
  secondary:
    "border border-dashed border-line-strong text-fg duration-[var(--dur-base)] ease-hover hover:border-solid hover:border-fg hover:bg-fg hover:text-bg",
  ghost: "text-fg underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5",
  lg: "h-14 px-7",
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

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
      <span>
        <T c={link.label} rich={false} />
      </span>
      {icon && (
        <Arrow
          aria-hidden="true"
          className="size-4 transition-transform duration-[var(--dur-base)] ease-hover group-hover/btn:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-[3px]"
        />
      )}
    </>
  );
  const cls = cn(base, variants[variant], sizes[size], className);

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
