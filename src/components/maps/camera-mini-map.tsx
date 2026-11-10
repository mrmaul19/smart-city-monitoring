"use client";

import L from "leaflet";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { cameraIcon } from "@/components/maps/map-markers";
import { useLeafletMap } from "@/components/maps/use-leaflet-map";
import type { TrafficCamera } from "@/types/camera";

/**
 * Small, non-interactive map pinning one camera.
 *
 * Panning and zooming are off: this is a locator, and a scroll-capturing map
 * inside a scrolling detail page fights the reader.
 */
export function CameraMiniMap({ camera }: { camera: TrafficCamera }) {
  const { resolvedTheme } = useTheme();

  const { latitude, longitude } = camera.coordinates;

  const { containerRef, map } = useLeafletMap({
    center: [latitude, longitude],
    zoom: 14,
    theme: resolvedTheme,
    interactive: false,
    // A locator this small has no room for Leaflet's default prefix.
    attributionPrefix: "",
  });

  useEffect(() => {
    if (!map) return;

    const position: L.LatLngExpression = [latitude, longitude];
    const marker = L.marker(position, {
      icon: cameraIcon(false),
      keyboard: false,
    }).addTo(map);

    map.setView(position, map.getZoom());

    return () => {
      marker.remove();
    };
  }, [map, latitude, longitude]);

  return (
    <div
      className="h-48 w-full overflow-hidden rounded-lg border"
      style={{ isolation: "isolate" }}
    >
      <div ref={containerRef} className="size-full" />
    </div>
  );
}
