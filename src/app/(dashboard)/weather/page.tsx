import type { Metadata } from "next";
import { CloudSun } from "lucide-react";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Weather",
  description:
    "Current conditions, hourly and daily forecast for the selected location.",
};

export default function WeatherPage() {
  return (
    <PagePlaceholder
      title="Weather"
      description="Current conditions and forecast for the selected location"
      icon={CloudSun}
      phase="Phase 4"
      planned={[
        "Temperature, humidity and apparent temperature",
        "Wind speed and precipitation",
        "Rain probability",
        "Hourly forecast for 7 days",
        "Daily minimum and maximum",
        "Temperature chart",
      ]}
      source="Open-Meteo Forecast API — no API key required"
    />
  );
}
