import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@cosmos-explorer/callisto",
    "@cosmos-explorer/config",
    "@cosmos-explorer/core",
    "@cosmos-explorer/price",
    "@cosmos-explorer/ui",
    "@cosmos-explorer/utils",
  ],
};

export default nextConfig;
