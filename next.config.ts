import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The whole site is static, so build plain files into out/ for Cloudflare.
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
