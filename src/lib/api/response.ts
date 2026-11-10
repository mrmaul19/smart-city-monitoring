import { NextResponse } from "next/server";

import { toUpstreamError } from "@/lib/api/errors";
import type { ApiErrorBody, ApiErrorCode, ApiSuccessBody } from "@/types/api";

/**
 * Success response.
 *
 * `s-maxage` lets Vercel's edge cache serve repeat requests without invoking
 * the function again, and `stale-while-revalidate` means a refresh never makes
 * a visitor wait on the upstream provider.
 */
export function apiSuccess<T>(
  data: T,
  cacheSeconds: number,
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json(
    { data },
    {
      status: 200,
      headers: {
        "cache-control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`,
      },
    },
  );
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { "cache-control": "no-store" } },
  );
}

/** Single place where a thrown error becomes an HTTP response. */
export function apiErrorFrom(error: unknown): NextResponse<ApiErrorBody> {
  const upstream = toUpstreamError(error);
  return apiError(upstream.code, upstream.message, upstream.status);
}
