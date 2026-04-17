import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight, memory-based Rate Limiter specifically for API routes (like the contact form)
// In a serverless/distributed environment (like Vercel), this only limits per-instance, 
// which is usually enough for simple abuse protection on a portfolio.
// For robust scaling, migrate to Redis (e.g. @upstash/ratelimit) later.

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // allow 5 requests per minute per IP

export function proxy(request: NextRequest) {
  const currentUrl = request.nextUrl.pathname;

  // 1. Only apply rate limiting to /api endpoints
  if (currentUrl.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || 
      request.headers.get("x-real-ip") || 
      "unknown-ip";

    const currentTime = Date.now();
    const rateLimitData = rateLimitMap.get(ip);

    if (!rateLimitData) {
      rateLimitMap.set(ip, { count: 1, timestamp: currentTime });
    } else {
      const timeDiff = currentTime - rateLimitData.timestamp;

      if (timeDiff > WINDOW_MS) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, timestamp: currentTime });
      } else {
        rateLimitData.count += 1;

        if (rateLimitData.count > MAX_REQUESTS_PER_WINDOW) {
          // Reject request with 429 Too Many Requests
          return new NextResponse(
            JSON.stringify({ error: "Too many requests. Please try again later." }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                // Inform client when they can try again
                "Retry-After": Math.ceil((WINDOW_MS - timeDiff) / 1000).toString(),
              },
            }
          );
        }
      }
    }
  }

  return NextResponse.next();
}

// Ensure middleware only runs on API routes to avoid performance overhead on static pages
export const config = {
  matcher: "/api/:path*",
};
