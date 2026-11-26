import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@abasto/contracts"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
