import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Severity of a reading, mapped to the shared status tokens. */
export type StatTone = "neutral" | "success" | "warning" | "danger";

const toneClass: Record<StatTone, string> = {
  neutral: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

interface StatCardProps {
  label: string;
  /**
   * The reading itself. `null` means it has not been fetched or is
   * unavailable — the card then shows an explicit dash rather than a zero,
   * because 0 is a meaningful value for several metrics.
   */
  value: string | null;
  unit?: string;
  icon: LucideIcon;
  tone?: StatTone;
  /** Short qualifier, such as the AQI band or the observation time. */
  caption?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  tone = "neutral",
  caption,
}: StatCardProps) {
  const unavailable = value === null;

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              // Proportional figures on purpose: equal-width digits make a
              // large standalone number look loose. Tabular is for columns
              // of numbers (table rows, axis ticks), not a stat tile.
              "flex items-baseline gap-1 text-2xl font-semibold",
              unavailable ? "text-muted-foreground" : toneClass[tone],
            )}
          >
            {unavailable ? (
              <span aria-label="No data available">&mdash;</span>
            ) : (
              <>
                {value}
                {unit ? (
                  <span className="text-sm font-normal text-muted-foreground">
                    {unit}
                  </span>
                ) : null}
              </>
            )}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {unavailable ? "Awaiting data" : (caption ?? " ")}
          </p>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" aria-hidden />
        </span>
      </CardContent>
    </Card>
  );
}

/** Matching skeleton, so a loading grid keeps the same height as a loaded one. */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="size-8 rounded-md" />
      </CardContent>
    </Card>
  );
}
