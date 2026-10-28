"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { mulberry32 } from "@/lib/seeded";
import { buildKinGrid, nextGlyph } from "./kin";
import { KinTiles, type KinTilesProps } from "./KinTiles";

/** KinTiles that gently morph one glyph every few seconds while on screen. */
export function KinTilesLive({
  interval = 2800,
  ...props
}: Omit<KinTilesProps, "cells" | "seed"> & { seed: string; interval?: number }) {
  const { seed, cols, rows, spark = true } = props;
  const [cells, setCells] = useState(() => buildKinGrid(seed, cols, rows, { spark }));
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return;
    const rand = mulberry32(cols * 31 + rows);
    let timer: number | undefined;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      setCells((prev) => {
        const candidates = prev.filter((c) => c.glyph !== "spark");
        const target = candidates[Math.floor(rand() * candidates.length)];
        return prev.map((c) =>
          c.key === target.key ? { ...c, glyph: nextGlyph(c.glyph, rand()) } : c,
        );
      });
    };
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(tick, interval);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [reduced, cols, rows, interval]);

  return (
    <div ref={ref}>
      <KinTiles {...props} cells={cells} />
    </div>
  );
}
