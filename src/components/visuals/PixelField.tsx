"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { seededRandom } from "@/lib/seeded";
import { cn } from "@/lib/utils";

/**
 * The brand texture: a grid of square "keys" whose colour steps along a
 * gradient, dithered by seeded noise, with a slow wave rippling through it.
 * Canvas, DPR-aware, pauses off-screen, static under reduced motion.
 * Size it with the wrapper (className); the canvas fills it.
 */

const PALETTES = {
  // dark → light (Chande)
  lime: ["#0d1411", "#11271b", "#1e4d33", "#2c7a2c", "#48b726", "#6cf02d", "#b9f78f", "#f4f3ee"],
  // dark → light (Wastetide red)
  signal: ["#170d0a", "#2a0b05", "#5c140a", "#a32210", "#e0321a", "#ff3b1f", "#ff8a70", "#f4f3ee"],
  // greys for light sections
  ink: ["#170d0a", "#3b3532", "#57504c", "#8d8780", "#b9b1ae", "#d6d3cb", "#e9e8e1", "#f4f3ee"],
} as const;

export type PixelPalette = keyof typeof PALETTES;
type Direction = "up" | "down" | "left" | "right" | "radial";

export function PixelField({
  className,
  palette = "lime",
  cell = 22,
  gap = 2,
  direction = "up",
  /** 0–1: how far the gradient climbs into the light steps */
  intensity = 1,
  noise = 0.18,
  wave = 0.14,
  speed = 1,
  seed = site.brand.seed,
  label,
}: {
  className?: string;
  palette?: PixelPalette;
  cell?: number;
  gap?: number;
  direction?: Direction;
  intensity?: number;
  noise?: number;
  wave?: number;
  speed?: number;
  seed?: string;
  /** Leave empty for decorative use (aria-hidden). */
  label?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const colors = PALETTES[palette];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let jitter: number[] = [];
    let raf = 0;
    let visible = false;
    let last = 0;

    const layout = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      const rand = seededRandom(`${seed}:${cols}x${rows}`);
      jitter = Array.from({ length: cols * rows }, () => rand() * 2 - 1);
    };

    const base = (x: number, y: number) => {
      const u = cols > 1 ? x / (cols - 1) : 0;
      const v = rows > 1 ? y / (rows - 1) : 0;
      switch (direction) {
        case "up":
          return 1 - v;
        case "down":
          return v;
        case "left":
          return 1 - u;
        case "right":
          return u;
        case "radial":
          return 1 - Math.min(1, Math.hypot(u - 0.5, v - 0.5) * 1.6);
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const s = cell - gap;
      const steps = colors.length - 1;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const w = wave * Math.sin(x * 0.42 + y * 0.18 - t * 1.4 * speed);
          const val = (base(x, y) * intensity + jitter[y * cols + x] * noise + w) * steps;
          const idx = Math.max(0, Math.min(steps, Math.round(val)));
          const px = x * cell;
          const py = y * cell;
          ctx.fillStyle = colors[idx];
          ctx.fillRect(px, py, s, s);
          // "key" bevel: light top edge, dark bottom edge
          if (idx > 0 && s > 8) {
            ctx.fillStyle = "rgba(255,255,255,0.18)";
            ctx.fillRect(px, py, s, Math.max(2, s * 0.14));
            ctx.fillStyle = "rgba(0,0,0,0.22)";
            ctx.fillRect(px, py + s - Math.max(2, s * 0.14), s, Math.max(2, s * 0.14));
          }
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 50) return; // ~20fps is plenty for a texture
      last = now;
      draw(now / 1000);
    };
    const start = () => {
      if (!raf && visible && !reduced && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    layout();
    draw(0);

    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now() / 1000);
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [palette, cell, gap, direction, intensity, noise, wave, speed, seed]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: PALETTES[palette][0] }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
