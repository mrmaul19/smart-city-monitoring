import type { Metadata } from "next";
import { Cctv } from "lucide-react";

import { CameraGrid } from "@/components/cameras/camera-grid";
import { PageHeader } from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Cameras",
  description:
    "Public traffic camera snapshots with search and area filtering. Still images, not live video.",
};

export default function CamerasPage() {
  return (
    <>
      <PageHeader
        title="Cameras"
        description="Public traffic camera snapshots — still images, not live video"
        icon={Cctv}
      />

      <CameraGrid />
    </>
  );
}
