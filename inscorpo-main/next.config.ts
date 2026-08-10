import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers are also applied in middleware.ts; this adds
  // Content-Security-Policy which is too long for middleware headers.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
