import { NextResponse } from "next/server"

const rateLimitMap = new Map();

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Apply rate limit on all API routes
  if (pathname.startsWith('/api/')) {
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const limit = 60; // Max 60 requests
    const windowMs = 60 * 1000; // Per 1 minute

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, startTime: Date.now() });
    } else {
      const rateLimitData = rateLimitMap.get(ip);
      const currentTime = Date.now();

      if (currentTime - rateLimitData.startTime < windowMs) {
        if (rateLimitData.count >= limit) {
          return new NextResponse(
            JSON.stringify({ error: "Too many requests. Please try again later." }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          );
        }
        rateLimitData.count++;
      } else {
        rateLimitData.count = 1;
        rateLimitData.startTime = currentTime;
      }
    }
  }

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const hasAccess = req.cookies.has('admin_access');
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = { 
  matcher: ["/admin/:path*", "/api/:path*"] 
}
