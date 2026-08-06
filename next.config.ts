import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  // Lean runtime image for Docker deploys (Easypanel): only traced files +
  // a minimal server.js get copied into the final container.
  output: "standalone",
};

export default nextConfig;
