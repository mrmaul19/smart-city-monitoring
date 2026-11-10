export const siteConfig = {
  name: "Open City Pulse",
  shortName: "City Pulse",
  description:
    "Smart city monitoring dashboard combining public weather, air quality, traffic camera snapshots and geospatial data from open APIs.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  locale: "en",
  repository: "https://github.com/", // updated before deployment
} as const;

export type SiteConfig = typeof siteConfig;
