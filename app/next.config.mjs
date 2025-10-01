/**
 * Temporary copy of next.config.mjs in app/ for safety (if present previously).
 * See root next.config.mjs for details.
 */
export default {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: { appDir: true }
};
