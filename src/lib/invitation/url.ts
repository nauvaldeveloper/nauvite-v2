/**
 * Link web yang aman dipasang di href (Maps, YouTube, situs mitra).
 * - "https://..." dan "http://..." diterima apa adanya
 * - alamat tanpa awalan ("maps.app.goo.gl/abc") diberi "https://"
 * - skema lain (javascript:, data:, dll.) ditolak dan menghasilkan undefined
 */
export function safeWebUrl(value: string | null | undefined): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return isValid(v) ? v : undefined;
  // Ada skema lain di depan (mis. "javascript:"), atau diawali "//" / "/"
  if (/^[a-z][a-z0-9+.-]*:/i.test(v) || v.startsWith("/")) return undefined;
  const withScheme = `https://${v}`;
  return isValid(withScheme) ? withScheme : undefined;
}

function isValid(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}
