"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  Bookmark,
  Printer,
  Code,
  Copy,
  Check,
} from "lucide-react";
import { JobNotification, isOpenOrOpening, getExamDates, getLatestResults, daysUntil, todayIST } from "@/data/jobs";
import { formatDate, formatDateShort, cn } from "@/lib/utils";
import { rowTitle, placeLabel } from "@/components/jobs/JobListCard";
import { generateGoogleCalendarUrl, downloadIcsFile, downloadCombinedIcsFile, CalendarEventParams } from "@/lib/calendar";
import { useWatchlist } from "@/lib/watchlist";
import { upcomingUpscDates, UPSC_CALENDAR_SOURCE } from "@/data/upsc-calendar";

export type EventType = "DEADLINE" | "EXAM" | "ADMIT_CARD" | "RESULT" | "PLANNED";

export interface CalendarEventItem {
  id: string;
  jobId: string;
  /** The published notice; absent for a date from a body's planned calendar (UPSC). */
  job?: JobNotification;
  /** Body code and place, shown on the row. */
  code: string;
  place: string;
  /** Planned dates: what is planned ("Notification expected", "Exam (planned)"). */
  plannedLabel?: string;
  eventType: EventType;
  title: string;
  organization: string;
  dateStr: string; // ISO YYYY-MM-DD
  rawDateLabel: string;
  isTentative?: boolean;
  applyUrl: string;
  noticeUrl: string;
}

// Convert various date strings found in Indian gazettes into standard YYYY-MM-DD

