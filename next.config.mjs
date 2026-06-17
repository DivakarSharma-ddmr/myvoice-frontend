/**
 * Next.js config — static export for GitHub Pages.
 *
 * GitHub Pages serves a project site under /<repo-name>/, so we set basePath.
 * When your dev team hosts this on a custom domain at the root, set
 * NEXT_PUBLIC_BASE_PATH="" (empty) in the environment and basePath becomes "".
 */
const repo = 'myvoice-frontend';
const isProd = process.env.NODE_ENV === 'production';
// Allow overriding the base path (e.g. "" for a root domain) via env.
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : isProd
      ? `/${repo}`
      : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // static HTML export (no Node server needed)
  trailingSlash: true, // friendlier paths for static hosts like GitHub Pages
  basePath,
  images: {
    unoptimized: true, // required for static export
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
