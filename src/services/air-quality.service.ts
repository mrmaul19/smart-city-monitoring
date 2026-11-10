import { z } from "zod";

import { UpstreamError } from "@/lib/api/errors";
import { fetchJson } from "@/lib/api/http";
import {
  POLLUTANT_META,
  classifyEuropeanAqi,
  classifyUsAqi,
} from "@/lib/constants/air-quality";
import { API_ENDPOINTS, REVALIDATE } from "@/lib/constants/api";
import type {
  AirQualityHourlyPoint,
  AirQualitySnapshot,
  PollutantReading,
} from "@/types/air-quality";
import type { Coordinates } from "@/types/location";

const CURRENT_FIELDS = [
  "pm10",
  "pm2_5",
  "nitrogen_dioxide",
  "ozone",
  "sulphur_dioxide",
  "carbon_monoxide",
  "european_aqi",
  "us_aqi",
] as const;

const HOURLY_FIELDS = ["pm2_5", "pm10", "european_aqi", "us_aqi"] as const;

/**
 * Open-Meteo air quality response. Every current reading is nullable: the CAMS
 * model does not cover all pollutants everywhere, and the provider returns
 * null rather than omitting the key.
 */
const responseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  current: z.object({
    time: z.string(),
    pm10: z.number().nullable(),
    pm2_5: z.number().nullable(),
    nitrogen_dioxide: z.number().nullable(),
    ozone: z.number().nullable(),
    sulphur_dioxide: z.number().nullable(),
    carbon_monoxide: z.number().nullable(),
    european_aqi: z.number().nullable(),
    us_aqi: z.number().nullable(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    pm2_5: z.array(z.number().nullable()),
    pm10: z.array(z.number().nullable()),
    european_aqi: z.array(z.number().nullable()),
    us_aqi: z.array(z.number().nullable()),
  }),
});

type Current = z.infer<typeof responseSchema>["current"];

function buildUrl({ latitude, longitude }: Coordinates): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS.join(","),
    hourly: HOURLY_FIELDS.join(","),
    timezone: "auto",
    // Two days of history gives the trend chart something to show without
    // pulling a week of data the dashboard never displays.
    past_days: "2",
    forecast_days: "1",
  });

  return `${API_ENDPOINTS.airQuality}?${params.toString()}`;
}

function normalizePollutants(current: Current): readonly PollutantReading[] {
  return POLLUTANT_META.map((meta) => ({
    ...meta,
    value: current[meta.key],
  }));
}

function normalizeHourly(
  hourly: z.infer<typeof responseSchema>["hourly"],
): readonly AirQualityHourlyPoint[] {
  return hourly.time.map((time, index) => ({
    time,
    pm2_5: hourly.pm2_5[index] ?? null,
    pm10: hourly.pm10[index] ?? null,
    europeanAqi: hourly.european_aqi[index] ?? null,
    usAqi: hourly.us_aqi[index] ?? null,
  }));
}

/** Fetches, validates and normalises air quality for one location. */
export async function getAirQuality(
  coordinates: Coordinates,
): Promise<AirQualitySnapshot> {
  const payload = await fetchJson(buildUrl(coordinates), {
    revalidate: REVALIDATE.airQuality,
    tag: "air-quality",
  });

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new UpstreamError(
      "upstream_invalid_response",
      "The air quality provider returned data in an unexpected shape.",
      502,
    );
  }

  const { data } = parsed;

  return {
    coordinates: { latitude: data.latitude, longitude: data.longitude },
    timezone: data.timezone,
    observedAt: data.current.time,
    europeanAqi: classifyEuropeanAqi(data.current.european_aqi),
    usAqi: classifyUsAqi(data.current.us_aqi),
    pollutants: normalizePollutants(data.current),
    hourly: normalizeHourly(data.hourly),
    fetchedAt: new Date().toISOString(),
  };
}
