import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Which air quality index the dashboard leads with. */
export type AqiPreference = "european" | "us";

/**
 * Offered snapshot auto-refresh cadences, in seconds. 0 disables it.
 *
 * Built around the measured 300s publication interval: a 60s option would
 * issue five times the requests to fetch the same image, so it is not offered.
 */
export const REFRESH_INTERVALS = [0, 150, 300, 600] as const;
export type RefreshInterval = (typeof REFRESH_INTERVALS)[number];

interface PreferencesState {
  aqiPreference: AqiPreference;
  /** Seconds between automatic snapshot refreshes; 0 means manual only. */
  snapshotRefreshSeconds: RefreshInterval;
  /** Favourite camera ids, in the order they were added. */
  favouriteCameraIds: readonly string[];

  setAqiPreference: (value: AqiPreference) => void;
  setSnapshotRefreshSeconds: (value: RefreshInterval) => void;
  toggleFavouriteCamera: (id: string) => void;
  clearFavourites: () => void;
}

/**
 * User preferences, persisted to localStorage.
 *
 * There is no account system and no server-side storage, so this is the only
 * place these choices live — which is also why the Settings page offers an
 * explicit way to clear them.
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      aqiPreference: "european",
      // Matches the provider's own publication interval.
      snapshotRefreshSeconds: 300,
      favouriteCameraIds: [],

      setAqiPreference: (aqiPreference) => set({ aqiPreference }),
      setSnapshotRefreshSeconds: (snapshotRefreshSeconds) =>
        set({ snapshotRefreshSeconds }),

      toggleFavouriteCamera: (id) =>
        set((state) => ({
          favouriteCameraIds: state.favouriteCameraIds.includes(id)
            ? state.favouriteCameraIds.filter((item) => item !== id)
            : [...state.favouriteCameraIds, id],
        })),

      clearFavourites: () => set({ favouriteCameraIds: [] }),
    }),
    {
      name: "open-city-pulse.preferences",
      // v2 dropped the 60s refresh option once the provider's publication
      // interval was measured at 300s.
      version: 2,
      partialize: (state) => ({
        aqiPreference: state.aqiPreference,
        snapshotRefreshSeconds: state.snapshotRefreshSeconds,
        favouriteCameraIds: state.favouriteCameraIds,
      }),
      /**
       * Brings a stored value that is no longer an offered option back into
       * range. Without this, anyone who used the app before v2 keeps a 60s
       * cadence that the settings dropdown cannot display, leaving the control
       * blank and unchangeable.
       */
      migrate: (persisted, version) => {
        // An absent payload is treated as an empty one: zustand merges whatever
        // comes back over the store's defaults, so the missing keys fill in.
        const state = (persisted ?? {}) as Partial<PreferencesState>;
        if (version >= 2) return state as PreferencesState;

        const stored = state.snapshotRefreshSeconds;
        const isOffered =
          typeof stored === "number" &&
          (REFRESH_INTERVALS as readonly number[]).includes(stored);

        return {
          ...state,
          snapshotRefreshSeconds: isOffered ? stored : 300,
        } as PreferencesState;
      },
    },
  ),
);
