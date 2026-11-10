import { z } from "zod";

import { UpstreamError } from "@/lib/api/errors";
import { fetchJson } from "@/lib/api/http";
import { API_ENDPOINTS, REVALIDATE } from "@/lib/constants/api";
import { resolveWeatherCondition } from "@/lib/constants/weather-codes";
import type { Coordinates } from "@/types/location";
import type { DailyPoint, HourlyPoint, WeatherSnapshot } from "@/types/weather";

const CURRENT_FIELDS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
  "surface_pressure",
] as const;

const HOURLY_FIELDS = [
  "temperature_2m",
  "precipitation_probability",
  "weather_code",
  "relative_humidity_2m",
] as const;

const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "sunrise",
  "sunset",
] as const;

/**
 * Shape of the Open-Meteo forecast response, verified against a live request.
 *
 * Numeric series are nullable because the provider emits null for hours it
 * cannot model; the schema says so rather than letting a null slip through as
 * a number.
 */
const responseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  utc_offset_seconds: z.number(),
  current_units: z.object({
    temperature_2m: z.string(),
    wind_speed_10m: z.string(),
    precipitation: z.string(),
    surface_pressure: z.string(),
  }),
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    apparent_temperature: z.number(),
    is_day: z.number(),
    precipitation: z.number(),
    weather_code: z.number(),
    wind_speed_10m: z.number(),
    wind_direction_10m: z.number(),
    surface_pressure: z.number(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number().nullable()),
    precipitation_probability: z.array(z.number().nullable()),
    weather_code: z.array(z.number().nullable()),
    relative_humidity_2m: z.array(z.number().nullable()),
  }),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number().nullable()),
    temperature_2m_max: z.array(z.number().nullable()),
    temperature_2m_min: z.array(z.number().nullable()),
    precipitation_probability_max: z.array(z.number().nullable()),
    sunrise: z.array(z.string()),
    sunset: z.array(z.string()),
  }),
});

function buildUrl({ latitude, longitude }: Coordinates): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS.join(","),
    hourly: HOURLY_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    timezone: "auto",
    forecast_days: "7",
  });

  return `${API_ENDPOINTS.weather}?${params.toString()}`;
}

/**
 * Open-Meteo returns the current reading on a 15-minute grid but hourly
 * probabilities on the hour, so the probability for "now" has to be looked up
 * by truncating to the hour. Returns null when the hour is not in the series.
 */
function findHourlyProbability(
  currentTime: string,
  times: readonly string[],
  probabilities: readonly (number | null)[],
): number | null {
  const hourKey = `${currentTime.slice(0, 13)}:00`;
  const index = times.indexOf(hourKey);
  if (index === -1) return null;
  return probabilities[index] ?? null;
}

function normalizeHourly(
  hourly: z.infer<typeof responseSchema>["hourly"],
): readonly HourlyPoint[] {
  const points: HourlyPoint[] = [];

  hourly.time.forEach((time, index) => {
    const temperature = hourly.temperature_2m[index];
    // A point without a temperature cannot be plotted, so it is dropped
    // rather than rendered as a gap at zero.
    if (temperature === null || temperature === undefined) return;

    points.push({
      time,
      temperature,
      precipitationProbability: hourly.precipitation_probability[index] ?? null,
      humidity: hourly.relative_humidity_2m[index] ?? null,
      condition: resolveWeatherCondition(hourly.weather_code[index] ?? -1),
    });
  });

  return points;
}

function normalizeDaily(
  daily: z.infer<typeof responseSchema>["daily"],
): readonly DailyPoint[] {
  const points: DailyPoint[] = [];

  daily.time.forEach((date, index) => {
    const max = daily.temperature_2m_max[index];
    const min = daily.temperature_2m_min[index];
    if (max === null || max === undefined) return;
    if (min === null || min === undefined) return;

    points.push({
      date,
      temperatureMax: max,
      temperatureMin: min,
      precipitationProbabilityMax:
        daily.precipitation_probability_max[index] ?? null,
      sunrise: daily.sunrise[index] ?? "",
      sunset: daily.sunset[index] ?? "",
      condition: resolveWeatherCondition(daily.weather_code[index] ?? -1),
    });
  });

  return points;
}

/** Fetches, validates and normalises the forecast for one location. */
export async function getWeather(
  coordinates: Coordinates,
): Promise<WeatherSnapshot> {
  const payload = await fetchJson(buildUrl(coordinates), {
    revalidate: REVALIDATE.weather,
    tag: "weather",
  });

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new UpstreamError(
      "upstream_invalid_response",
      "The weather provider returned data in an unexpected shape.",
      502,
    );
  }

  const { data } = parsed;

  return {
    coordinates: { latitude: data.latitude, longitude: data.longitude },
    timezone: data.timezone,
    timezoneAbbreviation: data.timezone_abbreviation,
    utcOffsetSeconds: data.utc_offset_seconds,
    units: {
      temperature: data.current_units.temperature_2m,
      windSpeed: data.current_units.wind_speed_10m,
      precipitation: data.current_units.precipitation,
      pressure: data.current_units.surface_pressure,
    },
    current: {
      observedAt: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      precipitationProbability: findHourlyProbability(
        data.current.time,
        data.hourly.time,
        data.hourly.precipitation_probability,
      ),
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      pressure: data.current.surface_pressure,
      isDay: data.current.is_day === 1,
      condition: resolveWeatherCondition(data.current.weather_code),
    },
    hourly: normalizeHourly(data.hourly),
    daily: normalizeDaily(data.daily),
    fetchedAt: new Date().toISOString(),
  };
}
