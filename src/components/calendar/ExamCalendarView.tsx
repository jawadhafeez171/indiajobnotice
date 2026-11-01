"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Bookmark,
  ArrowRight,
  Filter,
  Printer,
  Code,
  Copy,
  Check
} from "lucide-react";
import { JobNotification, getCategoryColors } from "@/data/jobs";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { generateGoogleCalendarUrl, downloadIcsFile, downloadCombinedIcsFile, CalendarEventParams } from "@/lib/calendar";
import { useWatchlist } from "@/lib/watchlist";
import { TricolorCapsule } from "@/components/common/BrandLogo";

export type EventType = "DEADLINE" | "EXAM" | "ADMIT_CARD" | "RESULT";

export interface CalendarEventItem {
  id: string;
  jobId: string;
  job: JobNotification;
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
function parseIndianExamDate(dateStr: string, fallbackMonth = "2026-11-15"): string {
  if (!dateStr) return fallbackMonth;
  // If already standard ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Try extracting e.g. "13 December 2026"
  const dayMonthYear = dateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (dayMonthYear) {
    const day = parseInt(dayMonthYear[1], 10);
    const monthName = dayMonthYear[2].toLowerCase();
    const year = parseInt(dayMonthYear[3], 10);
    const monthsMap: Record<string, number> = {
      jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
      may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, september: 8,
      oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
    };
    const m = monthsMap[monthName] ?? 10;
    const d = new Date(year, m, day);
    return d.toISOString().slice(0, 10);
  }

  // Range like "18 to 26 October 2026"
  const rangeMatch = dateStr.match(/(\d{1,2})\s+to\s+\d{1,2}\s+([A-Za-z]+)\s+(\d{4})/);
  if (rangeMatch) {
    const day = parseInt(rangeMatch[1], 10);
    const monthName = rangeMatch[2].toLowerCase();
    const year = parseInt(rangeMatch[3], 10);
    const monthsMap: Record<string, number> = {
      oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11, jan: 0, january: 0
    };
    const m = monthsMap[monthName] ?? 9;
    return new Date(year, m, day).toISOString().slice(0, 10);
  }

  // Month + Year like "December 2026" or "January 2027"
  const monthYear = dateStr.match(/([A-Za-z]+)\s+(\d{4})/);
  if (monthYear) {
    const monthName = monthYear[1].toLowerCase();
    const year = parseInt(monthYear[2], 10);
    const monthsMap: Record<string, string> = {
      january: "01-15", february: "02-15", march: "03-15", april: "04-15",
      may: "05-15", june: "06-15", july: "07-15", august: "08-15",
      september: "09-15", october: "10-15", november: "11-15", december: "12-15"
    };
    const suffix = monthsMap[monthName] || "11-15";
    return `${year}-${suffix}`;
  }

  return fallbackMonth;
}

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

