import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Data sources, licensing, attribution and known limitations of Open City Pulse.",
};

interface DataSource {
  name: string;
  href: string;
  provides: string;
  licence: string;
  licenceHref: string;
  note?: string;
}

const dataSources: readonly DataSource[] = [
  {
    name: "Open-Meteo Forecast API",
    href: "https://open-meteo.com/en/docs",
    provides:
      "Current temperature, humidity, apparent temperature, wind, precipitation, and hourly and daily forecasts.",
    licence: "CC BY 4.0",
    licenceHref: "https://creativecommons.org/licenses/by/4.0/",
    note: "Free for non-commercial use with no API key.",
  },
  {
    name: "Open-Meteo Air Quality API",
    href: "https://open-meteo.com/en/docs/air-quality-api",
    provides:
      "PM2.5, PM10, nitrogen dioxide, ozone, sulphur dioxide, carbon monoxide, European AQI and US AQI.",
    licence: "CC BY 4.0",
    licenceHref: "https://creativecommons.org/licenses/by/4.0/",
    note: "Derived from the Copernicus Atmosphere Monitoring Service (CAMS) model, published hourly.",
  },
  {
    name: "Open-Meteo Geocoding API",
    href: "https://open-meteo.com/en/docs/geocoding-api",
    provides: "City and country search used to select a monitoring location.",
    licence: "CC BY 4.0",
    licenceHref: "https://creativecommons.org/licenses/by/4.0/",
    note: "Backed by the GeoNames database.",
  },
  {
    name: "Data.gov.sg Traffic Images API",
    href: "https://data.gov.sg/",
    provides:
      "Publicly published traffic camera snapshots with coordinates and capture time.",
    licence: "Singapore Open Data Licence",
    licenceHref: "https://data.gov.sg/open-data-licence",
    note: "Officially published still images. No unauthorised camera feed is accessed.",
  },
  {
    name: "OpenStreetMap",
    href: "https://www.openstreetmap.org/copyright",
    provides: "Base map tiles for the interactive map.",
    licence: "ODbL",
    licenceHref: "https://opendatacommons.org/licenses/odbl/",
    note: "Used in accordance with the OSM Tile Usage Policy, with attribution shown on every map.",
  },
];

const limitations: readonly string[] = [
  "Camera data consists of periodically refreshed still images, not live video streams. The interface labels every image with its capture time and never presents it as a continuous feed.",
  "At the time of writing, the Data.gov.sg traffic images endpoint returns 8 cameras. The camera layer is built as a pluggable provider so additional official sources can be added without changing the interface.",
  "Air quality figures come from a forecast model rather than a ground sensor at the selected coordinates, so they are an estimate for the area and not a station reading.",
  "Weather and air quality responses are cached for several minutes to stay within each provider's fair-use policy, so a reading may be slightly older than the moment you load the page.",
  "No reading is ever synthesised. When an upstream request fails or returns nothing, the affected widget says so instead of showing a substitute number.",
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to dashboard
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            About {siteConfig.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data sources</CardTitle>
          <CardDescription>
            Every source below is publicly accessible and requires no API key.
            Each response schema was verified against a live request before it
            was integrated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {dataSources.map((source, index) => (
            <div key={source.name} className="space-y-1.5">
              {index > 0 ? <Separator className="mb-5" /> : null}
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {source.name}
                <ExternalLink className="size-3.5 opacity-60" aria-hidden />
              </a>
              <p className="text-sm text-muted-foreground">{source.provides}</p>
              {source.note ? (
                <p className="text-xs text-muted-foreground">{source.note}</p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Licence:{" "}
                <a
                  href={source.licenceHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded underline underline-offset-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {source.licence}
                </a>
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Limitations and honest caveats
          </CardTitle>
          <CardDescription>
            What this dashboard does not claim to be.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {limitations.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning"
                  aria-hidden
                />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            There is no account system, no analytics and no server-side
            database. Your selected location, favourite cameras and display
            preferences are stored only in your own browser, using
            localStorage, and can be cleared from the Settings page.
          </p>
          <p>
            External requests are proxied through this application&apos;s own
            API routes, so your browser never contacts the upstream data
            providers directly.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
