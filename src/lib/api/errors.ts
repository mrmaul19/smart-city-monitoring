import type { ApiErrorCode } from "@/types/api";

/**
 * Failure of an upstream request or of validating its response.
 *
 * Carries an HTTP status so a route handler can translate it without having to
 * re-inspect what went wrong.
 */
export class UpstreamError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message);
    this.name = "UpstreamError";
    this.code = code;
    this.status = status;
  }
}

export function isUpstreamError(error: unknown): error is UpstreamError {
  return error instanceof UpstreamError;
}

/**
 * Converts anything thrown into an UpstreamError.
 *
 * Messages are deliberately generic: upstream error text can contain request
 * details we do not want to forward to the browser.
 */
export function toUpstreamError(error: unknown): UpstreamError {
  if (isUpstreamError(error)) return error;

  if (error instanceof DOMException && error.name === "AbortError") {
    return new UpstreamError(
      "upstream_timeout",
      "The data provider did not respond in time.",
      504,
    );
  }

  return new UpstreamError(
    "upstream_error",
    "The data provider could not be reached.",
    502,
  );
}
