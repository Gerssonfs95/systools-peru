import Script from "next/script";

export function GoogleAdSense() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!publisherId) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
    />
  );
}
