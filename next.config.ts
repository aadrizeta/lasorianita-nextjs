import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.pacomerlos.com",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
