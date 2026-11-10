import type { Metadata } from "next";
import { Map as MapIcon } from "lucide-react";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Map",
  description:
    "Interactive map of camera locations and the selected monitoring location.",
};

export default function MapPage() {
  return (
    <PagePlaceholder
      title="Map"
      description="Interactive geospatial view of cameras and the selected location"
      icon={MapIcon}
      phase="Phase 5"
      planned={[
        "Leaflet map, lazy loaded on the client",
        "Camera markers with snapshot popups",
        "Selected location marker",
        "Click to select a new location",
        "Zoom and pan controls",
        "OpenStreetMap attribution",
      ]}
      source="OpenStreetMap tiles — used under the OSM Tile Usage Policy"
    />
  );
}
