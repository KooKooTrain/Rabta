import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is intentionally OFF: it makes any uncached/dynamic read
  // (env vars, Date, Math.random) a build error unless wrapped in <Suspense>.
  // That costs time under hackathon pressure. Re-enable later if needed with
  // `cacheComponents: true, partialPrefetching: true`.
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
