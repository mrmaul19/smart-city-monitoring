import { z } from "zod";

import { UpstreamError } from "@/lib/api/errors";
import { fetchJson } from "@/lib/api/http";
import { API_ENDPOINTS, REVALIDATE } from "@/lib/constants/api";
import type { MonitoredLocation } from "@/types/location";

/**
 * Open-Meteo geocoding response, verified against a live request.
 *
 * `results` is absent entirely when nothing matches — the provider omits the
 * key rather than returning an empty array, so the schema must allow that and
 * the normaliser treats it as "no matches" instead of a failure.
 */
const responseSchema = z.object({
  results: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        country: z.string().optional(),
        country_code: z.string().optional(),
        admin1: z.string().optional(),
        timezone: z.string().optional(),
        population: z.number().optional(),
      }),
    )
    .optional(),
});

/** Searches for places by name. Returns an empty list when nothing matches. */
export async function searchLocations(
  query: string,
  count = 8,
): Promise<readonly MonitoredLocation[]> {
  const trimmed = query.trim();

  // The provider needs at least two characters to return anything useful, and
  // a shorter query would spend a request for nothing.
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    name: trimmed,
    count: String(count),
    language: "en",
    format: "json",
  });

  const payload = await fetchJson(
    `${API_ENDPOINTS.geocoding}?${params.toString()}`,
    { revalidate: REVALIDATE.geocoding, tag: "geocoding" },
  );

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new UpstreamError(
      "upstream_invalid_response",
      "The geocoding provider returned data in an unexpected shape.",
      502,
    );
  }

  return (parsed.data.results ?? []).map((result) => ({
    id: String(result.id),
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    ...(result.country ? { country: result.country } : {}),
    ...(result.admin1 ? { admin1: result.admin1 } : {}),
    ...(result.timezone ? { timezone: result.timezone } : {}),
  }));
}
