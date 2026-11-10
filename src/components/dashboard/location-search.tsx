"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, MapPin, Search } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRESET_LOCATIONS } from "@/config/locations";
import { useLocation } from "@/hooks/use-location";
import { useLocationSearch } from "@/hooks/use-location-search";
import type { MonitoredLocation } from "@/types/location";

function describe(location: MonitoredLocation): string {
  return [location.admin1, location.country].filter(Boolean).join(", ");
}

/**
 * Location picker with free-text search.
 *
 * Opens on click or ⌘K / Ctrl+K. Search goes through this application's own
 * geocoding route, which caches place lookups for a day — a city's coordinates
 * do not move, so the same query never hits the provider twice.
 */
export function LocationSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { location, setLocation } = useLocation();
  const { data: results, isFetching, isError } = useLocationSearch(query);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function choose(next: MonitoredLocation) {
    setLocation(next);
    setOpen(false);
    setQuery("");
  }

  const hasQuery = query.trim().length >= 2;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="max-w-48 justify-start gap-2"
      >
        <MapPin
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <span className="truncate">{location.name}</span>
        <ChevronsUpDown
          className="ml-auto size-3.5 shrink-0 opacity-50"
          aria-hidden
        />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle>Change monitored location</DialogTitle>
            <DialogDescription>
              Search for a city to update every widget on the dashboard.
            </DialogDescription>
          </DialogHeader>

          {/* shouldFilter is off: the geocoding provider already ranked the
              results, and filtering them again locally would hide matches whose
              label does not contain the raw query string. */}
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search for a city…"
            />
            <CommandList>
              {!hasQuery ? (
                <CommandGroup heading="Quick picks">
                  {PRESET_LOCATIONS.map((preset) => (
                    <CommandItem
                      key={preset.id}
                      value={preset.id}
                      onSelect={() => choose(preset)}
                    >
                      <MapPin
                        className="size-4 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="flex-1 truncate">{preset.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {describe(preset)}
                      </span>
                      {preset.id === location.id ? (
                        <Check
                          className="size-3.5 opacity-70"
                          aria-label="Current"
                        />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : isFetching ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Searching…
                </div>
              ) : isError ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Search is unavailable right now.
                </div>
              ) : !results || results.length === 0 ? (
                <CommandEmpty>No place matches “{query.trim()}”.</CommandEmpty>
              ) : (
                <CommandGroup heading="Search results">
                  {results.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.id}
                      onSelect={() => choose(result)}
                    >
                      <Search
                        className="size-4 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="flex-1 truncate">{result.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {describe(result)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandSeparator />
              <div className="px-3 py-2 text-xs text-muted-foreground">
                Weather and air quality work anywhere. Camera snapshots are
                published for Singapore only.
              </div>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
