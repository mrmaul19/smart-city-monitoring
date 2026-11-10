# Open City Pulse

A smart city monitoring dashboard that combines public weather, air quality,
traffic camera snapshots and geospatial data into a single interface — built
entirely on free, keyless public APIs and deployable to Vercel Hobby.

> **Status: Phase 1 (project foundation).** The toolchain, theme and
> architecture are in place; feature modules land in the phases listed below.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, Cache Components) |
| Language | TypeScript, `strict` + `noUncheckedIndexedAccess` |
| Styling | Tailwind CSS v4, shadcn/ui (`radix-nova` style), Lucide icons |
| Server state | TanStack Query v5 |
| Client state | Zustand (persisted to `localStorage`) |
| Charts | Recharts |
| Maps | Leaflet + React Leaflet + OpenStreetMap tiles |
| Validation | Zod |
| Notifications | Sonner |

## Data sources

All four endpoints are free, require **no API key**, and were verified against
a live response before being wired in.

| Source | Endpoint | Used for |
| --- | --- | --- |
| Open-Meteo Forecast | `api.open-meteo.com/v1/forecast` | Current conditions, hourly and daily forecast |
| Open-Meteo Air Quality | `air-quality-api.open-meteo.com/v1/air-quality` | PM2.5, PM10, NO₂, O₃, European and US AQI |
| Open-Meteo Geocoding | `geocoding-api.open-meteo.com/v1/search` | City and country search |
| Data.gov.sg Traffic Images | `api.data.gov.sg/v1/transport/traffic-images` | Public traffic camera **snapshots** (8 cameras at the time of writing) |

Camera data consists of periodically refreshed JPEG snapshots, **not** live
video streams, and the dashboard labels it as such. See [Attribution](#attribution).

## Getting started

Requires Node.js 20.9 or newer (developed on Node 22).

```bash
npm install
npm run dev          # http://localhost:3100
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npx tsc --noEmit     # typecheck (run a build first so route types exist)
```

## Environment variables

The application runs with **no environment variables at all** — every external
API is keyless. The only optional variable is documented in
[`.env.example`](.env.example):

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Absolute base URL used for SEO metadata. Safe to omit on Vercel. |

## Image handling

Camera snapshots are rendered with a plain `<img>` element and deliberately
**bypass the Next.js image optimizer**.

Each snapshot URL carries a fresh UUID roughly every minute, so the optimizer
would count every refresh as a new source image. Vercel's Hobby plan allows
[5,000 image transformations per month](https://vercel.com/docs/image-optimization/limits-and-pricing)
and cannot purchase more, so a single visitor leaving the camera page open would
exhaust the quota within hours — after which Vercel returns HTTP 402 and the
images stop rendering entirely.

Optimisation is still used for static assets. See the `images` note in
[`next.config.ts`](next.config.ts).

## Project structure

```
src/
├── app/
│   ├── (dashboard)/      # Dashboard routes sharing the app shell
│   │   ├── cameras/[id]/
│   │   ├── weather/
│   │   ├── air-quality/
│   │   ├── map/
│   │   └── settings/
│   ├── api/              # Route Handlers acting as the upstream API proxy
│   │   ├── cameras/
│   │   ├── weather/
│   │   ├── air-quality/
│   │   └── geocoding/
│   ├── about/
│   └── layout.tsx
├── components/
│   ├── layout/ dashboard/ cameras/ weather/
│   ├── air-quality/ maps/ charts/ common/
│   └── ui/               # shadcn/ui primitives
├── config/               # Site metadata and navigation
├── hooks/                # TanStack Query hooks
├── lib/
│   ├── api/              # Fetch client, timeouts, error types
│   ├── constants/        # Endpoints, cache policy, lookup tables
│   └── utils/            # Formatting helpers
├── providers/            # Theme and query providers
├── services/             # Upstream fetching and response normalisation
├── stores/               # Zustand stores
└── types/                # Shared domain and API types
```

### Architectural rules

- **Server Components by default**; `"use client"` only where interaction
  demands it (map, charts, search, modals).
- **No external API is called from the browser.** Route Handlers under
  `app/api/` proxy every upstream request so timeouts, caching, normalisation
  and error shaping live in one place.
- **`services/` never imports React.** It fetches and normalises; `hooks/`
  adapts it to TanStack Query; `components/` only presents. This is what keeps
  a future PostgreSQL/PostGIS layer from touching the UI.
- **No fabricated real-time data.** Every reading carries the upstream
  observation timestamp, and unavailable data renders an explicit empty state.

## Roadmap

- [x] **Phase 1** — Project initialisation, TypeScript, Tailwind, shadcn/ui, architecture, all 8 routes scaffolded, error boundaries, SEO routes
- [ ] **Phase 2** — Dashboard shell: sidebar, header, reusable cards, responsive layout
- [ ] **Phase 3** — Statistics, weather widgets, charts, loading states
- [ ] **Phase 4** — API integration, normalisation, error handling, caching
- [ ] **Phase 5** — Location search, interactive map, camera details, favourites
- [ ] **Phase 6** — Production hardening and Vercel deployment

## Deployment

Target platform is **Vercel Hobby**: no VPS, no paid database, no paid APIs and
no long-running background process. Full deployment instructions are added in
Phase 6.

## Attribution

- Weather, air quality and geocoding data by [Open-Meteo](https://open-meteo.com/),
  licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Traffic camera snapshots from [Data.gov.sg](https://data.gov.sg/), used under the
  [Singapore Open Data Licence](https://data.gov.sg/open-data-licence).
- Map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors,
  used in accordance with the
  [OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/);
  attribution is displayed on every map.

## Licence

Source code is released under the [MIT Licence](LICENSE). Data remains subject to the
licences of its respective providers, listed above.
