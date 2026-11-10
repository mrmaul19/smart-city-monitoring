import type { Metadata } from "next";
import { Activity, CheckCircle2, CircleDashed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { navigation } from "@/config/navigation";

/**
 * Temporary Phase 1 landing page.
 *
 * It exists only to prove the toolchain is wired correctly (theme tokens,
 * shadcn primitives, Lucide icons, the Geist font and the route config).
 * Phase 2 replaces it with the real dashboard shell under app/(dashboard).
 */

export const metadata: Metadata = {
  title: "Overview",
  description:
    "City-wide summary across weather, air quality and public traffic cameras.",
};

const completed = [
  "Next.js 16 App Router with React Server Components",
  "TypeScript in strict mode, with noUncheckedIndexedAccess",
  "Tailwind CSS v4 and shadcn/ui (Radix primitives)",
  "Dark-first theme tokens and status colours",
  "Modular src/ architecture",
  "Verified data sources: Open-Meteo and Data.gov.sg",
];

const upcoming = [
  "Phase 2 — dashboard shell, sidebar and header",
  "Phase 3 — statistics, widgets and charts",
  "Phase 4 — API route handlers and caching",
  "Phase 5 — location search, map and favourites",
  "Phase 6 — production build and deployment",
];

export default function Home() {
  const routeCount = navigation.reduce(
    (total, section) => total + section.items.length,
    0,
  );

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Activity className="size-5" aria-hidden />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {siteConfig.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Smart city monitoring — project scaffold
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          Phase 1
        </Badge>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Foundation ready</CardTitle>
          <CardDescription>
            {routeCount} routes planned. No API keys and no paid services are
            required to run this project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm">
            {completed.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Separator />

          <ul className="space-y-2 text-sm text-muted-foreground">
            {upcoming.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CircleDashed className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card aria-hidden>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Widget skeleton preview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-2 rounded-lg border p-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
