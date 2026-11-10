"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchApi } from "@/lib/api/client";
import { REVALIDATE } from "@/lib/constants/api";
import type { AirQualitySnapshot } from "@/types/air-quality";
import type { Coordinates } from "@/types/location";

export const airQualityQueryKey = (coordinates: Coordinates) =>
  ["air-quality", coordinates.latitude, coordinates.longitude] as const;

/** Pollutant readings and index bands for a location. */
export function useAirQuality(coordinates: Coordinates) {
  return useQuery({
    queryKey: airQualityQueryKey(coordinates),
    queryFn: ({ signal }) =>
      fetchApi<AirQualitySnapshot>(
        `/api/air-quality?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`,
        signal,
      ),
    staleTime: REVALIDATE.airQuality * 1000,
    refetchInterval: REVALIDATE.airQuality * 1000,
  });
}
