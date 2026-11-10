import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every data-fetching component must either declare its cache lifetime or
  // sit behind a Suspense boundary. This is what keeps one slow widget from
  // blocking the whole dashboard render.
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    // Traffic camera snapshots are referenced from this host.
    //
    // IMPORTANT: these snapshots must NOT go through Vercel's image
    // optimizer. Each snapshot URL carries a fresh UUID every 5 minutes, so
    // every new snapshot counts as a new source image: 8 cameras x 12
    // publications an hour is ~96 source images an hour. Vercel's Hobby plan
    // allows 5,000 transformations per month and cannot buy more, so roughly
    // two days of continuous viewing would exhaust it, after which Vercel
    // returns HTTP 402 and the images stop rendering.
    //
    // Snapshots are therefore rendered with a plain <img> element. This entry
    // exists only so the host is explicitly allow-listed if a future, genuinely
    // cacheable image from it ever needs optimising.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.data.gov.sg",
        pathname: "/api/traffic-images/**",
      },
    ],
  },

  // Fail the production build on a type error rather than shipping one.
  // (Lint is run separately via `npm run lint`; Next 16 no longer accepts an
  // `eslint` key here.)
  typescript: { ignoreBuildErrors: false },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
