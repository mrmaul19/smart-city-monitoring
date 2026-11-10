import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Development phase that will implement this route. */
  phase: string;
  /** What this route will show once implemented. */
  planned: readonly string[];
  /** Upstream data source, named so the page is never mistaken for real data. */
  source?: string;
}

/**
 * Honest placeholder for a route that is scaffolded but not yet implemented.
 *
 * It deliberately shows no numbers, charts or fake readings: the spec forbids
 * presenting unavailable data as real, so an unimplemented page says so.
 */
export function PagePlaceholder({
  title,
  description,
  icon,
  phase,
  planned,
  source,
}: PagePlaceholderProps) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        icon={icon}
        actions={<Badge variant="outline">{phase}</Badge>}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Not implemented yet</CardTitle>
          <CardDescription>
            This route is scaffolded so navigation works end to end. It shows no
            readings because none have been fetched — no placeholder numbers are
            displayed in their place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Planned for {phase}
            </p>
            <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
              {planned.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {source ? (
            <p className="border-t pt-3 text-xs text-muted-foreground">
              Data source: {source}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
