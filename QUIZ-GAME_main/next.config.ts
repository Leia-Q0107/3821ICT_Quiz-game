import type { NextConfig } from 'next';

const ROOT = __dirname;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pg'],
  outputFileTracingRoot: ROOT,
  turbopack: { root: ROOT },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const ex = Array.isArray(config.externals)
        ? config.externals
        : (config.externals ? [config.externals] : []);
      ex.push('pg');
      config.externals = ex;
    }
    return config;
  },
};

export default nextConfig;
