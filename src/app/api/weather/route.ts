import type { NextRequest } from "next/server";

import { parseCoordinates } from "@/lib/api/coordinates";
import { apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { REVALIDATE } from "@/lib/constants/api";
import { getWeather } from "@/services/weather.service";

/**
 * GET /api/weather?latitude=&longitude=
 *
 * Proxies Open-Meteo so the browser never calls the provider directly. That
 * keeps caching, timeouts, validation and error shaping in one place, and means
 * the upstream URL and any future credentials stay server-side.
 */
export async function GET(request: NextRequest) {
  try {
    const coordinates = parseCoordinates(request.nextUrl.searchParams);
    const snapshot = await getWeather(coordinates);
    return apiSuccess(snapshot, REVALIDATE.weather);
  } catch (error) {
    return apiErrorFrom(error);
  }
}
