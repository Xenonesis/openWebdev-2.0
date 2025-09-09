import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure API routes are not statically generated
  trailingSlash: false,
  
  // Improve font loading reliability
  experimental: {
    optimizePackageImports: ['@radix-ui/react-slot', '@radix-ui/react-switch']
  },
  
  // Handle network issues during build
  env: {
    NEXT_FONT_GOOGLE_MOCKED_RESPONSES: process.env.NODE_ENV === 'test' ? 'true' : undefined,
  }
};

export default nextConfig;
