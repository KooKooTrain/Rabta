import Image from "next/image";
import type { Photo } from "@/config/types";
import { T } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

/**
 * Perforated postage stamp (Chande collage). Holds a photo, or any children
 * (e.g. a PixelField monogram) when there is no photo. Tilted; straightens
 * and lifts on hover. Wrap in an element with a `data-stamp` attribute if a
 * GSAP scatter-in targets it.
 */
export function Stamp({
  photo,
  rotate = 0,
  className,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 18vw, 45vw",
  children,
  caption = true,
}: {
  photo?: Photo;
  rotate?: number;
  className?: string;
  aspect?: string;
  sizes?: string;
  children?: React.ReactNode;
  caption?: boolean;
}) {
  return (
    <figure
      className={cn(
        "group/stamp relative drop-shadow-[0_10px_18px_rgb(0_0_0/0.35)] transition-transform duration-[var(--dur-slow)] ease-scale [transform:rotate(var(--rot))] hover:z-10 hover:[transform:rotate(0deg)_translateY(-6px)_scale(1.04)]",
        className,
      )}
      style={{ "--rot": `${rotate}deg` } as React.CSSProperties}
    >
      <div className="stamp">
        <div className={cn("relative overflow-hidden bg-night-2", aspect)}>
          {photo ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={sizes}
              className="object-cover saturate-[0.85] transition-[filter] duration-[var(--dur-slow)] group-hover/stamp:saturate-100"
            />
          ) : (
            children
          )}
        </div>
        {caption && photo?.caption && (
          <figcaption className="label-mono mt-2 flex items-center justify-between gap-2 text-ink">
            <T c={photo.caption} rich={false} tag={false} />
            <span aria-hidden="true" className="text-signal-ink">
              ●
            </span>
          </figcaption>
        )}
      </div>
    </figure>
  );
}
