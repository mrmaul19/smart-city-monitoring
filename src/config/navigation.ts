import {
  Activity,
  Cctv,
  CloudSun,
  Info,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export interface NavSection {
  label: string;
  items: readonly NavItem[];
}

export const navigation: readonly NavSection[] = [
  {
    label: "Monitoring",
    items: [
      {
        title: "Overview",
        href: "/",
        icon: LayoutDashboard,
        description: "City-wide summary across every data source",
      },
      {
        title: "Cameras",
        href: "/cameras",
        icon: Cctv,
        description: "Public traffic camera snapshots",
      },
      {
        title: "Weather",
        href: "/weather",
        icon: CloudSun,
        description: "Current conditions and forecast",
      },
      {
        title: "Air Quality",
        href: "/air-quality",
        icon: Wind,
        description: "Particulate matter and AQI readings",
      },
      {
        title: "Map",
        href: "/map",
        icon: MapIcon,
        description: "Interactive geospatial view",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Units, refresh behaviour and preferences",
      },
      {
        title: "About",
        href: "/about",
        icon: Info,
        description: "Data sources, licensing and attribution",
      },
    ],
  },
] as const;

/** Flat list of every route, used for breadcrumb and active-state lookups. */
export const allNavItems: readonly NavItem[] = navigation.flatMap(
  (section) => section.items,
);

export const brandIcon = Activity;
