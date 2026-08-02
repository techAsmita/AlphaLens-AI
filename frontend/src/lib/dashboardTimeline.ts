export interface TimelineEntry {
  time: string;
  label: string;
}

/**
 * Illustrative record of the analysis run, shown as a static bottom
 * timeline (not live-generated — a completed run's log).
 */
export const DASHBOARD_TIMELINE: TimelineEntry[] = [
  { time: "08:42", label: "Transcript Parsed" },
  { time: "08:43", label: "Sentiment Detected" },
  { time: "08:44", label: "Guidance Flagged" },
  { time: "08:45", label: "Report Generated" },
];
