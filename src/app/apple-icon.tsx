import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon. Generated as a PNG because iOS home-screen icons do not
 * render SVG reliably, while the favicon stays an SVG (see icon.svg).
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#131a24",
      }}
    >
      <svg width="132" height="132" viewBox="0 0 32 32">
        <path
          d="M4 16h5.2l2.6-7.4 4.4 15 3.2-9.3 2 1.7H28"
          fill="none"
          stroke="#4f8ef7"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}
