import { StatCardSkeleton } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streams inside the application shell, so the sidebar and header stay
 * interactive while a page's content loads. The grid matches the loaded
 * layout's geometry to avoid a shift when the real content arrives.
 */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5" aria-busy aria-label="Loading page">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-36 w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
