"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useCameras } from "@/hooks/use-cameras";

/**
 * Leaflet is both large and strictly browser-only — it measures the DOM and
 * touches `window` at import time — so the map is code-split and never
 * server-rendered. Nothing about the dashboard's first paint waits for it.
 */
const CityMap = dynamic(
  () => import("@/components/maps/city-map").then((mod) => mod.CityMap),
  {
    ssr: false,
    loading: () => (
      <div className="relative size-full">
        <Skeleton className="size-full rounded-none" />
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 animate-pulse" aria-hidden />
          Loading map…
        </div>
      </div>
    ),
  },
);

interface MapWidgetProps {
  /** Tailwind height for the map frame; the map fills its container. */
  heightClass?: string;
  compact?: boolean;
}

export function MapWidget({
  heightClass = "h-[28rem]",
  compact = false,
}: MapWidgetProps) {
  const { data } = useCameras();

  return (
    <div
      className={`${heightClass} w-full overflow-hidden rounded-lg border`}
      // Leaflet's panes and controls are positioned absolutely inside this
      // frame; isolation keeps their stacking context from escaping over the
      // sticky header.
      style={{ isolation: "isolate" }}
    >
      <CityMap
        cameras={data?.cameras ?? []}
        compact={compact}
        className="size-full"
      />
    </div>
  );
}
