import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure API routes are not statically generated
  trailingSlash: false,
};

export default nextConfig;
