import { cookies } from "next/headers";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/** Cookie written by SidebarProvider when the user collapses or expands it. */
const SIDEBAR_COOKIE = "sidebar_state";

/**
 * Application shell shared by every dashboard route.
 *
 * The sidebar's collapsed state is read from its cookie here and passed as
 * `defaultOpen`, because SidebarProvider only *writes* that cookie — without
 * this, a user who collapsed the sidebar would see it render expanded and then
 * snap shut after hydration.
 *
 * Because Cache Components is enabled, reading the cookie does not cost the
 * static prerender: these routes build as Partial Prerender, so the shell is
 * still served as static HTML and only the cookie-dependent part streams in.
 */
export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE)?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      {/* SidebarInset already renders a <main>, so it carries the skip-link
          target itself. Wrapping the children in a second <main> nested one
          inside the other is invalid HTML — the browser reparents it and
          hydration then mismatches. The padding wrapper is a plain div. */}
      <SidebarInset id="main-content">
        <AppHeader />
        <div className="flex flex-1 flex-col gap-5 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
