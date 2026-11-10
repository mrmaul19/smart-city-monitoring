"use client";

import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";

import { AqiMeter } from "@/components/air-quality/aqi-meter";
import { PollutantTable } from "@/components/air-quality/pollutant-table";
import { ErrorState } from "@/components/common/error-state";
import { WidgetCard } from "@/components/common/widget-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAirQuality } from "@/hooks/use-air-quality";
import { useLocation } from "@/hooks/use-location";
import { formatDateTime } from "@/lib/utils/format";

const AirQualityChart = dynamic(
  () =>
    import("@/components/charts/air-quality-chart").then(
      (mod) => mod.AirQualityChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 w-full rounded-md" />,
  },
);

export function AirQualityWidget({ detailed = false }: { detailed?: boolean }) {
  const { location } = useLocation();
  const { data, isPending, isError, isFetching, refetch } =
    useAirQuality(location);

  return (
    <WidgetCard
      title="Air quality"
      description={`Modelled readings for ${location.name}`}
      source="Open-Meteo Air Quality API (CAMS model)"
      observedAt={
        data ? formatDateTime(data.observedAt, data.timezone) : undefined
      }
      action={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh air quality"
        >
          <RotateCcw className="size-4" aria-hidden />
        </Button>
      }
    >
      {isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isError || !data ? (
        <ErrorState
          title="Air quality unavailable"
          description="Open-Meteo did not return readings for this location."
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
          <div className="grid gap-3 sm:grid-cols-2">
            <AqiMeter
              title="European AQI"
              index={data.europeanAqi}
              scaleMax={100}
              scaleNote="EEA index. Above 100 is off-scale."
            />
            <AqiMeter
              title="US AQI"
              index={data.usAqi}
              scaleMax={500}
              scaleNote="US EPA index, 0 to 500."
            />
          </div>

          <PollutantTable pollutants={data.pollutants} />

          {detailed ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Particulate matter, past 48 hours
              </h3>
              <AirQualityChart
                points={data.hourly}
                timezone={data.timezone}
                isRefreshing={isFetching}
              />
            </div>
          ) : null}
        </div>
      )}
    </WidgetCard>
  );
}
