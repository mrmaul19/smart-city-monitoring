import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onStoreChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * The viewport width is unknown while rendering on the server, so the desktop
 * layout is assumed. The sidebar's mobile sheet is only ever opened by a user
 * interaction, which happens after hydration has corrected this.
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks whether the viewport is below the mobile breakpoint.
 *
 * Replaces the generated useState/useEffect version, which called setState
 * synchronously inside an effect and triggered cascading renders.
 * useSyncExternalStore is the supported way to read from an external source
 * such as matchMedia, and it is tear-free under concurrent rendering.
 */
export function useIsMobile(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
