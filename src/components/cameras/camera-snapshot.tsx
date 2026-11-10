"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "cn";

import { Skeleton } from "@/components/ui/skeleton";
import type { TrafficCamera } from "@/types/camera";

/**
 * A single camera snapshot.
 *
 * Rendered with a plain <img>, never next/image: each snapshot URL carries a
 * fresh UUID every 5 minutes, so the optimizer would bill every new snapshot as
 * a new source image and exhaust Vercel Hobby's monthly transformation quota.
 *
 * The provider sometimes serves a URL whose image is already gone, so a load
 * failure is a normal state here and gets its own explicit rendering rather
 * than a broken-image icon.
 */
export function CameraSnapshot({
  camera,
  className,
  priority = false,
}: {
  camera: TrafficCamera;
  className?: string;
  priority?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">(
    "loading",
  );

  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-muted", className)}
      style={{ aspectRatio: `${camera.width} / ${camera.height}` }}
    >
      {status === "loading" ? (
        <Skeleton className="absolute inset-0 rounded-none" />
      ) : null}

      {status === "failed" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff className="size-5" aria-hidden />
          <p className="px-3 text-center text-xs">Snapshot unavailable</p>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element -- see note above:
           optimising rotating snapshot URLs would exhaust the Hobby quota. */
        <img
          src={camera.imageUrl}
          alt={`Traffic camera ${camera.id}, ${camera.area} area`}
          width={camera.width}
          height={camera.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("failed")}
          className={cn(
            "size-full object-cover transition-opacity",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
