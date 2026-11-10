import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — smart city monitoring dashboard`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card, rendered at build time.
 *
 * Generated rather than committed as a binary so it stays in sync with the
 * site config, and uses only system fonts so the build never depends on
 * fetching a font at image-generation time.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#131a24",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <svg width="64" height="64" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="7" fill="#1c2635" />
          <path
            d="M4 16h5.2l2.6-7.4 4.4 15 3.2-9.3 2 1.7H28"
            fill="none"
            stroke="#4f8ef7"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ color: "#9ba3ae", fontSize: 30, letterSpacing: 1 }}>
          SMART CITY MONITORING
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <span style={{ color: "#f4f5f7", fontSize: 82, fontWeight: 700 }}>
          {siteConfig.name}
        </span>
        <span
          style={{
            color: "#9ba3ae",
            fontSize: 34,
            lineHeight: 1.35,
            maxWidth: 900,
          }}
        >
          Weather, air quality and public traffic camera snapshots on one
          dashboard — built entirely on open data.
        </span>
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        {["Open-Meteo", "Data.gov.sg", "OpenStreetMap"].map((source) => (
          <span
            key={source}
            style={{
              color: "#4f8ef7",
              fontSize: 26,
              padding: "10px 22px",
              borderRadius: 999,
              background: "#1b2838",
              border: "2px solid #2c3f58",
            }}
          >
            {source}
          </span>
        ))}
      </div>
    </div>,
    size,
  );
}
