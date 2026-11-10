"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchApi } from "@/lib/api/client";
import { REVALIDATE } from "@/lib/constants/api";
import type { Coordinates } from "@/types/location";
import type { WeatherSnapshot } from "@/types/weather";

export const weatherQueryKey = (coordinates: Coordinates) =>
  ["weather", coordinates.latitude, coordinates.longitude] as const;

/**
 * Current conditions and forecast for a location.
 *
 * The query key includes the coordinates, so switching location refetches only
 * this widget rather than re-rendering the whole dashboard. `staleTime` matches
 * the route handler's revalidate window, so a remount inside that window is
 * served from cache instead of hitting the provider again.
 */
export function useWeather(coordinates: Coordinates) {
  return useQuery({
    queryKey: weatherQueryKey(coordinates),
    queryFn: ({ signal }) =>
      fetchApi<WeatherSnapshot>(
        `/api/weather?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`,
        signal,
      ),
    staleTime: REVALIDATE.weather * 1000,
    refetchInterval: REVALIDATE.weather * 1000,
  });
}
