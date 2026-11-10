import type { Metadata } from "next";
import { Map as MapIcon } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { MapWidget } from "@/components/maps/map-widget";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Map",
  description:
    "Interactive map of public camera locations and the selected monitoring point.",
};

export default function MapPage() {
  return (
    <>
      <PageHeader
        title="Map"
        description="Camera locations and the selected monitoring point"
        icon={MapIcon}
      />

      <MapWidget heightClass="h-[clamp(20rem,65vh,42rem)]" />

      <Card>
        <CardContent className="flex flex-wrap gap-x-6 gap-y-2 p-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2.5 rounded-full bg-primary ring-2 ring-primary/30"
            />
            Monitored location
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2 rounded-full bg-chart-1 ring-2 ring-chart-1/30"
            />
            Traffic camera
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2 rounded-full bg-warning ring-2 ring-warning/30"
            />
            Favourite camera
          </span>
          <span className="ml-auto">
            Click anywhere on the map to monitor that point.
          </span>
        </CardContent>
      </Card>
    </>
  );
}
