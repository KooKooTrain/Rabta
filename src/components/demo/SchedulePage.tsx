"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock3, Trash2, X } from "lucide-react";
import { gameById, games } from "@/config/games";
import { useWorkspacePreferences } from "@/components/demo/WorkspacePreferences";
import type { GameId } from "@/lib/games/types";
import { cn } from "@/lib/utils";

type CalendarView = "month" | "week" | "day";
type SessionType = "practice" | "friendly-match" | "family-game";
type CalendarEvent = { id: string; sport: GameId; session: SessionType; date: string; time: string; players: string };

const STORAGE_KEY = "rabta-schedule-events.v1";
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SESSION_TYPES: SessionType[] = ["practice", "friendly-match", "family-game"];

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}
function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}
function startOfWeek(date: Date) {
  const offset = (date.getDay() + 6) % 7;
  return addDays(date, -offset);
}
function buildSampleEvents(today: Date): CalendarEvent[] {
  const tomorrow = addDays(today, 1);
  const weekend = addDays(today, 3);
  const nextWeek = addDays(today, 5);
  return [
    { id: "sample-football", sport: "football", session: "practice", date: dateKey(today), time: "16:30", players: "Noor, Sami" },
    { id: "sample-basketball", sport: "basketball", session: "friendly-match", date: dateKey(tomorrow), time: "09:00", players: "Omar, Noor" },
    { id: "sample-volleyball", sport: "volleyball", session: "practice", date: dateKey(weekend), time: "17:30", players: "Everyone" },
    { id: "sample-karabi", sport: "al-karabi", session: "family-game", date: dateKey(nextWeek), time: "10:00", players: "Everyone" },
  ];
}
function formatDate(date: Date, locale: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: "Asia/Dubai" }).format(date);
}
function formatTime(time: string, locale: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const utc = new Date(Date.UTC(2020, 0, 1, hours, minutes));
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(utc);
}
function sessionLabel(session: SessionType, ar: boolean) {
  if (ar) return ({ practice: "تدريب", "friendly-match": "مباراة ودية", "family-game": "لعبة عائلية" })[session];
  return ({ practice: "Practice", "friendly-match": "Friendly match", "family-game": "Family game" })[session];
}
function eventTitle(event: CalendarEvent, ar: boolean) {
  return `${gameById(event.sport).name} ${sessionLabel(event.session, ar).toLocaleLowerCase(ar ? "ar-AE" : "en-AE")}`;
}

