"use client";

import { Info } from "lucide-react";

import { isCameraCoverage } from "@/config/locations";
import { useLocation } from "@/hooks/use-location";

/**
 * Says so when the camera source does not cover the monitored location.
 *
 * Weather and air quality follow whatever location is selected, but the only
 * public camera source wired in publishes Singapore snapshots. Without this
 * notice, choosing Jakarta would put Singapore camera images next to Jakarta
 * readings with nothing to mark the difference — which would read as if the
 * images were of Jakarta. Renders nothing when the location is covered.
 */
export function CoverageNotice({ className }: { className?: string }) {
  const { location } = useLocation();

  if (isCameraCoverage(location)) return null;

  return (
    <p
      className={`flex items-start gap-2 rounded-md border border-warning/25 bg-warning/5 px-3 py-2 text-xs text-muted-foreground ${className ?? ""}`}
    >
      <Info className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden />
      <span>
        These cameras are in <strong className="font-medium">Singapore</strong>,
        not {location.name}. The camera source publishes Singapore snapshots
        only — weather and air quality do follow your selected location.
      </span>
    </p>
  );
}
