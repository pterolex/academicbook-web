import type { NextConfig } from "next";

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

export default nextConfig;
