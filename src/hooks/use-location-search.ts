"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { fetchApi } from "@/lib/api/client";
import { REVALIDATE } from "@/lib/constants/api";
import type { MonitoredLocation } from "@/types/location";

/**
 * Debounces a value.
 *
 * Search runs per keystroke otherwise, which would spend the provider's rate
 * limit on prefixes nobody wanted results for.
 */
function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

/**
 * Place search for the location picker.
 *
 * Results are cached for a day: a city's coordinates do not move, so the same
 * query never needs a second request.
 */
export function useLocationSearch(query: string) {
  const debounced = useDebounced(query.trim(), 300);
  const enabled = debounced.length >= 2;

  const result = useQuery({
    queryKey: ["geocoding", debounced],
    queryFn: ({ signal }) =>
      fetchApi<readonly MonitoredLocation[]>(
        `/api/geocoding?q=${encodeURIComponent(debounced)}`,
        signal,
      ),
    enabled,
    staleTime: REVALIDATE.geocoding * 1000,
    // A previous term's results staying on screen while the new ones load
    // reads as a glitch, so they are dropped.
    placeholderData: undefined,
  });

  return {
    ...result,
    /** True while the user has typed but the debounce has not settled yet. */
    isTyping: enabled && debounced !== query.trim(),
  };
}
