import type { Coordinates } from "@/types/location";

/** Shared severity scale, mapped to the theme's status tokens. */
export type AirQualityBand =
  "good" | "fair" | "moderate" | "poor" | "very-poor" | "extremely-poor";

export interface AirQualityIndex {
  value: number;
  band: AirQualityBand;
  label: string;
  /** Short, non-alarmist guidance for the band. */
  advice: string;
}

/** A single pollutant reading. `value` is null when the provider omits it. */
export interface PollutantReading {
  key:
    | "pm2_5"
    | "pm10"
    | "nitrogen_dioxide"
    | "ozone"
    | "sulphur_dioxide"
    | "carbon_monoxide";
  label: string;
  value: number | null;
  unit: string;
}

export interface AirQualityHourlyPoint {
  time: string;
  pm2_5: number | null;
  pm10: number | null;
  europeanAqi: number | null;
  usAqi: number | null;
}

export interface AirQualitySnapshot {
  coordinates: Coordinates;
  timezone: string;
  /** Upstream observation time, ISO 8601 in the location's timezone. */
  observedAt: string;
  europeanAqi: AirQualityIndex | null;
  usAqi: AirQualityIndex | null;
  pollutants: readonly PollutantReading[];
  hourly: readonly AirQualityHourlyPoint[];
  fetchedAt: string;
}
