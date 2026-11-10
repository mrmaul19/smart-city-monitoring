import type { NextRequest } from "next/server";

import { UpstreamError } from "@/lib/api/errors";
import { apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { REVALIDATE } from "@/lib/constants/api";
import { searchLocations } from "@/services/geocoding.service";

/**
 * GET /api/geocoding?q=
 *
 * Place lookups are effectively static, so the response carries a long cache
 * lifetime — repeat searches for the same term never reach the provider again.
 */
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");

    if (query === null) {
      throw new UpstreamError(
        "invalid_request",
        "Query parameter `q` is required.",
        400,
      );
    }

    const results = await searchLocations(query);
    return apiSuccess(results, REVALIDATE.geocoding);
  } catch (error) {
    return apiErrorFrom(error);
  }
}
