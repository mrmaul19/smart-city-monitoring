import type { Coordinates } from "@/types/location";

export interface TrafficCamera {
  id: string;
  /** Snapshot URL. These are still images, never a video stream. */
  imageUrl: string;
  /** When the snapshot itself was captured, per the provider. */
  capturedAt: string;
  coordinates: Coordinates;
  width: number;
  height: number;
  /**
   * Human-readable area derived from the coordinates. The provider supplies no
   * name, so this is a best-effort region label, not an official one.
   */
  area: string;
}

export interface CameraSnapshotSet {
  /** Provider's batch timestamp, which can differ from individual captures. */
  publishedAt: string;
  cameras: readonly TrafficCamera[];
  fetchedAt: string;
}
