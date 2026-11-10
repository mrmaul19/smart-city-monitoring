"use client";

import { Star } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreferencesStore } from "@/stores/preferences-store";

/**
 * Toggles a camera as a favourite.
 *
 * Favourites live in localStorage only — there is no account system — so they
 * are per-browser, which the Settings page states plainly.
 */
export function FavouriteButton({
  cameraId,
  className,
}: {
  cameraId: string;
  className?: string;
}) {
  const favourites = usePreferencesStore((state) => state.favouriteCameraIds);
  const toggle = usePreferencesStore((state) => state.toggleFavouriteCamera);
  const isFavourite = favourites.includes(cameraId);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-pressed={isFavourite}
          aria-label={
            isFavourite ? "Remove from favourites" : "Add to favourites"
          }
          onClick={() => toggle(cameraId)}
          className={className}
        >
          <Star
            className={cn("size-4", isFavourite && "fill-warning text-warning")}
            aria-hidden
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isFavourite ? "Remove from favourites" : "Add to favourites"}
      </TooltipContent>
    </Tooltip>
  );
}
