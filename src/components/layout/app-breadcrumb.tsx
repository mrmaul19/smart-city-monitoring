"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { allNavItems } from "@/config/navigation";

interface Crumb {
  label: string;
  href: string;
}

/**
 * Builds the trail from the URL itself, so a new route needs no extra wiring.
 * Segments that match a navigation entry use its title; anything else (a
 * camera id, for example) is shown verbatim as the final, non-linked crumb.
 */
function buildCrumbs(pathname: string): readonly Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: "Overview", href: "/" }];

  let href = "";
  for (const segment of segments) {
    href += `/${segment}`;
    const match = allNavItems.find((item) => item.href === href);
    crumbs.push({ label: match?.title ?? decodeURIComponent(segment), href });
  }

  return crumbs;
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            // BreadcrumbItem and BreadcrumbSeparator both render an <li>, so
            // the separator has to be a sibling of the item, not nested inside
            // it — an <li> inside an <li> is invalid HTML and the browser
            // reparents it, which breaks hydration.
            <Fragment key={crumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
