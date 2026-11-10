/** Machine-readable failure reasons shared by every route handler. */
export type ApiErrorCode =
  | "invalid_request"
  | "upstream_error"
  | "upstream_timeout"
  | "upstream_invalid_response"
  | "not_found"
  | "internal_error";

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export interface ApiSuccessBody<T> {
  data: T;
}

export type ApiResponseBody<T> = ApiSuccessBody<T> | ApiErrorBody;
