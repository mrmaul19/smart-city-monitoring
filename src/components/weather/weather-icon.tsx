import { createElement } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudOff,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the icon name carried on a WeatherCondition to a component.
 *
 * The mapping lives here rather than in the lookup table so that table stays
 * free of React imports and can be used in route handlers.
 */
const ICONS: Readonly<Record<string, LucideIcon>> = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-drizzle": CloudDrizzle,
  "cloud-rain": CloudRain,
  "cloud-rain-wind": CloudRainWind,
  "cloud-sun-rain": CloudSunRain,
  "cloud-hail": CloudHail,
  "cloud-snow": CloudSnow,
  snowflake: Snowflake,
  "cloud-lightning": CloudLightning,
  "cloud-off": CloudOff,
};

export function resolveWeatherIcon(name: string): LucideIcon {
  return ICONS[name] ?? CloudOff;
}

/**
 * Renders the icon for a condition.
 *
 * Uses createElement rather than a dynamic JSX tag: the looked-up component
 * comes from the module-level map above, so its identity is stable across
 * renders and React never remounts it — but assigning it to a local capitalised
 * binding inside JSX is the shape that signals an unstable component, so this
 * form states the intent plainly instead.
 */
export function WeatherIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return createElement(resolveWeatherIcon(name), {
    className,
    "aria-hidden": true,
  });
}
