"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * Server-state container for widget-level data fetching.
 *
 * The client is created inside component state rather than at module scope so
 * each request gets its own cache on the server and no data leaks between
 * users. Defaults are tuned so a single widget can refetch on its own without
 * the rest of the dashboard re-rendering.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Upstream providers publish on fixed intervals, so refetching
            // sooner than this only wastes their rate limit.
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            retry: 2,
            retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 10_000),
            refetchOnWindowFocus: false,
            // Avoid a refetch storm when a laptop wakes from sleep.
            refetchOnReconnect: true,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
