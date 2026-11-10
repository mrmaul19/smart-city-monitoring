import { Skeleton } from "@/components/ui/skeleton";

/** Shown while a route segment streams in. */
export default function Loading() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64" />
        </div>
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
