import Link from "next/link";

import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/**
 * Minimal shell shared by every dashboard route.
 *
 * Phase 2 replaces this with the real application shell (collapsible sidebar,
 * header, breadcrumbs and mobile drawer). For now it only provides a container
 * and plain navigation so every route is reachable and the layout boundary
 * already exists where Phase 2 needs it.
 */
export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            {siteConfig.shortName}
          </Link>
          <nav aria-label="Main" className="flex flex-wrap gap-x-4 gap-y-1">
            {navigation.flatMap((section) =>
              section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {item.title}
                </Link>
              )),
            )}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
