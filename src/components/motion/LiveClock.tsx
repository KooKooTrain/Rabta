"use client";

import { useMemo, useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
}

/** HH:MM in a given IANA time zone. Server renders "--:--" (no hydration mismatch). */
export function LiveClock({ timeZone, className }: { timeZone: string; className?: string }) {
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone,
      }),
    [timeZone],
  );
  const time = useSyncExternalStore(
    subscribe,
    () => fmt.format(new Date()),
    () => null,
  );
  const [h, m] = (time ?? "--:--").split(":");

  return (
    <time className={className} style={{ display: "inline-block", minWidth: "5ch" }}>
      <span className="tabular-nums">{h}</span>
      <span aria-hidden="true" className="motion-safe:animate-pulse">
        :
      </span>
      <span className="sr-only">:</span>
      <span className="tabular-nums">{m}</span>
    </time>
  );
}