export function SchedulePage() {
  const { language } = useWorkspacePreferences();
  const ar = language === "ar";
  const locale = ar ? "ar-AE" : "en-AE";
  const [date, setDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  });
  const [view, setView] = useState<CalendarView>("month");
  const [events, setEvents] = useState<CalendarEvent[]>(() => buildSampleEvents(new Date()));
  const [showingSamples, setShowingSamples] = useState(true);
  const [adding, setAdding] = useState(false);
  const [sport, setSport] = useState<GameId>("football");
  const [session, setSession] = useState<SessionType>("practice");
  const [eventDate, setEventDate] = useState(dateKey(date));
  const [eventTime, setEventTime] = useState("17:00");
  const [players, setPlayers] = useState("Everyone");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved) as CalendarEvent[];
        if (Array.isArray(parsed)) {
          const sportsSessions = parsed.filter((event) =>
            event && typeof event.id === "string" &&
            games.some((game) => game.id === event.sport) &&
            SESSION_TYPES.includes(event.session) &&
            typeof event.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(event.date) &&
            typeof event.time === "string" && /^\d{2}:\d{2}$/.test(event.time) &&
            typeof event.players === "string",
          );
          const hasLegacyEntries = parsed.length > 0 && sportsSessions.length === 0;
          const next = hasLegacyEntries ? buildSampleEvents(new Date()) : sportsSessions;
          setEvents(next);
          setShowingSamples(hasLegacyEntries || next.some((event) => event.id.startsWith("sample-")));
          if (hasLegacyEntries) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      }
    } catch { /* keep the sample calendar available if storage is blocked */ }
  }, []);

  const saveEvents = (next: CalendarEvent[]) => {
    setEvents(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* changes stay for this session */ }
  };

  const eventsFor = (day: Date) => events.filter((event) => event.date === dateKey(day)).sort((a, b) => a.time.localeCompare(b.time));
  const monthDays = useMemo(() => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1, 12);
    const offset = (first.getDay() + 6) % 7;
    const gridStart = addDays(first, -offset);
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [date]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(date), index)), [date]);
  const monthEvents = events.filter((event) => {
    const eventDay = fromDateKey(event.date);
    return eventDay.getMonth() === date.getMonth() && eventDay.getFullYear() === date.getFullYear();
  }).length;

  const titleLabel = view === "month"
    ? formatDate(date, locale, { month: "long", year: "numeric" })
    : view === "week"
      ? `${formatDate(weekDays[0], locale, { day: "numeric", month: "short" })} – ${formatDate(weekDays[6], locale, { day: "numeric", month: "short", year: "numeric" })}`
      : formatDate(date, locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const moveDate = (amount: number) => {
    if (view === "month") setDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1, 12));
    else setDate((current) => addDays(current, amount * (view === "week" ? 7 : 1)));
  };

  const addEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!eventDate) return;
    const next = [...events, { id: `event-${Date.now()}`, sport, session, date: eventDate, time: eventTime, players: players.trim() || "Everyone" }];
    saveEvents(next);
    setDate(fromDateKey(eventDate));
    setView("day");
    setSport("football");
    setSession("practice");
    setAdding(false);
  };

  const removeEvent = (id: string) => {
    const next = events.filter((event) => event.id !== id);
    saveEvents(next);
    setShowingSamples(next.some((event) => event.id.startsWith("sample-")));
  };

  const weekdays = WEEKDAYS.map((day) => ar
    ? formatDate(new Date(2020, 0, 6 + WEEKDAYS.indexOf(day), 12), locale, { weekday: "short" })
    : day.slice(0, 3));

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-7 lg:px-10 lg:py-11">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label-caps text-muted">{ar ? "الرياضة العائلية" : "Family sports"}</p>
          <h2 className="mt-2 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">{ar ? "الجدول" : "Schedule"}</h2>
          <p className="mt-3 text-muted">{ar ? "خططوا للتدريب والمباريات وألعاب الأسرة." : "Plan practices, friendly matches and family game days."}</p>
        </div>
        <button type="button" onClick={() => { setEventDate(dateKey(date)); setAdding((value) => !value); }} className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85">
          {adding ? <X aria-hidden="true" className="size-4" /> : <CalendarPlus aria-hidden="true" className="size-4" />}{adding ? (ar ? "إغلاق" : "Close") : (ar ? "إضافة نشاط رياضي" : "Add sports session")}
        </button>
      </header>

      {adding && <form onSubmit={addEvent} className="mt-7 grid gap-3 rounded-2xl bg-surface p-4 sm:grid-cols-2 xl:grid-cols-[minmax(9rem,0.8fr)_minmax(10rem,0.9fr)_minmax(10rem,0.9fr)_minmax(8rem,0.6fr)_minmax(10rem,0.8fr)_auto] xl:items-end sm:p-5">
        <label htmlFor="schedule-session" className="flex flex-col gap-1.5 text-sm font-medium">{ar ? "نوع الجلسة" : "Session"}<select id="schedule-session" autoFocus value={session} onChange={(event) => setSession(event.target.value as SessionType)} className="h-11 rounded-xl bg-bg px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-focus"><option value="practice">{sessionLabel("practice", ar)}</option><option value="friendly-match">{sessionLabel("friendly-match", ar)}</option><option value="family-game">{sessionLabel("family-game", ar)}</option></select></label>
        <label htmlFor="schedule-sport" className="flex flex-col gap-1.5 text-sm font-medium">{ar ? "الرياضة" : "Sport"}<select id="schedule-sport" value={sport} onChange={(event) => setSport(event.target.value as GameId)} className="h-11 rounded-xl bg-bg px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-focus">{games.map((game) => <option key={game.id} value={game.id}>{game.name}</option>)}</select></label>
        <label htmlFor="schedule-date" className="flex flex-col gap-1.5 text-sm font-medium">{ar ? "التاريخ" : "Date"}<input id="schedule-date" type="date" required value={eventDate} onChange={(event) => setEventDate(event.target.value)} className="h-11 rounded-xl bg-bg px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-focus" /></label>
        <label htmlFor="schedule-time" className="flex flex-col gap-1.5 text-sm font-medium">{ar ? "الوقت" : "Time"}<input id="schedule-time" type="time" required value={eventTime} onChange={(event) => setEventTime(event.target.value)} className="h-11 rounded-xl bg-bg px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-focus" /></label>
        <label htmlFor="schedule-players" className="flex flex-col gap-1.5 text-sm font-medium">{ar ? "اللاعبون" : "Players"}<input id="schedule-players" maxLength={70} value={players} onChange={(event) => setPlayers(event.target.value)} placeholder={ar ? "أسماء اللاعبين" : "Names or Everyone"} className="h-11 rounded-xl bg-bg px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-focus" /></label>
        <button type="submit" className="h-11 rounded-full bg-brand px-5 text-sm font-medium text-fg hover:bg-brand-hover">{ar ? "حفظ" : "Save"}</button>
      </form>}

      <section className="mt-8 overflow-hidden rounded-3xl bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => moveDate(-1)} aria-label={ar ? "السابق" : "Previous date range"} className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg"><ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" /></button>
            <h3 className="min-w-[10rem] text-lg font-medium tracking-[-0.02em] sm:min-w-[13rem]">{titleLabel}</h3>
            <button type="button" onClick={() => moveDate(1)} aria-label={ar ? "التالي" : "Next date range"} className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg"><ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" /></button>
            <button type="button" onClick={() => { const now = new Date(); setDate(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12)); }} className="hidden rounded-full px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-fg/5 hover:text-fg sm:inline-flex">{ar ? "اليوم" : "Today"}</button>
          </div>
          <div role="group" aria-label={ar ? "عرض التقويم" : "Calendar view"} className="flex rounded-full bg-soft p-1">
            {(["month", "week", "day"] as CalendarView[]).map((option) => <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)} className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm", view === option ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg")}>{ar ? ({ month: "شهر", week: "أسبوع", day: "يوم" }[option]) : ({ month: "Month", week: "Week", day: "Day" }[option])}</button>)}
          </div>
        </div>

        <div className="flex items-center justify-between border-y border-line px-4 py-2.5 text-xs text-muted sm:px-6">
          <span>{ar ? "الأنشطة الرياضية هذا الشهر" : "Sports sessions this month"}</span>
          <span className="tabular-nums">{monthEvents} {ar ? "أنشطة" : monthEvents === 1 ? "session" : "sessions"}</span>
        </div>

        {view === "month" && <div className="p-2 sm:p-4">
          <div className="grid grid-cols-7">{weekdays.map((day, index) => <p key={`${day}-${index}`} className="px-1 py-2 text-center text-[0.65rem] font-medium uppercase tracking-wide text-subtle sm:px-2 sm:text-xs">{day}</p>)}</div>
          <div className="grid grid-cols-7 overflow-hidden rounded-xl">
            {monthDays.map((day, index) => {
              const dayKey = dateKey(day);
              const dayEvents = eventsFor(day);
              const outside = day.getMonth() !== date.getMonth();
              const selected = dayKey === dateKey(date);
              const today = dayKey === dateKey(new Date());
              return <button key={dayKey} type="button" onClick={() => setDate(day)} aria-pressed={selected} aria-label={`${formatDate(day, locale, { weekday: "long", day: "numeric", month: "long" })}${dayEvents.length ? `, ${dayEvents.length} ${ar ? "أنشطة رياضية" : "sports sessions"}` : ""}`} className={cn("min-h-[4.8rem] border-t border-line p-1.5 text-start transition-colors hover:bg-fg/[0.035] sm:min-h-[6.5rem] sm:p-2", index % 7 === 6 ? "border-e-0" : "border-e", index >= 35 && "border-b", outside && "text-subtle/45", selected && "bg-brand/15", today && !selected && "bg-soft/45")}>
                <span className={cn("grid size-6 place-items-center rounded-full text-xs tabular-nums sm:size-7 sm:text-sm", today && "bg-fg font-medium text-bg", selected && today && "bg-brand text-fg")}>{formatDate(day, locale, { day: "numeric" })}</span>
                <div className="mt-1 flex flex-col gap-0.5">
                  {dayEvents.slice(0, 2).map((event) => <span key={event.id} className="hidden truncate rounded-md bg-brand/20 px-1.5 py-0.5 text-[0.65rem] font-medium text-brand-ink sm:block">{eventTitle(event, ar)}</span>)}
                  {dayEvents.length > 2 && <span className="hidden px-1 text-[0.65rem] text-muted sm:block">+{dayEvents.length - 2} {ar ? "المزيد" : "more"}</span>}
                  {dayEvents.length > 0 && <span className="mx-auto mt-1 flex gap-1 sm:hidden">{dayEvents.slice(0, 3).map((event) => <i key={event.id} className="size-1 rounded-full bg-brand-ink" />)}</span>}
                </div>
              </button>;
            })}
          </div>
          <SelectedDay events={eventsFor(date)} date={date} locale={locale} ar={ar} onRemove={removeEvent} />
        </div>}

        {view === "week" && <div className="overflow-x-auto p-3 sm:p-5">
          <div className="grid min-w-[50rem] grid-cols-7 divide-x divide-line">
            {weekDays.map((day) => <button key={dateKey(day)} type="button" onClick={() => { setDate(day); setView("day"); }} className={cn("min-h-64 px-2 py-3 text-start transition-colors hover:bg-fg/[0.025] sm:px-3", dateKey(day) === dateKey(date) && "bg-brand/10")}>
              <span className="block text-xs text-muted">{formatDate(day, locale, { weekday: "short" })}</span>
              <span className={cn("mt-1 grid size-8 place-items-center rounded-full text-sm tabular-nums", dateKey(day) === dateKey(new Date()) && "bg-fg text-bg", dateKey(day) === dateKey(date) && "bg-brand text-fg")}>{formatDate(day, locale, { day: "numeric" })}</span>
              <div className="mt-4 flex flex-col gap-2">{eventsFor(day).map((event) => <span key={event.id} className="rounded-lg bg-brand/20 px-2 py-2 text-xs text-brand-ink"><span className="block font-medium">{formatTime(event.time, locale)}</span><span className="mt-0.5 block break-words">{eventTitle(event, ar)}</span><span className="mt-1 block break-words opacity-80">{event.players}</span></span>)}</div>
            </button>)}
          </div>
        </div>}

        {view === "day" && <div className="px-4 py-5 sm:px-7 sm:py-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-muted">{ar ? "أنشطة اليوم" : "Sports sessions"}</p><p className="mt-1 text-2xl font-medium tracking-[-0.04em]">{formatDate(date, locale, { weekday: "long", day: "numeric", month: "long" })}</p></div><span className="rounded-full bg-soft px-3 py-1.5 text-xs text-muted">{eventsFor(date).length} {ar ? "أنشطة" : eventsFor(date).length === 1 ? "session" : "sessions"}</span></div>
          <DayAgenda events={eventsFor(date)} locale={locale} ar={ar} onRemove={removeEvent} />
        </div>}
      </section>

      {showingSamples && <p className="mt-4 text-xs text-subtle">{ar ? "هذه جلسات رياضية تجريبية. أضف تدريبات ومباريات أسرتك لحفظها على هذا الجهاز." : "These sample sports sessions preview the calendar. Add your family’s practices and matches to save them on this device."}</p>}
    </div>
  );
}

