"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartShell } from "@/components/charts/chart-shell";
import { ChartTooltipContent } from "@/components/charts/chart-tooltip";
import { formatPercent, formatTime } from "@/lib/utils/format";
import type { HourlyPoint } from "@/types/weather";

interface TemperatureChartProps {
  points: readonly HourlyPoint[];
  timezone: string;
  temperatureUnit: string;
  isRefreshing?: boolean;
}

interface Datum {
  time: string;
  label: string;
  temperature: number;
  probability: number | null;
}

/**
 * Hourly temperature.
 *
 * One series, so there is no legend — the card title names it. Precipitation
 * probability is a different scale and is therefore NOT plotted on a second
 * axis; it appears in the tooltip and the table instead.
 */
export function TemperatureChart({
  points,
  timezone,
  temperatureUnit,
  isRefreshing,
}: TemperatureChartProps) {
  const data: Datum[] = points.map((point) => ({
    time: point.time,
    label: formatTime(point.time, timezone),
    temperature: point.temperature,
    probability: point.precipitationProbability,
  }));

  const chart = (
    // Height includes room for the x-axis band, so the card never grows a
    // nested scrollbar to reach the tick labels.
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 4, right: 8, bottom: 0, left: -18 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeWidth={1}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={36}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            unit={temperatureUnit}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const datum = payload[0]?.payload as Datum | undefined;
              if (!datum) return null;

              return (
                <ChartTooltipContent
                  heading={datum.label}
                  rows={[
                    {
                      label: "Temperature",
                      value: `${datum.temperature.toFixed(1)}${temperatureUnit}`,
                      color: "var(--chart-1)",
                    },
                    {
                      label: "Rain chance",
                      value:
                        datum.probability === null
                          ? "—"
                          : `${formatPercent(datum.probability)}%`,
                    },
                  ]}
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: "var(--card)",
              fill: "var(--chart-1)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const table = (
    <div className="max-h-56 overflow-auto rounded-md border">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Hourly temperature and rain probability
        </caption>
        <thead className="sticky top-0 bg-card">
          <tr className="border-b text-left">
            <th scope="col" className="px-3 py-2 font-medium">
              Time
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Temp ({temperatureUnit})
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Rain
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((datum) => (
            <tr key={datum.time} className="border-b last:border-0">
              <th scope="row" className="px-3 py-1.5 font-normal">
                {datum.label}
              </th>
              <td className="tabular px-3 py-1.5 text-right">
                {datum.temperature.toFixed(1)}
              </td>
              <td className="tabular px-3 py-1.5 text-right text-muted-foreground">
                {datum.probability === null
                  ? "—"
                  : `${formatPercent(datum.probability)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ChartShell
      label="Hourly temperature"
      chart={chart}
      table={table}
      isRefreshing={isRefreshing}
    />
  );
}
