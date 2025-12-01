import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ESLintのビルド時チェックを無効化
    ignoreDuringBuilds: true,
  },
  
};

export default nextConfig;
