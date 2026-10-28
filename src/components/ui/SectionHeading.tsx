import type { Copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { T } from "./Text";

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
  size?: "xl" | "lg";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex max-w-3xl flex-col gap-5",
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
          "font-display font-semibold",
          size === "xl" ? "text-display-xl" : "text-display-lg",
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
