import Link from "next/link";
import { MapPin } from "lucide-react";

import { CameraSnapshot } from "@/components/cameras/camera-snapshot";
import { FavouriteButton } from "@/components/cameras/favourite-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCoordinates, formatRelativeTime } from "@/lib/utils/format";
import type { TrafficCamera } from "@/types/camera";

/**
 * Grid tile for one camera.
 *
 * The favourite control sits outside the link rather than inside it: nesting a
 * button in an anchor is invalid, and a star that navigated instead of
 * favouriting would be worse than no star at all.
 */
export function CameraCard({
  camera,
  priority = false,
}: {
  camera: TrafficCamera;
  priority?: boolean;
}) {
  return (
    <Card className="group gap-0 overflow-hidden p-0 transition-colors hover:border-primary/40">
      <Link
        href={`/cameras/${camera.id}`}
        aria-label={`Camera ${camera.id}, ${camera.area} area`}
        className="relative block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <CameraSnapshot camera={camera} priority={priority} />
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 bg-card/85 backdrop-blur"
        >
          {camera.area}
        </Badge>
      </Link>

      <div className="space-y-1.5 p-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/cameras/${camera.id}`}
            className="min-w-0 flex-1 truncate text-sm font-medium transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Camera {camera.id}
          </Link>
          <FavouriteButton cameraId={camera.id} className="-mr-2 size-8" />
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" aria-hidden />
          <span className="tabular truncate">
            {formatCoordinates(
              camera.coordinates.latitude,
              camera.coordinates.longitude,
            )}
          </span>
          <span className="ml-auto shrink-0">
            {formatRelativeTime(camera.capturedAt)}
          </span>
        </p>
      </div>
    </Card>
  );
}
