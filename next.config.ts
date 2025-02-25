import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['api.randomx.ai', 'assets.newatlas.com', 'newatlas-brightspot.s3.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.randomx.ai',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.newatlas.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'newatlas-brightspot.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.tenor.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
