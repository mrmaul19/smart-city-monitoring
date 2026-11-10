import type { Metadata } from "next";
import { Cctv } from "lucide-react";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Camera detail",
  description: "Snapshot, coordinates and capture time for a single camera.",
};

export default async function CameraDetailPage({
  params,
}: PageProps<"/cameras/[id]">) {
  const { id } = await params;

  return (
    <PagePlaceholder
      title={`Camera ${id}`}
      description="Snapshot detail, coordinates and capture time"
      icon={Cctv}
      phase="Phase 5"
      planned={[
        "Full-size snapshot with capture timestamp",
        "Latitude and longitude",
        "Location on a mini map",
        "Manual and automatic snapshot refresh",
        "Add to or remove from favourites",
        "Explicit empty state when the snapshot is unavailable",
      ]}
      source="Data.gov.sg Traffic Images API — periodic JPEG snapshots"
    />
  );
}
