"use client";

import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";

import { ErrorState } from "@/components/common/error-state";
import { WidgetCard } from "@/components/common/widget-card";
import { CurrentConditions } from "@/components/weather/current-conditions";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "@/hooks/use-location";
import { useWeather } from "@/hooks/use-weather";
import { formatDateTime } from "@/lib/utils/format";

/**
 * Recharts is a large dependency and the chart is below the fold on mobile, so
 * it is code-split and never part of the initial bundle. `ssr: false` because
 * the plot measures its container, which only exists in the browser.
 */
const TemperatureChart = dynamic(
  () =>
    import("@/components/charts/temperature-chart").then(
      (mod) => mod.TemperatureChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 w-full rounded-md" />,
  },
);

interface WeatherWidgetProps {
  /** Whether to include the hourly chart and the 7-day list. */
  detailed?: boolean;
}

export function WeatherWidget({ detailed = false }: WeatherWidgetProps) {
  const { location } = useLocation();
  const { data, isPending, isError, isFetching, refetch } =
    useWeather(location);

  return (
    <WidgetCard
      title="Weather"
      description={`Current conditions for ${location.name}`}
      source="Open-Meteo Forecast API"
      observedAt={
        data
          ? formatDateTime(data.current.observedAt, data.timezone)
          : undefined
      }
      action={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh weather"
        >
          <RotateCcw className="size-4" aria-hidden />
        </Button>
      }
    >
      {isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError || !data ? (
        <ErrorState
          title="Weather unavailable"
          description="Open-Meteo did not return a reading for this location."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void refetch()}
            >
              Try again
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          <CurrentConditions snapshot={data} />

          {detailed ? (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Hourly temperature</h3>
                <TemperatureChart
                  points={data.hourly.slice(0, 48)}
                  timezone={data.timezone}
                  temperatureUnit={data.units.temperature}
                  isRefreshing={isFetching}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Next 7 days</h3>
                <DailyForecast
                  days={data.daily}
                  timezone={data.timezone}
                  temperatureUnit={data.units.temperature}
                />
              </div>
            </>
          ) : (
            <DailyForecast
              days={data.daily.slice(0, 4)}
              timezone={data.timezone}
              temperatureUnit={data.units.temperature}
            />
          )}
        </div>
      )}
    </WidgetCard>
  );
}
