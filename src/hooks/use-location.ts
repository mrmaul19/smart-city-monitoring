"use client";

import { useLocationStore } from "@/stores/location-store";
import type { MonitoredLocation } from "@/types/location";

/** Reads the active monitoring location and the setter for changing it. */
export function useLocation(): {
  location: MonitoredLocation;
  setLocation: (location: MonitoredLocation) => void;
  resetLocation: () => void;
} {
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const resetLocation = useLocationStore((state) => state.resetLocation);

  return { location, setLocation, resetLocation };
}
