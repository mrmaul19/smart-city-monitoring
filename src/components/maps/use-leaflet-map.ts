"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef, useState } from "react";

/**
 * Base map tiles.
 *
 * CARTO's public basemaps are free to use with attribution and ship a dark
 * variant, which reads far better in this theme than inverting the standard
 * OpenStreetMap raster with a CSS filter. Both credits are required.
 */
const TILES = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
} as const;

export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export interface LeafletMapOptions {
  center: [number, number];
  zoom: number;
  /** "light" uses the light basemap; anything else uses the dark one. */
  theme: string | undefined;
  interactive?: boolean;
  attributionPrefix?: string;
}

/**
 * Owns a Leaflet map's whole lifecycle.
 *
 * Written against Leaflet directly rather than react-leaflet because
 * react-leaflet 5.0.0 is not safe under React Strict Mode: its MapContainer
 * keeps an internal ref to the map it built and never clears it, so after
 * Strict Mode's setup → cleanup → setup cycle (whose cleanup calls
 * `map.remove()`) the second setup skips rebuilding, while the React context
 * still points at the destroyed map. Children then add layers to a map with no
 * container, which throws "Cannot read properties of undefined (reading
 * 'appendChild')", and a later cleanup can throw "Map container is being
 * reused by another instance".
 *
 * This hook creates and destroys the map in one symmetric effect, so a second
 * setup always builds a genuinely new map, and switching theme swaps the tile
 * URL in place instead of remounting a layer.
 */
export function useLeafletMap({
  center,
  zoom,
  theme,
  interactive = true,
  attributionPrefix,
}: LeafletMapOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  // Read through refs so changing the centre or theme never re-creates the
  // map; those are applied by the effects below instead.
  const initialRef = useRef({ center, zoom, interactive, attributionPrefix });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Defensive: a container that still carries a Leaflet stamp would make the
    // constructor throw "Map container is already initialized". With symmetric
    // cleanup this should never happen, but clearing it is cheap and keeps a
    // stale node from breaking the whole page.
    if ("_leaflet_id" in container) {
      delete (container as unknown as Record<string, unknown>)._leaflet_id;
    }

    const initial = initialRef.current;
    const instance = L.map(container, {
      center: initial.center,
      zoom: initial.zoom,
      zoomControl: initial.interactive,
      scrollWheelZoom: initial.interactive,
      dragging: initial.interactive,
      doubleClickZoom: initial.interactive,
      keyboard: initial.interactive,
      attributionControl: true,
    });

    if (initial.attributionPrefix !== undefined) {
      instance.attributionControl.setPrefix(initial.attributionPrefix);
    }

    mapRef.current = instance;
    setMap(instance);

    return () => {
      // Order matters: drop our own handles first so nothing can touch the map
      // after it is gone, then remove it exactly once.
      //
      // The `map` state is deliberately left alone here. Under Strict Mode this
      // cleanup is followed immediately by another setup in the same commit,
      // which calls setMap with the new instance — so no render ever observes
      // the destroyed one. Clearing it here would instead be a setState inside
      // an effect cleanup, for no benefit.
      tileRef.current = null;
      mapRef.current = null;
      instance.remove();
    };
  }, []);

  // Tile layer: added once, then its URL is swapped on a theme change.
  useEffect(() => {
    if (!map) return;

    const url = theme === "light" ? TILES.light : TILES.dark;

    if (!tileRef.current) {
      tileRef.current = L.tileLayer(url, {
        attribution: MAP_ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);
      return;
    }

    tileRef.current.setUrl(url);
  }, [map, theme]);

  return { containerRef, map };
}
