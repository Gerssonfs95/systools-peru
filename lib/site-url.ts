export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://systoolsperu.netlify.app";
  const withoutProtocols = configuredUrl.trim().replace(/^(https?:\/\/)+/i, "");

  return `https://${withoutProtocols}`.replace(/\/$/, "");
}
