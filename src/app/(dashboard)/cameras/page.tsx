import type { Metadata } from "next";
import { Cctv } from "lucide-react";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Cameras",
  description:
    "Public traffic camera snapshots with search, location filters and per-camera detail.",
};

export default function CamerasPage() {
  return (
    <PagePlaceholder
      title="Cameras"
      description="Public traffic camera snapshots — still images, not live video"
      icon={Cctv}
      phase="Phase 4"
      planned={[
        "Snapshot grid with status indicators",
        "Search by camera name or id",
        "Filter by location",
        "Snapshot timestamp per camera",
        "Graceful handling of unavailable images",
        "Favourites stored in localStorage",
      ]}
      source="Data.gov.sg Traffic Images API — periodic JPEG snapshots"
    />
  );
}
