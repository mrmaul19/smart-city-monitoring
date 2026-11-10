"use client";

import { useTheme } from "next-themes";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "@/hooks/use-location";
import { formatCoordinates } from "@/lib/utils/format";
import {
  REFRESH_INTERVALS,
  usePreferencesStore,
  type AqiPreference,
  type RefreshInterval,
} from "@/stores/preferences-store";

function refreshLabel(seconds: RefreshInterval): string {
  if (seconds === 0) return "Manual only";
  if (seconds < 120) return `Every ${seconds} seconds`;
  return `Every ${seconds / 60} minutes`;
}

/**
 * Preferences, all of which live in this browser only.
 *
 * There is no account and no server-side store, so the panel says so and
 * offers an explicit way to clear everything — the user should be able to
 * remove what the app kept about them.
 */
export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { location, resetLocation } = useLocation();

  const aqiPreference = usePreferencesStore((state) => state.aqiPreference);
  const setAqiPreference = usePreferencesStore(
    (state) => state.setAqiPreference,
  );
  const refreshSeconds = usePreferencesStore(
    (state) => state.snapshotRefreshSeconds,
  );
  const setRefreshSeconds = usePreferencesStore(
    (state) => state.setSnapshotRefreshSeconds,
  );
  const favourites = usePreferencesStore((state) => state.favouriteCameraIds);
  const toggleFavourite = usePreferencesStore(
    (state) => state.toggleFavouriteCamera,
  );
  const clearFavourites = usePreferencesStore((state) => state.clearFavourites);

  function clearEverything() {
    clearFavourites();
    resetLocation();
    setTheme("dark");
    toast.success("Stored preferences cleared", {
      description: "Location, favourites and theme are back to their defaults.",
    });
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display</CardTitle>
          <CardDescription>
            How readings and the interface are presented.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <Label htmlFor="theme-select">Colour theme</Label>
              <p className="text-xs text-muted-foreground">
                The dashboard is designed dark-first.
              </p>
            </div>
            <Select value={theme ?? "dark"} onValueChange={setTheme}>
              <SelectTrigger id="theme-select" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">Match system</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <div className="space-y-0.5">
              <Label htmlFor="aqi-select">Preferred air quality index</Label>
              <p className="text-xs text-muted-foreground">
                Which index the overview leads with. Both are always shown on
                the air quality page.
              </p>
            </div>
            <Select
              value={aqiPreference}
              onValueChange={(value) =>
                setAqiPreference(value as AqiPreference)
              }
            >
              <SelectTrigger id="aqi-select" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="european">European AQI</SelectItem>
                <SelectItem value="us">US AQI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Snapshot refresh</CardTitle>
          <CardDescription>
            Measured: the provider publishes a new image every 5 minutes, so
            polling faster than that returns the picture you already have.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label htmlFor="refresh-select">Automatic refresh</Label>
            <Select
              value={String(refreshSeconds)}
              onValueChange={(value) =>
                setRefreshSeconds(Number(value) as RefreshInterval)
              }
            >
              <SelectTrigger id="refresh-select" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REFRESH_INTERVALS.map((seconds) => (
                  <SelectItem key={seconds} value={String(seconds)}>
                    {refreshLabel(seconds)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Favourite cameras</CardTitle>
          <CardDescription>
            Highlighted on the map and listed first on the cameras page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {favourites.length === 0 ? (
            <EmptyState
              icon={Star}
              title="No favourites yet"
              description="Use the star on any camera to keep it here."
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {favourites.map((id) => (
                <Badge key={id} variant="secondary" className="gap-1.5 pr-1">
                  Camera {id}
                  <button
                    type="button"
                    onClick={() => toggleFavourite(id)}
                    aria-label={`Remove camera ${id} from favourites`}
                    className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Trash2 className="size-3" aria-hidden />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stored data</CardTitle>
          <CardDescription>
            Everything above is kept in this browser&apos;s localStorage only.
            No account, no analytics, no server-side database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="divide-y text-sm">
            <div className="flex items-center justify-between gap-3 py-2 first:pt-0">
              <dt className="text-muted-foreground">Monitored location</dt>
              <dd className="text-right">
                {location.name}
                <span className="tabular ml-2 text-xs text-muted-foreground">
                  {formatCoordinates(location.latitude, location.longitude)}
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2 last:pb-0">
              <dt className="text-muted-foreground">Favourite cameras</dt>
              <dd className="tabular">{favourites.length}</dd>
            </div>
          </dl>

          <Button variant="destructive" size="sm" onClick={clearEverything}>
            <Trash2 className="size-3.5" aria-hidden />
            Clear stored preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
