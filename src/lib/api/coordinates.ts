import { UpstreamError } from "@/lib/api/errors";
import type { Coordinates } from "@/types/location";

/**
 * Reads one coordinate component.
 *
 * Number() must not be handed the raw value: `Number(null)` and `Number("")`
 * are both 0, so a missing or blank parameter would silently become a valid
 * coordinate — latitude=1.35 with no longitude would be read as a point in the
 * Gulf of Guinea and happily answered. A null or blank value is rejected
 * before any conversion.
 */
function parseComponent(raw: string | null, limit: number): number | null {
  if (raw === null || raw.trim() === "") return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || Math.abs(value) > limit) return null;

  return value;
}

/**
 * Reads and validates latitude/longitude from a request's query string.
 *
 * Rejecting malformed and out-of-range input here keeps it from reaching the
 * upstream provider and counting against its rate limit.
 */
export function parseCoordinates(searchParams: URLSearchParams): Coordinates {
  const latitude = parseComponent(searchParams.get("latitude"), 90);
  const longitude = parseComponent(searchParams.get("longitude"), 180);

  if (latitude === null || longitude === null) {
    throw new UpstreamError(
      "invalid_request",
      "Query parameters `latitude` and `longitude` are required and must be a valid coordinate.",
      400,
    );
  }

  // Four decimals is roughly 11 m — more than enough, and it keeps the upstream
  // cache key stable when a map drag produces a long fraction.
  return {
    latitude: Number(latitude.toFixed(4)),
    longitude: Number(longitude.toFixed(4)),
  };
}
