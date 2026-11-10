/**
 * Formatting helpers.
 *
 * All of them accept the timezone the upstream provider reported, so a reading
 * is shown in the monitored city's local time rather than the viewer's.
 */

const INVALID = "—";

function safeDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Rounds to whole degrees; readings are never precise enough to justify more. */
export function formatTemperature(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return INVALID;
  return String(Math.round(value));
}

export function formatNumber(value: number | null, digits = 1): string {
  if (value === null || !Number.isFinite(value)) return INVALID;
  return value.toFixed(digits).replace(/\.0$/, "");
}

export function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return INVALID;
  return String(Math.round(value));
}

/** Clock time, e.g. "14:00". */
export function formatTime(value: string, timeZone?: string): string {
  const date = safeDate(value);
  if (!date) return INVALID;

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

/** Short weekday, e.g. "Tue". */
export function formatWeekday(value: string, timeZone?: string): string {
  const date = safeDate(value);
  if (!date) return INVALID;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

/** Date and time together, e.g. "10 Nov, 23:15". */
export function formatDateTime(value: string, timeZone?: string): string {
  const date = safeDate(value);
  if (!date) return INVALID;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

/**
 * Elapsed time in words, e.g. "2 min ago".
 *
 * Used for snapshot freshness. Deliberately coarse: claiming second-level
 * precision on a value that is cached for a minute would overstate it.
 */
export function formatRelativeTime(value: string, now = Date.now()): string {
  const date = safeDate(value);
  if (!date) return INVALID;

  const seconds = Math.round((now - date.getTime()) / 1000);

  if (seconds < 0) return "just now";
  if (seconds < 60) return "just now";

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

/** Compass point for a wind bearing in degrees. */
export function formatWindDirection(degrees: number | null): string {
  if (degrees === null || !Number.isFinite(degrees)) return INVALID;

  const points = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ] as const;

  const index = Math.round(((degrees % 360) / 360) * 16) % 16;
  return points[index] ?? INVALID;
}

export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}
