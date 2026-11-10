"use client";

interface TooltipRow {
  label: string;
  value: string;
  /** CSS colour of the series swatch; identity is carried by the swatch, not the text. */
  color?: string;
}

interface ChartTooltipProps {
  heading: string;
  rows: readonly TooltipRow[];
}

/**
 * Tooltip body shared by every chart.
 *
 * Values and labels wear text tokens, never the series colour — the swatch
 * beside them carries identity, so the text stays readable at any contrast.
 */
export function ChartTooltipContent({ heading, rows }: ChartTooltipProps) {
  return (
    <div className="rounded-md border bg-popover px-2.5 py-2 text-popover-foreground shadow-md">
      <p className="mb-1 text-xs font-medium">{heading}</p>
      <ul className="space-y-0.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-2 text-xs">
            {row.color ? (
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full"
                style={{ background: row.color }}
              />
            ) : null}
            <span className="text-muted-foreground">{row.label}</span>
            <span className="tabular ml-auto font-medium">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
