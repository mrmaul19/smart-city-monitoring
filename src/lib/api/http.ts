import { UpstreamError } from "@/lib/api/errors";
import { REQUEST_TIMEOUT_MS } from "@/lib/constants/api";

interface FetchJsonOptions {
  /** Seconds the fetched response may be reused before being revalidated. */
  revalidate: number;
  /** Cache tag, so one data source can be invalidated without the others. */
  tag: string;
  timeoutMs?: number;
}

/**
 * Fetches JSON from an upstream provider.
 *
 * Returns `unknown` on purpose: the caller must validate the payload before
 * trusting it, so a provider changing its schema surfaces as a clear
 * validation failure instead of undefined values reaching the UI.
 */
export async function fetchJson(
  url: string,
  { revalidate, tag, timeoutMs = REQUEST_TIMEOUT_MS }: FetchJsonOptions,
): Promise<unknown> {
  const response = await fetch(url, {
    // AbortSignal.timeout rejects with an AbortError, which toUpstreamError
    // maps to a 504 rather than a generic failure.
    signal: AbortSignal.timeout(timeoutMs),
    next: { revalidate, tags: [tag] },
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new UpstreamError(
      "upstream_error",
      `The data provider responded with status ${response.status}.`,
      response.status === 429 ? 429 : 502,
    );
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new UpstreamError(
      "upstream_invalid_response",
      "The data provider returned a malformed response.",
      502,
    );
  }
}
