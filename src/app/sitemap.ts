import type { MetadataRoute } from "next";

import { allNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/**
 * Lists only static, parameterless routes. Camera detail pages are excluded
 * because their ids come from a live upstream response.
 *
 * Cached rather than server-rendered per request: the route list is static and
 * the base URL is inlined at build time, so `lastModified` is the build time,
 * which is the correct meaning for a sitemap. Under Cache Components this is
 * expressed with `use cache` — the `dynamic` segment config is rejected.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";

  const lastModified = new Date();

  return allNavItems.map((item) => ({
    url: new URL(item.href, siteConfig.url).toString(),
    lastModified,
    changeFrequency: item.href === "/" ? "hourly" : "daily",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
