import { apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { REVALIDATE } from "@/lib/constants/api";
import { getCameras } from "@/services/cameras.service";

/**
 * GET /api/cameras
 *
 * Takes no parameters: the provider publishes one national snapshot set, so
 * filtering and searching happen on the client against the cached result
 * rather than by issuing a request per query.
 */
export async function GET() {
  try {
    const snapshots = await getCameras();
    return apiSuccess(snapshots, REVALIDATE.cameras);
  } catch (error) {
    return apiErrorFrom(error);
  }
}
