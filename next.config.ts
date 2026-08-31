import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The project is accessed through 127.0.0.1 during local development.
  // Without this, Next.js blocks the client/HMR resources and pages remain
  // stuck on their server-rendered loading state.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
