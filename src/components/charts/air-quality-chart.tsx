"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartShell } from "@/components/charts/chart-shell";
import { ChartTooltipContent } from "@/components/charts/chart-tooltip";
import { formatNumber, formatDateTime } from "@/lib/utils/format";
import type { AirQualityHourlyPoint } from "@/types/air-quality";

interface AirQualityChartProps {
  points: readonly AirQualityHourlyPoint[];
  timezone: string;
  isRefreshing?: boolean;
}

interface Datum {
  time: string;
  label: string;
  pm2_5: number | null;
  pm10: number | null;
}

/**
 * Particulate matter over the recent past.
 *
 * PM2.5 and PM10 share a unit (µg/m³), so they share one axis. Two series
 * means a legend is always present, and the table twin carries exact values.
 */
export function AirQualityChart({
  points,
  timezone,
  isRefreshing,
}: AirQualityChartProps) {
  const data: Datum[] = points.map((point) => ({
    time: point.time,
    label: formatDateTime(point.time, timezone),
    pm2_5: point.pm2_5,
    pm10: point.pm10,
  }));

  const series = [
    { key: "pm2_5" as const, label: "PM2.5", color: "var(--chart-1)" },
    { key: "pm10" as const, label: "PM10", color: "var(--chart-2)" },
  ];

  const chart = (
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
            minTickGap={56}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
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
                  rows={series.map((item) => ({
                    label: item.label,
                    value:
                      datum[item.key] === null
                        ? "—"
                        : `${formatNumber(datum[item.key])} µg/m³`,
                    color: item.color,
                  }))}
                />
              );
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={28}
            iconType="plainline"
            iconSize={12}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
          {series.map((item) => (
            <Line
              key={item.key}
              name={item.label}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: "var(--card)",
                fill: item.color,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const table = (
    <div className="max-h-56 overflow-auto rounded-md border">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Hourly PM2.5 and PM10 concentrations in micrograms per cubic metre
        </caption>
        <thead className="sticky top-0 bg-card">
          <tr className="border-b text-left">
            <th scope="col" className="px-3 py-2 font-medium">
              Time
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              PM2.5
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              PM10
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
                {datum.pm2_5 === null ? "—" : formatNumber(datum.pm2_5)}
              </td>
              <td className="tabular px-3 py-1.5 text-right">
                {datum.pm10 === null ? "—" : formatNumber(datum.pm10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ChartShell
      label="PM2.5 and PM10 over time"
      chart={chart}
      table={table}
      isRefreshing={isRefreshing}
    />
  );
}
