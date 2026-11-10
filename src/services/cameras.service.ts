import { z } from "zod";

import { UpstreamError } from "@/lib/api/errors";
import { fetchJson } from "@/lib/api/http";
import { API_ENDPOINTS, REVALIDATE } from "@/lib/constants/api";
import { resolveApproximateArea } from "@/lib/constants/singapore-regions";
import type { CameraSnapshotSet, TrafficCamera } from "@/types/camera";

/**
 * Data.gov.sg traffic images response, verified against a live request.
 *
 * `items` is an array but has only ever contained a single batch; the schema
 * allows more and the normaliser reads the most recent one.
 */
const responseSchema = z.object({
  items: z.array(
    z.object({
      timestamp: z.string(),
      cameras: z.array(
        z.object({
          timestamp: z.string(),
          image: z.string(),
          camera_id: z.string(),
          location: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
          image_metadata: z.object({
            height: z.number(),
            width: z.number(),
            md5: z.string(),
          }),
        }),
      ),
    }),
  ),
});

/**
 * Fetches, validates and normalises the current snapshot set.
 *
 * These are still images, republished every 5 minutes, not video streams.
 * The provider currently publishes a small number of cameras; the count is
 * whatever it returns and is never padded.
 */
export async function getCameras(): Promise<CameraSnapshotSet> {
  const payload = await fetchJson(API_ENDPOINTS.trafficImages, {
    revalidate: REVALIDATE.cameras,
    tag: "cameras",
  });

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new UpstreamError(
      "upstream_invalid_response",
      "The traffic camera provider returned data in an unexpected shape.",
      502,
    );
  }

  const batch = parsed.data.items.at(-1);
  if (!batch) {
    throw new UpstreamError(
      "not_found",
      "The traffic camera provider returned no snapshot batch.",
      404,
    );
  }

  const cameras: readonly TrafficCamera[] = batch.cameras
    .map((camera): TrafficCamera => ({
      id: camera.camera_id,
      imageUrl: camera.image,
      capturedAt: camera.timestamp,
      coordinates: {
        latitude: camera.location.latitude,
        longitude: camera.location.longitude,
      },
      width: camera.image_metadata.width,
      height: camera.image_metadata.height,
      area: resolveApproximateArea(camera.location),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    publishedAt: batch.timestamp,
    cameras,
    fetchedAt: new Date().toISOString(),
  };
}
