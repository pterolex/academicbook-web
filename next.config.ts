import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      // Legacy Drupal auth paths.
      { source: "/user/login", destination: "/login", permanent: true },
      { source: "/user/register", destination: "/register", permanent: true },
      { source: "/user", destination: "/account", permanent: true },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Source map upload runs only when these are set (e.g. in CI/Railway build).
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Suppress SDK build logs unless debugging.
  silent: !process.env.CI,
  // Route Sentry requests through Next.js to dodge ad-blockers.
  tunnelRoute: "/monitoring",
  disableLogger: true,
});
