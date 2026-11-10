import type { WeatherCondition } from "@/types/weather";

/**
 * WMO 4677 weather interpretation codes, as documented by Open-Meteo.
 *
 * `icon` is a Lucide icon name resolved by the weather icon component, kept as
 * a string so this table has no React dependency and can be used server-side.
 */
const WEATHER_CODES: Readonly<Record<number, { label: string; icon: string }>> =
  {
    0: { label: "Clear sky", icon: "sun" },
    1: { label: "Mainly clear", icon: "sun" },
    2: { label: "Partly cloudy", icon: "cloud-sun" },
    3: { label: "Overcast", icon: "cloud" },
    45: { label: "Fog", icon: "cloud-fog" },
    48: { label: "Depositing rime fog", icon: "cloud-fog" },
    51: { label: "Light drizzle", icon: "cloud-drizzle" },
    53: { label: "Moderate drizzle", icon: "cloud-drizzle" },
    55: { label: "Dense drizzle", icon: "cloud-drizzle" },
    56: { label: "Light freezing drizzle", icon: "cloud-drizzle" },
    57: { label: "Dense freezing drizzle", icon: "cloud-drizzle" },
    61: { label: "Slight rain", icon: "cloud-rain" },
    63: { label: "Moderate rain", icon: "cloud-rain" },
    65: { label: "Heavy rain", icon: "cloud-rain-wind" },
    66: { label: "Light freezing rain", icon: "cloud-hail" },
    67: { label: "Heavy freezing rain", icon: "cloud-hail" },
    71: { label: "Slight snowfall", icon: "cloud-snow" },
    73: { label: "Moderate snowfall", icon: "cloud-snow" },
    75: { label: "Heavy snowfall", icon: "cloud-snow" },
    77: { label: "Snow grains", icon: "snowflake" },
    80: { label: "Slight rain showers", icon: "cloud-sun-rain" },
    81: { label: "Moderate rain showers", icon: "cloud-rain" },
    82: { label: "Violent rain showers", icon: "cloud-rain-wind" },
    85: { label: "Slight snow showers", icon: "cloud-snow" },
    86: { label: "Heavy snow showers", icon: "cloud-snow" },
    95: { label: "Thunderstorm", icon: "cloud-lightning" },
    96: { label: "Thunderstorm with slight hail", icon: "cloud-lightning" },
    99: { label: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
  };

/**
 * Resolves a code to a condition.
 *
 * Unknown codes are reported as unknown rather than silently shown as clear
 * sky, so a provider adding a code is visible instead of misleading.
 */
export function resolveWeatherCondition(code: number): WeatherCondition {
  const match = WEATHER_CODES[code];

  if (!match) {
    return { code, label: "Unknown conditions", icon: "cloud-off" };
  }

  return { code, label: match.label, icon: match.icon };
}
