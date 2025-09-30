// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // You’re now using Postgres via `pg` in the Node.js runtime.
  // Marking it external avoids bundling optional/native bits.
  // (Safe to remove if you prefer; it’s optional.)
  serverExternalPackages: ['pg'],

  // Tell Turbopack the real root is this directory
  turbopack: {
    root: __dirname,
  },

  // If webpack is used for the server build (fallback paths),
  // keep `pg` external there too.
  webpack: (config, { isServer }) => {
    if (isServer) {
      const externals = Array.isArray(config.externals)
        ? config.externals
        : (config.externals ? [config.externals] : []);
      externals.push('pg');
      config.externals = externals;
    }
    return config;
  },
};

export default nextConfig;
