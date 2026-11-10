"use client";

import L from "leaflet";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { cameraIcon, locationIcon } from "@/components/maps/map-markers";
import { escapeHtml, escapeUrl } from "@/components/maps/popup-html";
import { useLeafletMap } from "@/components/maps/use-leaflet-map";
import { useLocation } from "@/hooks/use-location";
import { formatCoordinates, formatRelativeTime } from "@/lib/utils/format";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { TrafficCamera } from "@/types/camera";

interface CityMapProps {
  cameras: readonly TrafficCamera[];
  /** Hides the camera layer and click-to-select, for small inline maps. */
  compact?: boolean;
  className?: string;
}

/** Popup body for a camera. Built as a string because Leaflet popups take HTML. */
function cameraPopup(camera: TrafficCamera): string {
  const id = escapeHtml(camera.id);
  const area = escapeHtml(camera.area);
  const image = escapeUrl(camera.imageUrl);
  const age = escapeHtml(formatRelativeTime(camera.capturedAt));

  return `
    <div class="space-y-1.5">
      ${
        image
          ? `<img src="${image}" alt="Traffic camera ${id}" width="200" height="112" loading="lazy" class="w-full rounded" />`
          : ""
      }
      <p class="font-medium">Camera ${id}</p>
      <p class="text-xs text-muted-foreground">${area} · snapshot ${age}</p>
      <a href="/cameras/${id}" data-camera-link="${id}"
         class="mt-1 block rounded-md bg-secondary px-2 py-1.5 text-center text-xs font-medium text-secondary-foreground hover:bg-accent">
        View camera
      </a>
    </div>
  `;
}

export function CityMap({ cameras, compact = false, className }: CityMapProps) {
  const router = useRouter();
  const { location, setLocation } = useLocation();
  const { resolvedTheme } = useTheme();
  const favourites = usePreferencesStore((state) => state.favouriteCameraIds);

  const { containerRef, map } = useLeafletMap({
    center: [location.latitude, location.longitude],
    zoom: compact ? 14 : 11,
    theme: resolvedTheme,
    interactive: !compact,
  });

  const cameraLayerRef = useRef<L.LayerGroup | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);

  /** Marker for the monitored location, moved rather than recreated. */
  useEffect(() => {
    if (!map) return;

    const position: L.LatLngExpression = [
      location.latitude,
      location.longitude,
    ];

    if (!locationMarkerRef.current) {
      locationMarkerRef.current = L.marker(position, {
        icon: locationIcon(),
        keyboard: false,
      }).addTo(map);
    } else {
      locationMarkerRef.current.setLatLng(position);
    }

    locationMarkerRef.current.bindPopup(
      `<p class="font-medium">${escapeHtml(location.name)}</p>
       <p class="text-xs text-muted-foreground">${escapeHtml(
         formatCoordinates(location.latitude, location.longitude),
       )}</p>`,
    );

    // The user's zoom is deliberately preserved: they may have zoomed in.
    map.flyTo(position, map.getZoom(), { duration: 0.8 });
  }, [map, location]);

  /** Camera markers, rebuilt as a group whenever the set or favourites change. */
  useEffect(() => {
    if (!map || compact) return;

    const group = L.layerGroup().addTo(map);
    cameraLayerRef.current = group;

    for (const camera of cameras) {
      L.marker([camera.coordinates.latitude, camera.coordinates.longitude], {
        icon: cameraIcon(favourites.includes(camera.id)),
        keyboard: false,
      })
        .bindPopup(cameraPopup(camera), { minWidth: 200 })
        .addTo(group);
    }

    return () => {
      group.remove();
      cameraLayerRef.current = null;
    };
  }, [map, cameras, favourites, compact]);

  /**
   * Click handling.
   *
   * A click on open map selects that point. A click on a popup's link is
   * intercepted so navigation stays client-side instead of reloading the page;
   * the anchor keeps its real href so it still works without JavaScript and
   * can be opened in a new tab.
   */
  useEffect(() => {
    if (!map || compact) return;

    const container = map.getContainer();

    function onDomClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("[data-camera-link]");
      if (!link) return;

      // Let modified clicks (new tab, download) behave normally.
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      router.push(`/cameras/${link.getAttribute("data-camera-link") ?? ""}`);
    }

    function onMapClick(event: L.LeafletMouseEvent) {
      const latitude = Number(event.latlng.lat.toFixed(4));
      const longitude = Number(event.latlng.lng.toFixed(4));

      setLocation({
        // The coordinate is the identity: no reverse geocoding is performed,
        // so the point is labelled as pinned rather than given a place name
        // that was never looked up.
        id: `pinned:${latitude},${longitude}`,
        name: "Pinned location",
        latitude,
        longitude,
      });

      toast.success("Monitoring a pinned location", {
        description: formatCoordinates(latitude, longitude),
      });
    }

    container.addEventListener("click", onDomClick);
    map.on("click", onMapClick);

    return () => {
      container.removeEventListener("click", onDomClick);
      map.off("click", onMapClick);
    };
    // setLocation comes straight from the Zustand store, so its identity is
    // stable and listing it here does not cause the handlers to rebind.
  }, [map, compact, router, setLocation]);

  return <div ref={containerRef} className={className} />;
}
