import { LocationSearch } from "@/components/dashboard/location-search";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Sticky application header.
 *
 * A Server Component: only the breadcrumb and the theme toggle need the
 * client, so the header shell itself ships no JavaScript.
 */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur">
      <div className="flex w-full items-center gap-2 px-3 sm:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-1 data-[orientation=vertical]:h-4"
        />
        <div className="min-w-0 flex-1">
          <AppBreadcrumb />
        </div>
        <LocationSearch />
        <ThemeToggle />
      </div>
    </header>
  );
}
