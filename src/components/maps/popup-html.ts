/**
 * Escapes a value for interpolation into popup markup.
 *
 * Leaflet popups take an HTML string, and the values going into them — camera
 * ids, derived area labels, image URLs — come from an external API. Escaping
 * them keeps a provider change, or a compromised upstream, from injecting
 * markup into the page.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escapes a URL and refuses anything that is not plain http(s). */
export function escapeUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return escapeHtml(url.toString());
  } catch {
    return "";
  }
}
