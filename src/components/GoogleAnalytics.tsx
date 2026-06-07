import Script from "next/script";

// GA4 measurement ID (e.g. "G-XXXXXXXXXX"). Set NEXT_PUBLIC_GA_ID in env.
// Note: the old Drupal site used Universal Analytics (UA-34691656-1), which
// Google shut down in July 2023. UA can't be reused — create a GA4 property
// in the same Google account and put its G-... id here.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