function SelectedDay({ events, date, locale, ar, onRemove }: { events: CalendarEvent[]; date: Date; locale: string; ar: boolean; onRemove: (id: string) => void }) {
  return <div className="mt-5 border-t border-line pt-5">
    <div className="mb-3 flex items-baseline justify-between gap-3"><h4 className="font-medium">{formatDate(date, locale, { weekday: "long", day: "numeric", month: "long" })}</h4><span className="text-xs text-muted">{events.length} {ar ? "أنشطة رياضية" : events.length === 1 ? "session" : "sessions"}</span></div>
    {events.length ? <div className="flex flex-col gap-2">{events.map((event) => <EventRow key={event.id} event={event} locale={locale} ar={ar} onRemove={onRemove} />)}</div> : <p className="rounded-xl bg-soft/45 px-4 py-5 text-sm text-muted">{ar ? "لا توجد أنشطة رياضية لهذا اليوم." : "No sports sessions planned for this day."}</p>}
  </div>;
}

function DayAgenda({ events, locale, ar, onRemove }: { events: CalendarEvent[]; locale: string; ar: boolean; onRemove: (id: string) => void }) {
  if (!events.length) return <div className="rounded-2xl bg-soft/45 px-5 py-10 text-center"><Clock3 aria-hidden="true" className="mx-auto size-5 text-muted" /><p className="mt-3 font-medium">{ar ? "لا توجد جلسات اليوم" : "No sessions today"}</p><p className="mt-1 text-sm text-muted">{ar ? "أضف تدريبًا أو مباراة عائلية." : "Add a practice or family match to get started."}</p></div>;
  return <ol className="flex flex-col">
    {events.map((event) => <li key={event.id} className="grid grid-cols-[5.5rem_1rem_minmax(0,1fr)] gap-2 sm:grid-cols-[6.5rem_1rem_minmax(0,1fr)] sm:gap-3">
      <time className="pt-4 text-end text-sm tabular-nums text-muted">{formatTime(event.time, locale)}</time>
      <span className="relative flex justify-center"><span className="absolute bottom-0 top-0 w-px bg-line" /><span className="relative mt-5 size-2.5 rounded-full bg-brand ring-4 ring-surface" /></span>
      <div className="mb-3 mt-1"><EventRow event={event} locale={locale} ar={ar} onRemove={onRemove} showTime={false} /></div>
    </li>)}
  </ol>;
}

function EventRow({ event, locale, ar, onRemove, showTime = true }: { event: CalendarEvent; locale: string; ar: boolean; onRemove: (id: string) => void; showTime?: boolean }) {
  return <div className="flex items-center gap-3 rounded-xl bg-soft/55 px-4 py-3">
    <span className="size-1.5 shrink-0 rounded-full bg-brand-ink" />
    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{eventTitle(event, ar)}</p><p className="mt-0.5 text-xs text-muted">{event.players}{showTime ? ` · ${formatTime(event.time, locale)}` : ""}</p></div>
    <button type="button" onClick={() => onRemove(event.id)} aria-label={`${ar ? "حذف" : "Remove"} ${eventTitle(event, ar)}`} title={ar ? "حذف النشاط" : "Remove sports session"} className="grid size-8 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-fg/5 hover:text-fg"><Trash2 aria-hidden="true" className="size-4" /></button>
  </div>;
}
