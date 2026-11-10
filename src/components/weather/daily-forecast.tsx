import { WeatherIcon } from "@/components/weather/weather-icon";
import {
  formatPercent,
  formatTemperature,
  formatWeekday,
} from "@/lib/utils/format";
import type { DailyPoint } from "@/types/weather";

/**
 * Seven-day outlook as a compact list.
 *
 * A list rather than a chart: the story is seven pairs of numbers, which a
 * reader scans faster in rows than they decode from a plot.
 */
export function DailyForecast({
  days,
  timezone,
  temperatureUnit,
}: {
  days: readonly DailyPoint[];
  timezone: string;
  temperatureUnit: string;
}) {
  return (
    <ul className="divide-y">
      {days.map((day, index) => (
        <li
          key={day.date}
          className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"
        >
          <span className="w-10 shrink-0 text-sm font-medium">
            {index === 0 ? "Today" : formatWeekday(day.date, timezone)}
          </span>
          <WeatherIcon
            name={day.condition.icon}
            className="size-4 shrink-0 text-muted-foreground"
          />
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {day.condition.label}
          </span>
          <span className="tabular w-10 shrink-0 text-right text-xs text-muted-foreground">
            {day.precipitationProbabilityMax === null
              ? "—"
              : `${formatPercent(day.precipitationProbabilityMax)}%`}
          </span>
          <span className="tabular w-16 shrink-0 text-right text-sm">
            <span className="font-medium">
              {formatTemperature(day.temperatureMax)}
            </span>
            <span className="text-muted-foreground">
              {" / "}
              {formatTemperature(day.temperatureMin)}
              {temperatureUnit}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
