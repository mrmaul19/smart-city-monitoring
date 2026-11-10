import { CircleCheck, CircleAlert, OctagonAlert } from "lucide-react";
import { cn } from "cn";

import { BAND_TONE } from "@/lib/constants/air-quality";
import type { AirQualityIndex } from "@/types/air-quality";

const TONE_CLASS = {
  success: "bg-success/10 text-success ring-success/25",
  warning: "bg-warning/10 text-warning ring-warning/25",
  danger: "bg-destructive/10 text-destructive ring-destructive/25",
} as const;

const TONE_ICON = {
  success: CircleCheck,
  warning: CircleAlert,
  danger: OctagonAlert,
} as const;

/**
 * Severity badge for an air quality index.
 *
 * Status colour never carries the meaning alone: the band label and an icon
 * always accompany it, so the state survives colour-blindness and greyscale.
 */
export function AqiBadge({
  index,
  className,
}: {
  index: AirQualityIndex;
  className?: string;
}) {
  const tone = BAND_TONE[index.band];
  const Icon = TONE_ICON[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE_CLASS[tone],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {index.label}
    </span>
  );
}
