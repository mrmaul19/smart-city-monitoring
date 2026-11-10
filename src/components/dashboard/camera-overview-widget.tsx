"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";

import { CameraCard } from "@/components/cameras/camera-card";
import { CoverageNotice } from "@/components/cameras/coverage-notice";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { WidgetCard } from "@/components/common/widget-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCameras } from "@/hooks/use-cameras";
import { formatDateTime } from "@/lib/utils/format";

/** The most recent snapshots, with a link through to the full grid. */
export function CameraOverviewWidget({ limit = 4 }: { limit?: number }) {
  const { data, isPending, isError, isFetching, refetch } = useCameras();
  const cameras = data?.cameras.slice(0, limit) ?? [];

  return (
    <WidgetCard
      title="Camera snapshots"
      description="Public traffic cameras — still images, not live video"
      source="Data.gov.sg Traffic Images"
      observedAt={data ? formatDateTime(data.publishedAt) : undefined}
      action={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh snapshots"
        >
          <RotateCcw className="size-4" aria-hidden />
        </Button>
      }
    >
      {isPending ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: limit }, (_, index) => (
            <Skeleton key={index} className="aspect-video w-full rounded-md" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Snapshots unavailable"
          description="Data.gov.sg did not return a snapshot batch."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void refetch()}
            >
              Try again
            </Button>
          }
        />
      ) : cameras.length === 0 ? (
        <EmptyState
          title="No cameras published"
          description="The provider returned an empty snapshot set."
        />
      ) : (
        <div className="space-y-3">
          <CoverageNotice />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cameras.map((camera, index) => (
              <CameraCard
                key={camera.id}
                camera={camera}
                priority={index < 2}
              />
            ))}
          </div>
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/cameras">
              View all {data?.cameras.length ?? 0} cameras
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      )}
    </WidgetCard>
  );
}
