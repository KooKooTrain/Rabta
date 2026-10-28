import type { GlyphName } from "@/config/types";

/**
 * Kin glyphs: simple geometric family symbols drawn in a 100×100 box.
 * GlyphShape returns bare SVG elements; Glyph wraps one in its own <svg>.
 */
export function GlyphShape({ name, color }: { name: GlyphName; color: string }) {
  switch (name) {
    case "person":
      return (
        <g fill={color}>
          <circle cx="50" cy="36" r="13" />
          <path d="M24 80a26 26 0 0 1 52 0z" />
        </g>
      );
    case "bond":
      return (
        <g fill="none" stroke={color} strokeWidth="6">
          <circle cx="39" cy="50" r="19" />
          <circle cx="61" cy="50" r="19" />
        </g>
      );
    case "home":
      return <path fill={color} d="M28 80V50a22 22 0 0 1 44 0v30z" />;
    case "embrace":
      return <path fill={color} d="M22 78V22a56 56 0 0 1 56 56z" />;
    case "sun":
      return (
        <g fill={color}>
          <path d="M20 66a30 30 0 0 1 60 0z" />
          <rect x="20" y="74" width="60" height="6" rx="3" />
        </g>
      );
    case "kin":
      return (
        <g fill={color}>
          <circle cx="40" cy="44" r="20" />
          <circle cx="70" cy="68" r="11" />
        </g>
      );
    case "data":
      return (
        <g fill={color}>
          {[30, 50, 70].flatMap((y) =>
            [30, 50, 70].map((x) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={x === 50 && y === 50 ? 7 : 5} />
            )),
          )}
        </g>
      );
    case "spark":
      return (
        <path
          fill={color}
          d="M50 16c3 22 12 31 34 34-22 3-31 12-34 34-3-22-12-31-34-34 22-3 31-12 34-34z"
        />
      );
  }
}

/** Standalone glyph icon (persona avatars, empty states). */
export function Glyph({
  name,
  color = "currentColor",
  className,
  title,
}: {
  name: GlyphName;
  color?: string;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <GlyphShape name={name} color={color} />
    </svg>
  );
}
