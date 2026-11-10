/**
 * External data sources.
 *
 * Every endpoint below was verified against a live response before being added.
 * All of them are free and require no API key; see /about for attribution.
 */
export const API_ENDPOINTS = {
  /** Open-Meteo forecast API — no key required for non-commercial use. */
  weather: "https://api.open-meteo.com/v1/forecast",
  /** Open-Meteo air quality API (CAMS-based). */
  airQuality: "https://air-quality-api.open-meteo.com/v1/air-quality",
  /** Open-Meteo geocoding API, backed by the GeoNames database. */
  geocoding: "https://geocoding-api.open-meteo.com/v1/search",
  /** Data.gov.sg public traffic camera snapshots (images, not video streams). */
  trafficImages: "https://api.data.gov.sg/v1/transport/traffic-images",
} as const;

/**
 * Camera snapshots are rendered with a plain <img> element, never through
 * next/image. Their URLs change every minute, so the Vercel image optimizer
 * would treat each refresh as a new source image and exhaust the Hobby plan's
 * monthly transformation quota. See the images note in next.config.ts.
 */
export const OPTIMIZE_CAMERA_SNAPSHOTS = false;

/** Upstream request timeout for every server-side fetch, in milliseconds. */
export const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Cache lifetimes, in seconds, used by Route Handler `revalidate` values.
 * Chosen to stay well inside each provider's fair-use policy.
 */
export const REVALIDATE = {
  /** Open-Meteo updates current conditions roughly every 15 minutes. */
  weather: 600,
  /** Air quality is published hourly. */
  airQuality: 900,
  /** Traffic snapshots rotate about once a minute. */
  cameras: 60,
  /** Place lookups are effectively static. */
  geocoding: 86_400,
} as const;