export function ExamCalendarView({ jobs }: { jobs: JobNotification[] }) {
  const [selectedType, setSelectedType] = useState<"ALL" | EventType>("ALL");
  const [selectedScope, setSelectedScope] = useState<"ALL" | "CENTRAL" | "STATE">("ALL");
  const [viewFormat, setViewFormat] = useState<"agenda" | "month">("agenda");
  // Calendar month being viewed (month 0-indexed), starting at the current month
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const { isSaved, toggleSave } = useWatchlist();

  // Calendar events, each from a date an official document gives: last dates of open recruitments,
  // exam dates (admit cards and schedules, or the notification's own date, marked tentative), admit
  // cards issued and results published in the last weeks. Nothing is dated by guess.
  const allEvents: CalendarEventItem[] = useMemo(() => {
    const today = todayIST();
    const events: CalendarEventItem[] = [];
    const notice = (job: JobNotification) => (job.isCentral ? `/jobs/${job.slug}` : `/state/${job.stateSlug}/jobs/${job.slug}`);
    const base = (job: JobNotification) => ({
      jobId: job.id, job, title: rowTitle(job), organization: job.organization,
      applyUrl: job.applyOnlineUrl || job.officialPdfUrl, noticeUrl: notice(job),
      code: job.orgShortCode, place: placeLabel(job),
    });
    for (const job of jobs) {
      if (isOpenOrOpening(job) && job.applicationEndDate && job.applicationEndDate >= today) {
        events.push({ ...base(job), id: `${job.id}-deadline`, eventType: "DEADLINE",
          dateStr: job.applicationEndDate, rawDateLabel: formatDate(job.applicationEndDate) });
      }
      const cutoff = new Date(Date.parse(today) - 30 * 86400000).toISOString().slice(0, 10);
      for (const s of job.stages || []) {
        if (s.kind === "admit_card" && s.date && s.date >= cutoff && s.date <= today) {
          events.push({ ...base(job), id: `${job.id}-admit-${s.date}`, eventType: "ADMIT_CARD",
            dateStr: s.date, rawDateLabel: formatDate(s.date) });
        }
      }
    }
    // an exam held over several days is listed once, on its next day
    const examSeen = new Set<string>();
    for (const e of getExamDates(jobs, today)) {
      if (examSeen.has(e.job.id)) continue;
      examSeen.add(e.job.id);
      events.push({ ...base(e.job), id: `${e.job.id}-exam-${e.date}`, eventType: "EXAM",
        dateStr: e.date, rawDateLabel: formatDate(e.date), isTentative: e.tentative });
    }
    for (const r of getLatestResults(jobs, 45, today)) {
      events.push({ ...base(r.job), id: `${r.job.id}-result`, eventType: "RESULT",
        dateStr: r.stage.date || today, rawDateLabel: formatDate(r.stage.date || today) });
    }
    // UPSC's own planned calendar (its site blocks our reader): planned dates still ahead, unless the
    // notification itself is already listed here
    const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const upscListed = jobs.filter((j) => /union public service/i.test(j.organization)).map((j) => norm(j.title));
    const WHAT = { notification: "Notification expected", lastDate: "Last date (planned)", exam: "Exam (planned)" };
    for (const p of upcomingUpscDates(today)) {
      const key = norm(p.plan.exam).slice(0, 28);
      if (upscListed.some((t) => t.includes(key))) continue;
      events.push({
        id: `upsc-${p.what}-${p.date}-${key}`, jobId: "", code: "UPSC", place: "Central",
        eventType: "PLANNED", plannedLabel: WHAT[p.what], title: p.plan.exam,
        organization: "Union Public Service Commission", dateStr: p.date, rawDateLabel: formatDate(p.date),
        applyUrl: UPSC_CALENDAR_SOURCE.url, noticeUrl: "/organisations/upsc#upsc-calendar",
      });
    }
    return events.sort((x, y) => x.dateStr.localeCompare(y.dateStr));
  }, [jobs]);

  // Filter events by selected category, scope, and optional clicked calendar date
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (selectedType !== "ALL" && ev.eventType !== selectedType) return false;
      const central = ev.job ? ev.job.isCentral : true;
      if (selectedScope === "CENTRAL" && !central) return false;
      if (selectedScope === "STATE" && central) return false;
      if (selectedDate && ev.dateStr !== selectedDate) return false;
      return true;
    }).sort((x, y) => {
      const today = todayIST();
      const px = x.dateStr < today, py = y.dateStr < today;
      return px !== py ? (px ? 1 : -1) : px ? y.dateStr.localeCompare(x.dateStr) : x.dateStr.localeCompare(y.dateStr);
    });
  }, [allEvents, selectedType, selectedScope, selectedDate]);
  const [shown, setShown] = useState(40);

  // Bulk download all filtered events as an .ics calendar file
  const handleExportAllCalendar = () => {
    const paramsList: CalendarEventParams[] = filteredEvents.map((ev) => ({
      title: `${ev.plannedLabel ? `${ev.plannedLabel}: ` : ""}${ev.title} (${ev.organization})`,
      description: ev.job
        ? `${ev.job.title}${ev.job.totalVacancies ? `\nPosts: ${ev.job.totalVacancies.toLocaleString("en-IN")}` : ""}\nOfficial: ${ev.applyUrl}`
        : `Planned in UPSC's calendar; dates may change.\n${ev.applyUrl}`,
      startDate: ev.dateStr,
      location: ev.place,
      url: ev.applyUrl,
    }));

    downloadCombinedIcsFile(paramsList, "govt-job-exam-schedule-2026.ics");
  };

  // Calendar month matrix generator
  const monthData = useMemo(() => {
    const firstDayIndex = new Date(calendarMonth.year, calendarMonth.month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
    
    // Group events of this month by day
    const eventsByDay: Record<number, CalendarEventItem[]> = {};
    allEvents.forEach((ev) => {
      const d = new Date(ev.dateStr);
      if (d.getFullYear() === calendarMonth.year && d.getMonth() === calendarMonth.month) {
        const day = d.getDate();
        if (!eventsByDay[day]) eventsByDay[day] = [];
        eventsByDay[day].push(ev);
      }
    });

    const monthName = new Date(calendarMonth.year, calendarMonth.month).toLocaleString("en-US", { month: "long" });

    return { firstDayIndex, daysInMonth, eventsByDay, monthName, year: calendarMonth.year };
  }, [calendarMonth, allEvents]);

  const handlePrevMonth = () => {
    setCalendarMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
    setSelectedDate(null);
  };

  const getEventTypeStyles = (type: EventType) => {
    switch (type) {
      case "DEADLINE":
        return {
          bg: "bg-saffron-tint",
          text: "text-saffron",
          border: "border-saffron-line",
          badge: "bg-saffron-solid text-white",
          dot: "bg-saffron-solid",
          label: "Last date",
        };
      case "EXAM":
        return {
          bg: "bg-green-tint",
          text: "text-green",
          border: "border-green-line",
          badge: "bg-green-solid text-white",
          dot: "bg-green-solid",
          label: "Exam",
        };
      case "ADMIT_CARD":
        return {
          bg: "bg-navy-tint",
          text: "text-navy",
          border: "border-navy-line",
          badge: "bg-navy-solid text-white",
          dot: "bg-navy-solid",
          label: "Admit Card",
        };
      case "RESULT":
        return {
          bg: "bg-purple-tint",
          text: "text-purple",
          border: "border-purple-line",
          badge: "bg-purple-solid text-white",
          dot: "bg-purple-solid",
          label: "Result",
        };
      case "PLANNED":
        return {
          bg: "bg-subtle",
          text: "text-ink-2",
          border: "border-line",
          badge: "bg-sunken text-ink-2",
          dot: "bg-faint",
          label: "UPSC plan",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: View Mode, Event Filter, Scope, Export Action */}
      <div className="bg-surface rounded-lg border border-line p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-line-soft">
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted uppercase">View:</span>
            <div className="inline-flex rounded-md border border-line bg-subtle p-0.5 text-xs font-semibold">
              <button
                onClick={() => setViewFormat("agenda")}
                className={cn(
                  "px-3 py-1.5 rounded transition-colors flex items-center gap-1.5",
                  viewFormat === "agenda" ? "bg-navy-solid text-white shadow-2xs" : "text-muted hover:text-ink"
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline Agenda</span>
              </button>
              <button
                onClick={() => setViewFormat("month")}
                className={cn(
                  "px-3 py-1.5 rounded transition-colors flex items-center gap-1.5",
                  viewFormat === "month" ? "bg-navy-solid text-white shadow-2xs" : "text-muted hover:text-ink"
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Monthly Calendar</span>
              </button>
            </div>
          </div>

          {/* Institutional Actions: Sync, Print, and Embed */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={() => setShowEmbedModal(true)}
              className="px-3 py-1.5 border border-navy-line bg-navy-tint hover:bg-navy-tint-2 text-navy text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Embed calendar widget on college career portal"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Embed Widget</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-line bg-surface hover:bg-subtle text-ink-2 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Print Weekly Exam & Deadline Bulletin for Notice Boards"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Campus Bulletin</span>
            </button>

            <button
              onClick={handleExportAllCalendar}
              className="px-3.5 py-1.5 bg-navy-solid hover:bg-navy-strong text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Download .ics schedule for Google Calendar, Apple Calendar, or Outlook"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sync (.ics)</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Event Type Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[12px] font-mono text-muted font-bold mr-1">Event:</span>
            
            <button
              onClick={() => setSelectedType("ALL")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold border transition-colors",
                selectedType === "ALL" ? "bg-navy-solid text-white border-navy" : "bg-surface text-muted border-line hover:border-navy"
              )}
            >
              All Events ({allEvents.length})
            </button>

            <button
              onClick={() => setSelectedType("DEADLINE")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5",
                selectedType === "DEADLINE" ? "bg-saffron-solid text-white border-saffron-bright" : "bg-saffron-tint text-saffron border-saffron-line hover:bg-saffron-tint"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Last dates</span>
            </button>

            <button
              onClick={() => setSelectedType("EXAM")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5",
                selectedType === "EXAM" ? "bg-green-solid text-white border-green" : "bg-green-tint text-green border-green-line hover:bg-green-tint"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Exams</span>
            </button>

            <button
              onClick={() => setSelectedType("ADMIT_CARD")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5",
                selectedType === "ADMIT_CARD" ? "bg-navy-solid text-white border-navy" : "bg-navy-tint text-navy border-navy-line hover:bg-navy-tint"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Admit Cards</span>
            </button>

            <button
              onClick={() => setSelectedType("PLANNED")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5",
                selectedType === "PLANNED" ? "bg-ink-2 text-white border-ink-2" : "bg-subtle text-ink-2 border-line hover:border-navy"
              )}
              title="Dates from UPSC's own calendar of examinations; they may change"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>UPSC plan</span>
            </button>
          </div>

          {/* Scope Toggle */}
          <div className="flex items-center gap-1">
            <span className="text-[12px] font-mono text-muted font-bold">Scope:</span>
            <div className="inline-flex rounded border border-line bg-subtle p-0.5 text-[12px] font-bold">
              <button
                onClick={() => setSelectedScope("ALL")}
                className={cn("px-2 py-0.5 rounded", selectedScope === "ALL" ? "bg-navy-solid text-white" : "text-muted")}
              >
                All
              </button>
              <button
                onClick={() => setSelectedScope("CENTRAL")}
                className={cn("px-2 py-0.5 rounded", selectedScope === "CENTRAL" ? "bg-navy-solid text-white" : "text-muted")}
              >
                Central
              </button>
              <button
                onClick={() => setSelectedScope("STATE")}
                className={cn("px-2 py-0.5 rounded", selectedScope === "STATE" ? "bg-navy-solid text-white" : "text-muted")}
              >
                State
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: MONTHLY CALENDAR MATRIX ================= */}
      {viewFormat === "month" && (
        <div className="bg-surface rounded-lg border border-line p-5 shadow-2xs space-y-4">
          {/* Month Header Switcher */}
          <div className="flex items-center justify-between pb-3 border-b border-line-soft">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-navy" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-ink">
                {monthData.monthName} {monthData.year}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded border border-line hover:bg-navy-tint text-navy transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded border border-line hover:bg-navy-tint text-navy transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[12px] font-bold text-muted uppercase py-1 border-b border-line-soft">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots before first day */}
            {Array.from({ length: monthData.firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[75px] rounded bg-subtle/40 border border-transparent" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: monthData.daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${monthData.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const events = monthData.eventsByDay[day] || [];
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => {
                    if (events.length > 0) {
                      setSelectedDate(isSelected ? null : dateStr);
                    }
                  }}
                  className={cn(
                    "min-h-[85px] p-1.5 rounded-md border flex flex-col justify-between transition-all text-xs",
                    isSelected
                      ? "border-navy ring-2 ring-navy/20 bg-navy-tint/50"
                      : events.length > 0
                      ? "border-line bg-surface hover:border-navy cursor-pointer shadow-2xs"
                      : "border-line-soft bg-subtle text-faint"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("font-mono font-bold text-xs", events.length > 0 ? "text-ink" : "text-faint")}>
                      {day}
                    </span>
                    {events.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-saffron-solid" />
                    )}
                  </div>

                  {/* Tiny Event Badges */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {events.slice(0, 2).map((ev) => {
                      const style = getEventTypeStyles(ev.eventType);
                      return (
                        <div
                          key={ev.id}
                          className={cn("px-1 py-0.5 rounded text-[9px] font-bold truncate leading-tight border", style.bg, style.text, style.border)}
                          title={`${ev.title} (${ev.organization})`}
                        >
                          {ev.code}: {style.label}
                        </div>
                      );
                    })}
                    {events.length > 2 && (
                      <span className="text-[8px] font-mono font-bold text-navy block text-center">
                        +{events.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div className="p-3 bg-navy-tint rounded-md border border-navy-line flex items-center justify-between text-xs">
              <span className="font-semibold text-navy">
                Filtering for: <b className="font-mono">{formatDate(selectedDate)}</b>
              </span>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs font-bold text-saffron hover:underline"
              >
                Clear date filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2 / LIST: CHRONOLOGICAL AGENDA TIMELINE ================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h3 className="font-serif text-lg font-bold text-ink">
            Dates ahead, then recent ones
          </h3>
          <span className="text-[13px] text-muted tabular-nums">
            {filteredEvents.length} dates
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-10 text-center bg-surface rounded-lg border border-line text-muted space-y-2">
            <p className="font-serif text-base font-bold text-ink">
              No events found for the selected criteria
            </p>
            <p className="text-xs">
              Try switching event type to &ldquo;All Events&rdquo; or clearing the date selection.
            </p>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="mt-2 px-3 py-1.5 rounded bg-navy-solid text-white font-bold text-xs shadow-2xs"
              >
                Reset Date Selection
              </button>
            )}
          </div>
        ) : (
          <>
            <ol className="bg-surface rounded-xl border border-line divide-y divide-line-soft overflow-hidden">
              {filteredEvents.slice(0, shown).map((ev) => {
                const styles = getEventTypeStyles(ev.eventType);
                const days = daysUntil(ev.dateStr);
                const job = ev.job;
                const saved = job ? isSaved(job.id) : false;
                const label = ev.plannedLabel || styles.label;
                const googleCalUrl = generateGoogleCalendarUrl({
                  title: `${label}: ${ev.title}`,
                  description: job ? `${job.title}\n\nOfficial notice: ${ev.applyUrl}` : `Planned in UPSC's calendar; dates may change.\n${ev.applyUrl}`,
                  startDate: ev.dateStr,
                  location: ev.place,
                  url: ev.applyUrl,
                });
                return (
                  <li key={ev.id} className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pl-5 pr-3 py-3">
                    <span aria-hidden className={cn("absolute left-0 inset-y-0 w-1", styles.dot)} />
                    <div className="sm:w-28 shrink-0 flex sm:block items-baseline gap-2">
                      <b className="block text-[15px] text-ink tabular-nums">{formatDateShort(ev.dateStr)}</b>
                      <span className={cn("text-[12px] font-semibold", days < 0 ? "text-muted" : days <= 3 ? "text-saffron" : "text-green")}>
                        {days < 0 ? `${-days} day${days === -1 ? "" : "s"} ago` : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `in ${days} days`}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[12px] flex-wrap">
                        <span className={cn("font-bold", styles.text)}>{label}{ev.isTentative ? " (tentative)" : ""}</span>
                        <span className="text-faint" aria-hidden>·</span>
                        <b className="text-navy">{ev.code}</b>
                        <span className="text-muted">{ev.place}</span>
                      </div>
                      <Link href={ev.noticeUrl} className="mt-0.5 block font-semibold text-ink hover:text-navy leading-snug line-clamp-2">
                        {ev.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {job && (
                        <button
                          onClick={() => toggleSave(job.id)}
                          aria-pressed={saved}
                          aria-label={`Save: ${ev.title}`}
                          className={cn("w-11 h-11 flex items-center justify-center rounded-lg", saved ? "text-saffron" : "text-faint hover:text-navy")}
                        >
                          <Bookmark className={cn("w-4 h-4", saved && "fill-saffron-bright")} />
                        </button>
                      )}
                      <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Add to Google Calendar: ${ev.title}`}
                        className="w-11 h-11 flex items-center justify-center rounded-lg text-navy hover:bg-navy-tint"
                      >
                        <CalendarIcon className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => downloadIcsFile({
                          title: `${label}: ${ev.title}`,
                          description: job ? `${job.title}\nOfficial notice: ${ev.applyUrl}` : `Planned in UPSC's calendar; dates may change.\n${ev.applyUrl}`,
                          startDate: ev.dateStr,
                          location: ev.place,
                          url: ev.applyUrl,
                        }, `${job ? job.slug : ev.id}-event.ics`)}
                        aria-label={`Download calendar file: ${ev.title}`}
                        className="w-11 h-11 flex items-center justify-center rounded-lg text-navy hover:bg-navy-tint"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
            {filteredEvents.length > shown && (
              <div className="text-center">
                <button
                  onClick={() => setShown((n) => n + 40)}
                  className="px-4 min-h-[44px] rounded-lg border border-navy-line bg-surface text-sm font-bold text-navy hover:border-navy"
                >
                  Show {Math.min(40, filteredEvents.length - shown)} more of {filteredEvents.length - shown}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* EMBED MODAL FOR PLACEMENT CELLS & LIBRARIES */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl max-w-lg w-full p-6 border border-line shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-navy" />
                <h3 className="font-serif font-bold text-base text-ink">
                  Embed Deadline Calendar on College Portal
                </h3>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="text-muted hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-ink-2 leading-relaxed">
              Universities, student placement boards, training & placement cells (TPO), and library digital kiosks may freely embed this live recruitment deadline calendar.
            </p>

            <div>
              <label className="block text-[12px] font-semibold text-muted mb-1">
                HTML Embed Code (Responsive Widget)
              </label>
              <div className="relative">
                <textarea
                  readOnly
                  rows={3}
                  value={`<iframe src="https://www.indiajobnotice.com/calendar" width="100%" height="750" frameborder="0" title="Government Recruitment Exam & Deadline Calendar"></iframe>`}
                  className="w-full p-2.5 rounded bg-subtle border border-line text-xs font-mono text-ink focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`<iframe src="https://www.indiajobnotice.com/calendar" width="100%" height="750" frameborder="0" title="Government Recruitment Exam & Deadline Calendar"></iframe>`);
                    setCopiedSnippet(true);
                    setTimeout(() => setCopiedSnippet(false), 2000);
                  }}
                  className="absolute right-2 bottom-3 px-2.5 py-1 rounded bg-navy-solid text-white text-[12px] font-bold flex items-center gap-1 shadow-2xs hover:bg-navy-strong"
                >
                  {copiedSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSnippet ? "Copied" : "Copy iFrame"}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-[12px] text-muted bg-green-tint p-3 rounded-lg border border-green-line flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
              <span>Public-interest career resource. Free embed frame for educational institutions.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
