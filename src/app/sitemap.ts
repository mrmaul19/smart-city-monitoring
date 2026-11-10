import type { MetadataRoute } from "next";

import { allNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/**
 * Lists only static, parameterless routes. Camera detail pages are excluded
 * because their ids come from a live upstream response.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return allNavItems.map((item) => ({
    url: new URL(item.href, siteConfig.url).toString(),
    lastModified,
    changeFrequency: item.href === "/" ? "hourly" : "daily",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
