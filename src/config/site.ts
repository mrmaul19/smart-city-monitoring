export const siteConfig = {
  name: "Open City Pulse",
  shortName: "City Pulse",
  description:
    "Smart city monitoring dashboard combining public weather, air quality, traffic camera snapshots and geospatial data from open APIs.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  locale: "en",
  /** Set once the repository is published; omitted while unset. */
  repository: process.env.NEXT_PUBLIC_REPOSITORY_URL ?? null,
} as const;

export type SiteConfig = typeof siteConfig;
