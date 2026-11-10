import { Droplets, Gauge, Thermometer, Wind } from "lucide-react";

import { WeatherIcon } from "@/components/weather/weather-icon";
import {
  formatDateTime,
  formatNumber,
  formatPercent,
  formatTemperature,
  formatWindDirection,
} from "@/lib/utils/format";
import type { WeatherSnapshot } from "@/types/weather";

/**
 * Headline reading for the selected location.
 *
 * The temperature is a hero figure, so it uses proportional figures; the
 * supporting rows align in a column and therefore use tabular ones.
 */
export function CurrentConditions({ snapshot }: { snapshot: WeatherSnapshot }) {
  const { current, units, timezone } = snapshot;

  const details = [
    {
      icon: Thermometer,
      label: "Feels like",
      value: `${formatTemperature(current.apparentTemperature)}${units.temperature}`,
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${formatPercent(current.humidity)}%`,
    },
    {
      icon: Wind,
      label: "Wind",
      value: `${formatNumber(current.windSpeed)} ${units.windSpeed} ${formatWindDirection(current.windDirection)}`,
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${formatNumber(current.pressure)} ${units.pressure}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <WeatherIcon
          name={current.condition.icon}
          className="size-12 shrink-0 text-primary"
        />
        <div className="min-w-0">
          <p className="text-4xl leading-none font-semibold">
            {formatTemperature(current.temperature)}
            <span className="ml-1 text-xl font-normal text-muted-foreground">
              {units.temperature}
            </span>
          </p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {current.condition.label}
            {current.precipitationProbability !== null
              ? ` · ${formatPercent(current.precipitationProbability)}% rain chance`
              : ""}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {details.map((detail) => (
          <div key={detail.label} className="flex items-center gap-2">
            <detail.icon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <dt className="text-xs text-muted-foreground">{detail.label}</dt>
            <dd className="tabular ml-auto text-sm font-medium">
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-xs text-muted-foreground">
        Observed {formatDateTime(current.observedAt, timezone)} (
        {snapshot.timezoneAbbreviation})
      </p>
    </div>
  );
}
