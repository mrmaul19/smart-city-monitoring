"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Cctv, Maximize2, MapPin, RotateCcw } from "lucide-react";

import { CameraSnapshot } from "@/components/cameras/camera-snapshot";
import { FavouriteButton } from "@/components/cameras/favourite-button";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCameras } from "@/hooks/use-cameras";
import { formatDateTime, formatRelativeTime } from "@/lib/utils/format";

const CameraMiniMap = dynamic(
  () =>
    import("@/components/maps/camera-mini-map").then((m) => m.CameraMiniMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full rounded-lg" />,
  },
);

/**
 * Detail view for one camera.
 *
 * The id comes from the route, but the camera itself comes from the same
 * cached snapshot set the grid uses — so navigating in from the grid needs no
 * extra request, and the provider is not asked for a single camera it has no
 * endpoint for.
 */
export function CameraDetail({ cameraId }: { cameraId: string }) {
  const { data, isPending, isError, isFetching, refetch } = useCameras();
  const camera = data?.cameras.find((item) => item.id === cameraId);

  if (isPending) {
    return (
      <>
        <Skeleton className="h-10 w-56" />
        <Skeleton className="aspect-video w-full rounded-lg" />
      </>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Snapshots unavailable"
        description="Data.gov.sg did not return a snapshot batch, so this camera cannot be shown."
        action={
          <Button variant="secondary" size="sm" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!camera) {
    return (
      <>
        <PageHeader
          title={`Camera ${cameraId}`}
          description="This camera is not in the current snapshot set"
          icon={Cctv}
        />
        <EmptyState
          icon={Cctv}
          title="Camera not published"
          description={`The provider is not currently publishing a camera with id ${cameraId}. The set of published cameras changes over time.`}
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/cameras">Back to all cameras</Link>
            </Button>
          }
        />
      </>
    );
  }

  const details = [
    { label: "Camera id", value: camera.id },
    { label: "Approximate area", value: camera.area },
    { label: "Latitude", value: camera.coordinates.latitude.toFixed(6) },
    { label: "Longitude", value: camera.coordinates.longitude.toFixed(6) },
    { label: "Resolution", value: `${camera.width} × ${camera.height}` },
    { label: "Captured", value: formatDateTime(camera.capturedAt) },
  ];

  return (
    <>
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/cameras">
            <ArrowLeft className="size-3.5" aria-hidden />
            All cameras
          </Link>
        </Button>

        <PageHeader
          title={`Camera ${camera.id}`}
          description={`${camera.area} · snapshot ${formatRelativeTime(camera.capturedAt)}`}
          icon={Cctv}
          actions={
            <>
              <Badge variant="secondary">Snapshot</Badge>
              <FavouriteButton cameraId={camera.id} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => void refetch()}
                disabled={isFetching}
                aria-label="Refresh snapshot"
              >
                <RotateCcw className="size-4" aria-hidden />
              </Button>
            </>
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="overflow-hidden p-0">
          <CameraSnapshot camera={camera} priority />
          <CardContent className="flex flex-wrap items-center gap-2 p-3">
            <p className="text-xs text-muted-foreground">
              Still image. The provider publishes a new one every 5 minutes —
              this is not a live video stream.
            </p>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="ml-auto shrink-0"
            >
              <a
                href={camera.imageUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Maximize2 className="size-3.5" aria-hidden />
                Full size
              </a>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
              <CardDescription>
                As published by Data.gov.sg. The area is derived from the
                coordinates, not an official road name.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="divide-y text-sm">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                  >
                    <dt className="text-muted-foreground">{detail.label}</dt>
                    <dd className="tabular font-medium">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-muted-foreground" aria-hidden />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CameraMiniMap camera={camera} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
