import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WidgetCardProps {
  title: string;
  description?: string;
  /** Controls shown in the card's top-right corner. */
  action?: ReactNode;
  children: ReactNode;
  /**
   * Upstream provider for the data shown. Rendered in the footer so a reading
   * is never separated from where it came from.
   */
  source?: string;
  /**
   * When the upstream data was observed, already formatted. Kept distinct from
   * the time the request was made, which would overstate how fresh it is.
   */
  observedAt?: string;
}

/**
 * Shell for any dashboard widget.
 *
 * It exists so every widget carries its provenance in the same place: the
 * spec forbids presenting data without its source and observation time, and
 * a shared shell is what makes that automatic rather than remembered.
 */
export function WidgetCard({
  title,
  description,
  action,
  children,
  source,
  observedAt,
}: WidgetCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>

      <CardContent className="flex-1">{children}</CardContent>

      {source || observedAt ? (
        <CardFooter className="flex-wrap gap-x-3 gap-y-1 border-t text-xs text-muted-foreground">
          {source ? <span className="truncate">{source}</span> : null}
          {observedAt ? (
            <span className="tabular ml-auto">Observed {observedAt}</span>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  );
}
