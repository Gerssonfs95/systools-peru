import Script from "next/script";

export function GoogleAdSense() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-3834473332305596";

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
