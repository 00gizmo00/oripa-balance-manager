import type { NextConfig } from "next";

const isLocalWindowsDev =
  process.platform === "win32" &&
  process.env.NODE_ENV === "development" &&
  process.env.VERCEL !== "1";

const nextConfig: NextConfig = {
  ...(isLocalWindowsDev ? { distDir: ".next-app" } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
