import type { NextRequest } from "next/server";

import { parseCoordinates } from "@/lib/api/coordinates";
import { apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { REVALIDATE } from "@/lib/constants/api";
import { getAirQuality } from "@/services/air-quality.service";

/** GET /api/air-quality?latitude=&longitude= */
export async function GET(request: NextRequest) {
  try {
    const coordinates = parseCoordinates(request.nextUrl.searchParams);
    const snapshot = await getAirQuality(coordinates);
    return apiSuccess(snapshot, REVALIDATE.airQuality);
  } catch (error) {
    return apiErrorFrom(error);
  }
}
