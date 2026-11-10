import type { Metadata } from "next";
import { Wind } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { AirQualityWidget } from "@/components/dashboard/air-quality-widget";

export const metadata: Metadata = {
  title: "Air quality",
  description:
    "Particulate matter, pollutant concentrations and air quality indices for the selected location.",
};

export default function AirQualityPage() {
  return (
    <>
      <PageHeader
        title="Air quality"
        description="Particulate matter, pollutants and index bands"
        icon={Wind}
      />

      <div className="max-w-3xl">
        <AirQualityWidget detailed />
      </div>
    </>
  );
}
