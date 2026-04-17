import type { NextConfig } from "next";

// ---------------------------------------------------------------------------
// Security Headers
// Applied to every response via the Next.js headers() API.
// Adjust the CSP connect-src / font-src if you add third-party integrations.
// ---------------------------------------------------------------------------
const securityHeaders = [
  // Prevent browsers from guessing the content type (MIME sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Deny framing from other origins (clickjacking protection)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },

  // Limit referrer information sent cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Disable browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },

  // Force HTTPS for 2 years (only effective when served over HTTPS / Cloudflare Tunnel)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  // Content Security Policy
  // This site is a static portfolio with:
  //   - Next.js inline scripts (nonce not used → use 'unsafe-inline' only for style)
  //   - Geist fonts loaded by next/font (served from same origin after Next.js inlines them)
  //   - No third-party scripts
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for its runtime style injections
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // next/font inlines font data-URIs; keep fonts.gstatic.com for fallback
      "font-src 'self' https://fonts.gstatic.com data:",
      // Next.js hydration needs 'unsafe-inline'; 'unsafe-eval' needed for dev HMR only
      "script-src 'self' 'unsafe-inline'",
      // Images: self + data URIs (for inline SVGs/favicons)
      "img-src 'self' data: blob:",
      // No external API calls from this portfolio
      "connect-src 'self'",
      // No object/embed tags
      "object-src 'none'",
      // Prevent framing (belt-and-suspenders alongside X-Frame-Options)
      "frame-ancestors 'self'",
      // Only load resources over HTTPS
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Remove X-Powered-By header to avoid fingerprinting
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
