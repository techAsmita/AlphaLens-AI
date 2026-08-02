import { useEffect, useState } from "react";

/**
 * Returns the current Date, updated once per second. Used to drive the
 * live clock in the Analysis Workspace header. This is a text update, not
 * a decorative animation, so it runs regardless of the user's
 * prefers-reduced-motion setting.
 */
export function useClock(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
}

/** Formats a Date as a 24-hour HH:MM:SS string, independent of locale. */
export function formatClock(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
