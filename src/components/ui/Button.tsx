import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { LinkItem } from "@/config/types";
import { T } from "./Text";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill font-medium whitespace-nowrap " +
  "transition-[color,background-color,border-color,transform] duration-[var(--dur-base)] ease-hover " +
  "active:scale-[0.98] focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  // Fill wipes in from the start edge on hover (::before)
  primary:
    "bg-accent text-accent-fg before:absolute before:inset-0 before:-z-0 before:origin-[left_center] rtl:before:origin-[right_center] before:scale-x-0 before:bg-accent-hover " +
    "before:transition-transform before:duration-[450ms] before:ease-wipe hover:before:scale-x-100",
  secondary:
    "border border-dashed border-line-strong text-fg hover:border-solid hover:border-fg hover:bg-fg/5",
  ghost: "text-fg underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
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
      <span className="relative z-10">
        <T c={link.label} rich={false} />
      </span>
      {icon && (
        <Arrow
          aria-hidden="true"
          className="relative z-10 size-4 transition-transform duration-[var(--dur-base)] ease-hover group-hover/btn:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-[3px]"
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
