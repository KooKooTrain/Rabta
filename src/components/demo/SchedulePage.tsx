"use client";

import { useState } from "react";
import { CalendarPlus, Clock3 } from "lucide-react";

const initialEvents = [
  { day: "Today", time: "4:30 PM", title: "School pickup", person: "Mum" },
  { day: "Today", time: "6:00 PM", title: "Family dinner", person: "Everyone" },
  { day: "Tomorrow", time: "9:00 AM", title: "Football practice", person: "Omar" },
];

export function SchedulePage() {
  const [events, setEvents] = useState(initialEvents);
  const addEvent = () => setEvents((current) => [...current, { day: "Friday", time: "5:00 PM", title: "New family event", person: "Everyone" }]);
  return (
    <div className="mx-auto max-w-4xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-muted">A simple look at what’s coming up.</p><h2 className="mt-2 text-3xl font-medium tracking-[-0.045em]">Schedule</h2></div>
        <button type="button" onClick={addEvent} className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2.5 text-sm font-medium text-bg hover:opacity-85"><CalendarPlus aria-hidden="true" className="size-4" />Add event</button>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        {events.map((event, index) => <div key={`${event.title}-${index}`} className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-4 last:border-b-0 sm:px-6">
          <div className="w-24 shrink-0 text-sm font-medium">{event.day}</div>
          <div className="flex min-w-0 flex-1 items-center gap-3"><Clock3 aria-hidden="true" className="size-4 shrink-0 text-muted" /><div className="min-w-0"><p className="truncate font-medium">{event.title}</p><p className="mt-0.5 text-sm text-muted">{event.person}</p></div></div>
          <span className="text-sm text-muted">{event.time}</span>
        </div>)}
      </div>
      <p className="mt-4 text-xs text-subtle">Sample schedule · Your family’s events stay private.</p>
    </div>
  );
}
