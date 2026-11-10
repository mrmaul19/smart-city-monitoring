import type { Coordinates } from "@/types/location";

/**
 * Approximate region label for a coordinate inside Singapore.
 *
 * The traffic images API supplies no location name, only latitude and
 * longitude. Rather than invent an official road or junction name, this derives
 * a coarse compass region from the coordinate itself. The UI labels the result
 * as approximate and always shows the exact coordinates alongside it.
 */

/** Rough bounding box of Singapore, including its outlying islands. */
const BOUNDS = {
  minLatitude: 1.15,
  maxLatitude: 1.48,
  minLongitude: 103.6,
  maxLongitude: 104.1,
} as const;

export function resolveApproximateArea({
  latitude,
  longitude,
}: Coordinates): string {
  const inside =
    latitude >= BOUNDS.minLatitude &&
    latitude <= BOUNDS.maxLatitude &&
    longitude >= BOUNDS.minLongitude &&
    longitude <= BOUNDS.maxLongitude;

  if (!inside) return "Outside Singapore";

  if (latitude >= 1.4) return "North";
  if (longitude <= 103.68) return "West";
  if (longitude >= 103.93) return "East";
  if (latitude <= 1.28) return "South";
  return "Central";
}

/** The area values the resolver can produce, for building filter options. */
export const AREA_OPTIONS = [
  "North",
  "South",
  "East",
  "West",
  "Central",
  "Outside Singapore",
] as const;

export type AreaOption = (typeof AREA_OPTIONS)[number];
