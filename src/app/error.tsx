"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Route-level error boundary.
 *
 * Keeps a failure contained to the segment that threw instead of taking the
 * whole dashboard down, and offers a retry that re-renders the segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the server logs on Vercel; no third-party reporting is used.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-xl items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
            <TriangleAlert className="size-5" aria-hidden />
          </span>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            This section failed to load. The rest of the dashboard is
            unaffected, and no data has been substituted in its place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.digest ? (
            <p className="text-xs text-muted-foreground">
              Reference: <span className="tabular">{error.digest}</span>
            </p>
          ) : null}
          <Button onClick={reset} variant="secondary">
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
