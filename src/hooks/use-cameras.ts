"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchApi } from "@/lib/api/client";
import { REVALIDATE } from "@/lib/constants/api";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { CameraSnapshotSet } from "@/types/camera";

export const camerasQueryKey = ["cameras"] as const;

/**
 * The current public traffic camera snapshot set.
 *
 * Snapshots are still images, not a live stream, and the UI says so wherever
 * one is shown. The provider republishes every 5 minutes, so the setting's
 * options are built around that; 0 means manual only — the query key stays constant so changing the cadence
 * does not throw away the cached snapshots.
 */
export function useCameras() {
  const refreshSeconds = usePreferencesStore(
    (state) => state.snapshotRefreshSeconds,
  );

  return useQuery({
    queryKey: camerasQueryKey,
    queryFn: ({ signal }) =>
      fetchApi<CameraSnapshotSet>("/api/cameras", signal),
    staleTime: REVALIDATE.cameras * 1000,
    refetchInterval: refreshSeconds > 0 ? refreshSeconds * 1000 : false,
  });
}