  // Build unified calendar events list from the published jobs
  const allEvents: CalendarEventItem[] = useMemo(() => {
    const events: CalendarEventItem[] = [];

    jobs.forEach((job) => {
      const noticeUrl = job.isCentral ? `/jobs/${job.slug}` : `/state/${job.stateSlug}/jobs/${job.slug}`;

      // 1. Application Deadline
      if (job.applicationEndDate) {
        events.push({
          id: `${job.id}-deadline`,
          jobId: job.id,
          job,
          eventType: "DEADLINE",
          title: `Application Closes: ${job.shortTitle}`,
          organization: job.organization,
          dateStr: job.applicationEndDate,
          rawDateLabel: formatDate(job.applicationEndDate),
          applyUrl: job.applyOnlineUrl,
          noticeUrl,
        });
      }

      // 2. Exam Date
      // an exam date that cannot be read as a date is left off the calendar, not given a made-up one
      const examDate = job.examDate ?? "";
      const parsedDate = examDate ? parseIndianExamDate(examDate, "") : "";
      if (parsedDate && !examDate.toLowerCase().includes("done")) {
        events.push({
          id: `${job.id}-exam`,
          jobId: job.id,
          job,
          eventType: "EXAM",
          title: `Exam Date: ${job.shortTitle}`,
          organization: job.organization,
          dateStr: parsedDate,
          rawDateLabel: examDate,
          isTentative: examDate.toLowerCase().includes("expected") || !/\d{1,2}\s+[A-Za-z]+/.test(examDate),
          applyUrl: job.applyOnlineUrl,
          noticeUrl,
        });
      }

      // 3. Admit Card
      if (job.status === "ADMIT_CARD_OUT") {
        events.push({
          id: `${job.id}-admit`,
          jobId: job.id,
          job,
          eventType: "ADMIT_CARD",
          title: `Hall Ticket Live: ${job.shortTitle}`,
          organization: job.organization,
          dateStr: "2026-10-18",
          rawDateLabel: "Available Now",
          applyUrl: job.applyOnlineUrl,
          noticeUrl,
        });
      }

      // 4. Result
      if (job.status === "RESULT_OUT") {
        events.push({
          id: `${job.id}-result`,
          jobId: job.id,
          job,
          eventType: "RESULT",
          title: `Result Declared: ${job.shortTitle}`,
          organization: job.organization,
          dateStr: "2026-10-10",
          rawDateLabel: "Published",
          applyUrl: job.applyOnlineUrl,
          noticeUrl,
        });
      }
    });

    // Sort chronologically
    return events.sort((a, b) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime());
  }, [jobs]);

