import type { Metadata } from "next";
import { Wind } from "lucide-react";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Air quality",
  description:
    "Particulate matter, pollutant concentrations and air quality indices.",
};

export default function AirQualityPage() {
  return (
    <PagePlaceholder
      title="Air quality"
      description="Particulate matter, pollutants and air quality indices"
      icon={Wind}
      phase="Phase 4"
      planned={[
        "PM2.5 and PM10 concentrations",
        "European AQI and US AQI",
        "Nitrogen dioxide and ozone",
        "Severity band per reading",
        "Recent history chart",
        "Measurement timestamp and source label",
      ]}
      source="Open-Meteo Air Quality API — CAMS model data, no API key required"
    />
  );
}
