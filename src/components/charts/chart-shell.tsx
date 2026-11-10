"use client";

import { useId, useState, type ReactNode } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

interface ChartShellProps {
  /** Describes the plot for screen readers; the visual title is on the card. */
  label: string;
  chart: ReactNode;
  /** Accessible twin. A tooltip must never be the only way to read a value. */
  table: ReactNode;
  /**
   * True while a background refetch is in flight. The previous render is held
   * at reduced opacity rather than replaced by a skeleton, which would make
   * the card flash and jump on every refresh.
   */
  isRefreshing?: boolean;
}

/**
 * Wraps a plot with its table view and a toggle between them.
 *
 * Every chart in this dashboard ships both: the plot for pattern reading, the
 * table for exact values, keyboard users and anyone the colour encoding does
 * not reach.
 */
export function ChartShell({
  label,
  chart,
  table,
  isRefreshing = false,
}: ChartShellProps) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const panelId = useId();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-1">
        <Button
          type="button"
          variant={view === "chart" ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={view === "chart"}
          onClick={() => setView("chart")}
        >
          <BarChart3 className="size-3.5" aria-hidden />
          Chart
        </Button>
        <Button
          type="button"
          variant={view === "table" ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={view === "table"}
          onClick={() => setView("table")}
        >
          <Table2 className="size-3.5" aria-hidden />
          Table
        </Button>
      </div>

      <div
        id={panelId}
        role="group"
        aria-label={label}
        aria-busy={isRefreshing}
        className={cn("transition-opacity", isRefreshing && "opacity-60")}
      >
        {view === "chart" ? chart : table}
      </div>
    </div>
  );
}
