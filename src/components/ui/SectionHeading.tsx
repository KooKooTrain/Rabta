import type { Copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { T } from "./Text";

/** Eyebrow + giant condensed caps heading + optional intro. */
export function SectionHeading({
  eyebrow,
  heading,
  intro,
  index,
  align = "start",
  size = "xl",
  className,
}: {
  eyebrow: Copy;
  heading: Copy;
  intro?: Copy;
  index?: number;
  align?: "start" | "center";
  size?: "2xl" | "xl" | "md" | "lg";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <div data-reveal="">
        <Eyebrow c={eyebrow} index={index} />
      </div>
      <h2
        data-reveal=""
        style={{ "--i": 1 } as React.CSSProperties}
        className={cn(
          "font-display",
          size === "2xl" && "text-display-2xl",
          size === "xl" && "text-display-xl",
          size === "md" && "text-[clamp(2.5rem,1rem+4vw,5rem)] leading-[0.86] tracking-[-0.035em]",
          size === "lg" && "text-display-lg",
        )}
      >
        <T c={heading} />
      </h2>
      {intro && (
        <p
          data-reveal=""
          style={{ "--i": 2 } as React.CSSProperties}
          className="max-w-xl text-lead text-muted"
        >
          <T c={intro} />
        </p>
      )}
    </header>
  );
}
