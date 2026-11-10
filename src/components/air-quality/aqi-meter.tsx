import { AqiBadge } from "@/components/air-quality/aqi-badge";
import { BAND_TONE } from "@/lib/constants/air-quality";
import type { AirQualityIndex } from "@/types/air-quality";

const TONE_FILL = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
} as const;

/**
 * An index as a value plus a position on its own scale.
 *
 * The bar is a magnitude cue, not the encoding: the number, the band label and
 * an icon all carry the reading, so nothing here depends on colour alone. The
 * scale maximum is stated, because "66" means very different things on the
 * European 0–100 index and the US 0–500 one.
 */
export function AqiMeter({
  title,
  index,
  scaleMax,
  scaleNote,
}: {
  title: string;
  index: AirQualityIndex | null;
  scaleMax: number;
  scaleNote: string;
}) {
  if (!index) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Not published for this location.
        </p>
      </div>
    );
  }

  const tone = BAND_TONE[index.band];
  const percent = Math.min(100, Math.max(2, (index.value / scaleMax) * 100));

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl leading-tight font-semibold">{index.value}</p>
        </div>
        <AqiBadge index={index} />
      </div>

      <div
        role="meter"
        aria-valuenow={index.value}
        aria-valuemin={0}
        aria-valuemax={scaleMax}
        aria-label={`${title}: ${index.value} of ${scaleMax}, ${index.label}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={`h-full rounded-full ${TONE_FILL[tone]}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{scaleNote}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {index.advice}
        </p>
      </div>
    </div>
  );
}
