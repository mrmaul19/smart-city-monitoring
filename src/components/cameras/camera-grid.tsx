"use client";

import { useMemo, useState } from "react";
import { Cctv, RotateCcw, Search, Star } from "lucide-react";
import { cn } from "cn";

import { CameraCard } from "@/components/cameras/camera-card";
import { CoverageNotice } from "@/components/cameras/coverage-notice";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCameras } from "@/hooks/use-cameras";
import { formatDateTime } from "@/lib/utils/format";
import { usePreferencesStore } from "@/stores/preferences-store";

/**
 * Searchable, filterable grid of every published snapshot.
 *
 * Filtering happens on the client against the one cached response, because the
 * provider publishes a single national batch — issuing a request per keystroke
 * would spend its rate limit without returning anything new. The filter row
 * sits above the grid it scopes rather than inside a card.
 */
export function CameraGrid() {
  const { data, isPending, isError, isFetching, refetch } = useCameras();
  const favourites = usePreferencesStore((state) => state.favouriteCameraIds);
  const [query, setQuery] = useState("");
  const [areas, setAreas] = useState<readonly string[]>([]);
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  const availableAreas = useMemo(() => {
    const unique = new Set((data?.cameras ?? []).map((camera) => camera.area));
    return [...unique].sort();
  }, [data]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return (
      (data?.cameras ?? [])
        .filter((camera) => {
          const matchesQuery =
            term.length === 0 ||
            camera.id.toLowerCase().includes(term) ||
            camera.area.toLowerCase().includes(term);

          const matchesArea = areas.length === 0 || areas.includes(camera.area);

          const matchesFavourite =
            !favouritesOnly || favourites.includes(camera.id);

          return matchesQuery && matchesArea && matchesFavourite;
        })
        // Favourites lead, then camera id — so the order is stable between
        // refreshes rather than following whatever the provider returned.
        .sort((a, b) => {
          const aFav = favourites.includes(a.id) ? 0 : 1;
          const bFav = favourites.includes(b.id) ? 0 : 1;
          return aFav - bFav || a.id.localeCompare(b.id);
        })
    );
  }, [data, query, areas, favouritesOnly, favourites]);

  function toggleArea(area: string) {
    setAreas((current) =>
      current.includes(area)
        ? current.filter((item) => item !== area)
        : [...current, area],
    );
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-video w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Snapshots unavailable"
        description="Data.gov.sg did not return a snapshot batch."
        action={
          <Button variant="secondary" size="sm" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <CoverageNotice />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search
            className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by camera id or area"
            aria-label="Search cameras"
            className="pl-8"
          />
        </div>

        <Button
          variant={favouritesOnly ? "secondary" : "outline"}
          size="sm"
          aria-pressed={favouritesOnly}
          onClick={() => setFavouritesOnly((current) => !current)}
        >
          <Star
            className={cn(
              "size-3.5",
              favouritesOnly && "fill-warning text-warning",
            )}
            aria-hidden
          />
          Favourites
          {favourites.length > 0 ? ` (${favourites.length})` : ""}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Area{areas.length > 0 ? ` (${areas.length})` : ""}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Filter by area</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableAreas.map((area) => (
              <DropdownMenuCheckboxItem
                key={area}
                checked={areas.includes(area)}
                onCheckedChange={() => toggleArea(area)}
              >
                {area}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh snapshots"
        >
          <RotateCcw className="size-4" aria-hidden />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {data?.cameras.length ?? 0} cameras.
        Snapshots published {data ? formatDateTime(data.publishedAt) : "—"}.
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Cctv}
          title="No cameras match"
          description={
            favouritesOnly && favourites.length === 0
              ? "You have not starred any cameras yet."
              : "No camera matches that search term or filter."
          }
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery("");
                setAreas([]);
                setFavouritesOnly(false);
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((camera, index) => (
            <CameraCard key={camera.id} camera={camera} priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