  // Filter events by selected category, scope, and optional clicked calendar date
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (selectedType !== "ALL" && ev.eventType !== selectedType) return false;
      if (selectedScope === "CENTRAL" && !ev.job.isCentral) return false;
      if (selectedScope === "STATE" && ev.job.isCentral) return false;
      if (selectedDate && ev.dateStr !== selectedDate) return false;
      return true;
    });
  }, [allEvents, selectedType, selectedScope, selectedDate]);

  // Bulk download all filtered events as an .ics calendar file
  const handleExportAllCalendar = () => {
    const paramsList: CalendarEventParams[] = filteredEvents.map((ev) => ({
      title: `${ev.title} (${ev.organization})`,
      description: `Official IndiaJobNotice Notification for ${ev.job.title}.\nPosts: ${ev.job.totalVacancies.toLocaleString()}\nApply: ${ev.applyUrl}`,
      startDate: ev.dateStr,
      location: ev.job.isCentral ? "All India / Central" : `${ev.job.stateSlug.toUpperCase()} State`,
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
          label: "Deadline",
        };
      case "EXAM":
        return {
          bg: "bg-green-tint",
          text: "text-green",
          border: "border-green-line",
          badge: "bg-green-solid text-white",
          dot: "bg-green-solid",
          label: "Exam Date",
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
          label: "Result Out",
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
              <span>Application Closes</span>
            </button>

            <button
              onClick={() => setSelectedType("EXAM")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5",
                selectedType === "EXAM" ? "bg-green-solid text-white border-green" : "bg-green-tint text-green border-green-line hover:bg-green-tint"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Exam / CBT Dates</span>
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
                          {ev.job.orgShortCode}: {style.label}
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
            Upcoming Events Schedule
          </h3>
          <span className="text-xs font-mono font-bold text-navy">
            {filteredEvents.length} Events Listed
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
          <div className="space-y-3">
            {filteredEvents.map((ev) => {
              const styles = getEventTypeStyles(ev.eventType);
              const days = getDaysRemaining(ev.dateStr);
              const isUrgent = days > 0 && days <= 5;
              const isPast = days < 0;
              const saved = isSaved(ev.job.id);
              const googleCalUrl = generateGoogleCalendarUrl({
                title: ev.title,
                description: `Official Notification for ${ev.job.title} (${ev.job.totalVacancies} Posts).\n\nApply at: ${ev.applyUrl}`,
                startDate: ev.dateStr,
                location: ev.job.isCentral ? "All India" : `${ev.job.stateSlug.toUpperCase()} State`,
                url: ev.applyUrl,
              });

              return (
                <div
                  key={ev.id}
                  className="bg-surface rounded-lg border border-line hover:border-navy/40 p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs relative overflow-hidden"
                >
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1", styles.dot)} />

                  {/* Left: Date & Status Block */}
                  <div className="flex items-start sm:items-center gap-3.5 pl-1.5">
                    <div className="w-16 h-16 rounded-md bg-subtle border border-line flex flex-col items-center justify-center text-center shrink-0">
                      <span className="font-mono text-[11px] uppercase font-bold text-muted">
                        {new Date(ev.dateStr).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="font-serif font-bold text-xl text-ink leading-none my-0.5">
                        {new Date(ev.dateStr).getDate()}
                      </span>
                      <span className="font-mono text-[9px] text-faint">
                        {new Date(ev.dateStr).getFullYear()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-bold border", styles.bg, styles.text, styles.border)}>
                          {styles.label}
                        </span>

                        <span className="text-[12px] font-mono uppercase font-bold text-muted">
                          {ev.job.orgShortCode} · {ev.job.isCentral ? "Central" : ev.job.stateSlug.toUpperCase()}
                        </span>

                        {isPast ? (
                          <span className="text-[11px] text-[#888] font-mono">Concluded</span>
                        ) : isUrgent ? (
                          <span className="text-[11px] text-saffron font-mono font-bold bg-saffron-tint px-1.5 py-0.2 rounded border border-saffron-line">
                            {days} {days === 1 ? "day" : "days"} left!
                          </span>
                        ) : (
                          <span className="text-[11px] text-green font-mono font-bold">
                            In {days} days
                          </span>
                        )}
                      </div>

                      <Link
                        href={ev.noticeUrl}
                        className="font-serif text-base font-bold text-ink hover:text-navy transition-colors line-clamp-1"
                      >
                        {ev.title}
                      </Link>

                      <p className="text-xs text-muted mt-0.5 font-medium line-clamp-1">
                        {ev.organization} · {ev.job.totalVacancies.toLocaleString()} Vacancies
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 pl-1.5 md:pl-0 shrink-0 flex-wrap">
                    {/* Watchlist Pin */}
                    <button
                      onClick={() => toggleSave(ev.job.id)}
                      className={cn(
                        "p-2 rounded-md border text-xs font-bold transition-colors flex items-center gap-1",
                        saved
                          ? "bg-saffron-tint text-saffron border-saffron-line"
                          : "bg-surface text-muted border-line hover:border-navy"
                      )}
                      title={saved ? "Unpin notice" : "Pin notice to Watchlist"}
                    >
                      <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-saffron-bright")} />
                      <span className="hidden sm:inline">{saved ? "Pinned" : "Pin"}</span>
                    </button>

                    {/* Google Calendar Link */}
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-md bg-navy-tint text-navy border border-navy-line hover:bg-navy-tint-2 text-xs font-bold transition-colors flex items-center gap-1"
                      title="Add this event to your Google Calendar"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Google Cal</span>
                    </a>

                    {/* Download individual .ics */}
                    <button
                      onClick={() => {
                        downloadIcsFile({
                          title: ev.title,
                          description: `Recruitment notice: ${ev.job.title}\nTotal Posts: ${ev.job.totalVacancies}\nApply: ${ev.applyUrl}`,
                          startDate: ev.dateStr,
                          location: ev.job.isCentral ? "All India" : `${ev.job.stateSlug.toUpperCase()} State`,
                          url: ev.applyUrl,
                        }, `${ev.job.slug}-event.ics`);
                      }}
                      className="p-2 rounded-md bg-subtle border border-line hover:bg-navy-tint text-navy transition-colors"
                      title="Download .ics file"
                      aria-label="Download .ics"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* View Details */}
                    <Link
                      href={ev.noticeUrl}
                      className="px-3 py-1.5 rounded-md bg-saffron-solid hover:bg-saffron-strong text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
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
              <label className="block text-[12px] font-mono uppercase font-bold text-muted mb-1">
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
