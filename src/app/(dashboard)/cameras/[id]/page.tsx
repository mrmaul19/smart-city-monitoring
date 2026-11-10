import type { Metadata } from "next";

import { CameraDetail } from "@/components/cameras/camera-detail";

export async function generateMetadata({
  params,
}: PageProps<"/cameras/[id]">): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Camera ${id}`,
    description: `Snapshot, coordinates and capture time for public traffic camera ${id}.`,
  };
}

export default async function CameraDetailPage({
  params,
}: PageProps<"/cameras/[id]">) {
  const { id } = await params;

  return <CameraDetail cameraId={id} />;
}
