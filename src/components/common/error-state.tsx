import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Retry control, supplied by whichever hook owns the request. */
  action?: ReactNode;
}

/**
 * Shown when an upstream request failed.
 *
 * It deliberately offers no substitute reading: the spec forbids presenting
 * unavailable data as real, so a failure says so and stops there.
 */
export function ErrorState({
  title = "Could not load this data",
  description = "The upstream provider did not respond. No substitute values are shown.",
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
        <TriangleAlert className="size-5" aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
