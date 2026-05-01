/** @type {import('next').NextConfig} */
const path = require('path');

/** Headers de sécurité (CSP, HSTS, etc.) — niveau élevé */
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/favicon.svg' }];
  },
  devIndicators: { buildActivity: true },
  typescript: { ignoreBuildErrors: false },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ["app", "components", "lib", "hooks"],
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "recharts",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
      "@radix-ui/react-label",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
    ],
    instrumentationHook: true,
  },
  async headers() {
    return [
      { source: "/api/(.*)", headers: [{ key: "Cache-Control", value: "no-store" }] },
      {
        source: "/videos/:path*",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
          { key: "Content-Type", value: "video/mp4" },
        ],
      },
      { source: "/:path*", headers: securityHeaders },
    ];
  },
  transpilePackages: ['three', 'postprocessing', 'three-stdlib', '@react-three/drei', '@monogrid/gainmap-js'],
  webpack: (config, { dev, isServer }) => {
    // En dev, desactiver le cache webpack pour eviter 404 sur les chunks (cache corrompu)
    if (dev) {
      config.cache = false;
    }
    const root = path.resolve(__dirname);
    const stdlib = path.join(root, 'node_modules/three-stdlib');
    const existingAlias = (config.resolve && config.resolve.alias) || {};
    if (Array.isArray(existingAlias)) {
      config.resolve.alias = [...existingAlias, { name: '@react-three/drei', alias: path.join(root, 'node_modules/@react-three/drei/index.cjs.js') }, { name: '@monogrid/gainmap-js', alias: path.join(root, 'lib/gainmap-stub.js') }];
    } else {
      config.resolve.alias = {
        ...existingAlias,
        '@react-three/drei': path.join(root, 'node_modules/@react-three/drei/index.cjs.js'),
        '@monogrid/gainmap-js': path.join(root, 'lib/gainmap-stub.js'),
      };
    }
    // three-stdlib 2.36+: fichiers .cjs manquants, rediriger vers .js (ESM)
    config.resolve.alias['./postprocessing/OutlinePass.cjs'] = path.join(stdlib, 'postprocessing/OutlinePass.js');
    config.resolve.alias['./geometries/ParametricGeometries.cjs'] = path.join(stdlib, 'geometries/ParametricGeometries.js');
    config.resolve.alias['./shaders/ParallaxShader.cjs'] = path.join(stdlib, 'shaders/ParallaxShader.js');
    config.resolve.alias['./effects/ParallaxBarrierEffect.cjs'] = path.join(stdlib, 'effects/ParallaxBarrierEffect.js');
    return config;
  },
};

module.exports = nextConfig;
