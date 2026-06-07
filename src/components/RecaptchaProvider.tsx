"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// Wraps the storefront so forms can call useGoogleReCaptcha(). When the site
// key is unset (local dev), render children without the provider — forms detect
// the missing executeRecaptcha and submit with an empty token, which the backend
// accepts when RECAPTCHA_SECRET_KEY is also unset.
export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return <>{children}</>;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{ async: true, defer: true }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
