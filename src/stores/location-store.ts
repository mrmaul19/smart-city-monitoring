import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_LOCATION } from "@/config/locations";
import type { MonitoredLocation } from "@/types/location";

interface LocationState {
  location: MonitoredLocation;
  setLocation: (location: MonitoredLocation) => void;
  resetLocation: () => void;
}

/**
 * The location every widget reads from.
 *
 * Persisted to localStorage so a reload keeps the user's choice, as the spec
 * requires. `skipHydration` is deliberately not used: the store starts from the
 * default on the server and rehydrates on the client, and the hooks that read
 * it only run client-side.
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: DEFAULT_LOCATION,
      setLocation: (location) => set({ location }),
      resetLocation: () => set({ location: DEFAULT_LOCATION }),
    }),
    {
      name: "open-city-pulse.location",
      version: 1,
      // Only the selection is stored; the setters are recreated on load.
      partialize: (state) => ({ location: state.location }),
    },
  ),
);
