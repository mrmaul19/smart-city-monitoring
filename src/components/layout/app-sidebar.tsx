"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { brandIcon as BrandIcon, navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/**
 * Determines which navigation entry is current.
 *
 * `/` must match exactly, or it would stay highlighted on every page; every
 * other entry also matches its nested routes so /cameras/2701 keeps "Cameras"
 * active.
 */
function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={siteConfig.name}>
              <Link href="/">
                <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <BrandIcon className="size-4" aria-hidden />
                </span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">
                    {siteConfig.shortName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Smart city monitoring
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = isRouteActive(pathname, item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                        >
                          <item.icon aria-hidden />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 text-xs leading-relaxed text-muted-foreground group-data-[collapsible=icon]:hidden">
          Open data only. No API keys, no tracking.
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
