import type { Metadata } from "next";
import { CloudSun } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { WeatherWidget } from "@/components/dashboard/weather-widget";

export const metadata: Metadata = {
  title: "Weather",
  description:
    "Current conditions, hourly temperature and a seven-day forecast for the selected location.",
};

export default function WeatherPage() {
  return (
    <>
      <PageHeader
        title="Weather"
        description="Current conditions and forecast for the selected location"
        icon={CloudSun}
      />

      <div className="max-w-3xl">
        <WeatherWidget detailed />
      </div>
    </>
  );
}
