import L from "leaflet";

/**
 * Marker icons.
 *
 * Leaflet's default marker is a bitmap resolved from a relative path, which
 * breaks under a bundler and does not match this theme. These are divIcons
 * built from the theme's own CSS variables instead, so they recolour with the
 * light/dark switch and need no image assets at all.
 */

/** Small dot for a camera. Deliberately quiet — there can be many at once. */
export function cameraIcon(isFavourite: boolean): L.DivIcon {
  const colour = isFavourite ? "var(--warning)" : "var(--chart-1)";

  return L.divIcon({
    className: "ocp-marker",
    html: `<span style="
      display:block;
      width:12px;height:12px;
      border-radius:9999px;
      background:${colour};
      box-shadow:0 0 0 2px var(--card), 0 0 0 3.5px ${colour}66;
    "></span>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

/** Pin for the monitored location. Larger, so it reads as the primary subject. */
export function locationIcon(): L.DivIcon {
  return L.divIcon({
    className: "ocp-marker",
    html: `<span style="
      display:block;
      width:18px;height:18px;
      border-radius:9999px;
      background:var(--primary);
      box-shadow:0 0 0 3px var(--card), 0 0 0 5px color-mix(in oklab, var(--primary) 35%, transparent);
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}
