import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Google's OAuth client ID is public by design; the server still verifies tokens.
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
};

export default nextConfig;
