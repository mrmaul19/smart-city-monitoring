import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { WidgetCard } from "@/components/common/widget-card";
import { AirQualityWidget } from "@/components/dashboard/air-quality-widget";
import { CameraOverviewWidget } from "@/components/dashboard/camera-overview-widget";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { MapWidget } from "@/components/maps/map-widget";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "City-wide summary across weather, air quality and public traffic cameras.",
};

/**
 * Dashboard overview.
 *
 * A Server Component that composes client widgets. Each widget owns its own
 * query, so one refreshing — or failing — leaves the others untouched, and
 * nothing here re-renders when a single card refetches.
 */
export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="City-wide summary across every connected data source"
        icon={LayoutDashboard}
      />

      <StatsOverview />

      <div className="grid gap-4 xl:grid-cols-3">
        <WeatherWidget />
        <AirQualityWidget />
        <CameraOverviewWidget />
      </div>

      <WidgetCard
        title="City map"
        description="Camera locations and the selected monitoring point"
        source="OpenStreetMap contributors · CARTO basemap"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/map">
              Open map
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Button>
        }
      >
        <MapWidget heightClass="h-80" />
      </WidgetCard>
    </>
  );
}
