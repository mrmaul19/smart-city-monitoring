import type { Coordinates } from "@/types/location";

/** Severity-free description of a WMO weather code. */
export interface WeatherCondition {
  code: number;
  label: string;
  /** Lucide icon name resolved by the weather icon component. */
  icon: string;
}

export interface CurrentWeather {
  /** Upstream observation time, ISO 8601 in the location's timezone. */
  observedAt: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  /** Probability for the current hour; null when the hour is not covered. */
  precipitationProbability: number | null;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  isDay: boolean;
  condition: WeatherCondition;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  precipitationProbability: number | null;
  humidity: number | null;
  condition: WeatherCondition;
}

export interface DailyPoint {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbabilityMax: number | null;
  sunrise: string;
  sunset: string;
  condition: WeatherCondition;
}

export interface WeatherUnits {
  temperature: string;
  windSpeed: string;
  precipitation: string;
  pressure: string;
}

export interface WeatherSnapshot {
  coordinates: Coordinates;
  timezone: string;
  timezoneAbbreviation: string;
  utcOffsetSeconds: number;
  units: WeatherUnits;
  current: CurrentWeather;
  hourly: readonly HourlyPoint[];
  daily: readonly DailyPoint[];
  /** When this application fetched the data, as opposed to when it was observed. */
  fetchedAt: string;
}
