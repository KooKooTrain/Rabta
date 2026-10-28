"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { AudienceContent } from "@/config/types";
import { Pill } from "@/components/ui/Pill";
import { T } from "@/components/ui/Text";
import { Donut } from "@/components/visuals/Donut";
import { plain } from "@/lib/copy";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const SEGMENT_COLORS = ["var(--color-ink)", "var(--color-signal)", "var(--color-rule-strong)", "var(--color-lime)"];
const INTERVAL = 3400;

/**
 * Wastetide split: a stacked persona list on the signal slab that auto-cycles
 * (pauses on hover/focus, off-screen, and for reduced motion), its pills, and
 * a white donut card on the grey panel that swaps with the active persona.
 */
export function AudienceSwitcher({ items }: { items: AudienceContent["items"] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const item = items[active];
  const lead = item.chart.segments[0];
  const total = item.chart.segments.reduce((a, s) => a + s.value, 0) || 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused || !visible) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % items.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [active, reduced, paused, visible, items.length]);

  return (
    <div
      ref={ref}
      className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Signal slab: persona list + pills */}
      <div className="grid gap-8 px-[var(--gutter)] pt-4 pb-12 md:grid-cols-[1fr_auto] md:items-end lg:pb-16">
        <ul className="flex flex-col">
          {items.map((it, i) => (
            <li key={i}>
              <button
                type="button"
                aria-pressed={i === active}
                aria-controls={panelId}
                onClick={() => setActive(i)}
                className={cn(
                  "font-display text-start text-display-xl transition-colors duration-[var(--dur-slow)] ease-scale",
                  i === active ? "text-emph" : "text-fg hover:text-paper/80",
                )}
              >
                <T c={it.name} rich={false} tag={false} />
              </button>
            </li>
          ))}
        </ul>
        <ul key={active} className="flex flex-wrap gap-2 md:flex-col md:items-end">
          {item.tags.map((tag, i) => (
            <li key={i} className="fade-up" style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}>
              <Pill className="border-ink bg-transparent font-mono text-xs text-ink uppercase">
                <T c={tag} rich={false} tag={false} />
              </Pill>
            </li>
          ))}
        </ul>
      </div>

      {/* Grey panel: persona card */}
      <div data-tone="panel" className="bg-bg px-[var(--gutter)] py-10 text-fg lg:py-12">
        <div
          id={panelId}
          key={active}
          aria-live="polite"
          className="fade-up mx-auto max-w-sm overflow-hidden rounded-lg bg-card"
          style={{ "--delay": "0ms" } as React.CSSProperties}
        >
          {item.photo && (
            <div className="relative aspect-[16/10] bg-ink">
              <Image
                src={item.photo.src}
                alt={item.photo.alt}
                fill
                sizes="(min-width: 1024px) 24rem, 90vw"
                className="object-cover grayscale"
              />
              <p className="label-mono absolute start-3 bottom-3 bg-signal px-2 py-1 text-ink">
                <T c={item.name} rich={false} tag={false} />
              </p>
            </div>
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-title">
                Breakdown
                <br />
                <span className="text-muted">
                  <T c={item.chart.label} rich={false} tag={false} />
                </span>
              </p>
              <Pill className="label-mono px-2.5 py-0.5">Scan</Pill>
            </div>
            <div className="mt-5 flex items-center gap-5">
              <Donut
                className="w-32 shrink-0"
                thickness={11}
                gap={1.5}
                label={`${plain(item.chart.label)}: ${item.chart.segments
                  .map((s) => `${plain(s.label)} ${Math.round((s.value / total) * 100)}%`)
                  .join(", ")}`}
                segments={item.chart.segments.map((s, i) => ({
                  value: s.value,
                  color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                }))}
              >
                <span className="font-display text-[1.75rem] leading-none tabular-nums">
                  {Math.round((lead.value / total) * 100)}%
                </span>
                <span className="label-mono mt-1 text-[0.625rem] text-muted">
                  <T c={lead.label} rich={false} tag={false} />
                </span>
              </Donut>
              <ul aria-hidden="true" className="label-mono space-y-2 text-muted">
                {item.chart.segments.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="size-2.5" style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }} />
                    <T c={s.label} rich={false} tag={false} />
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-5 border-t border-dashed border-line pt-4 text-sm text-muted">
              <T c={item.need} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
