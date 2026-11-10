import type { ApiErrorBody, ApiSuccessBody } from "@/types/api";

/** Error thrown by the browser-side fetch helper, carrying the server's code. */
export class ClientApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ClientApiError";
    this.code = code;
    this.status = status;
  }
}

function isErrorBody(body: unknown): body is ApiErrorBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof (body as ApiErrorBody).error?.code === "string"
  );
}

/**
 * Calls one of this application's own route handlers.
 *
 * Reads the structured error body the handlers return, so a widget can show
 * the real reason a request failed instead of a generic message.
 */
export async function fetchApi<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(path, {
    signal,
    headers: { accept: "application/json" },
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isErrorBody(body)) {
      throw new ClientApiError(
        body.error.code,
        body.error.message,
        response.status,
      );
    }
    throw new ClientApiError(
      "internal_error",
      "The request failed.",
      response.status,
    );
  }

  return (body as ApiSuccessBody<T>).data;
}
