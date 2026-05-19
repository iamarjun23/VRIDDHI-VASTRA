import { NextResponse } from "next/server"
import { verifyTokenEdge } from "@/lib/jwt"
import { log, logError } from "@/lib/logger"

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect all /admin pages — redirect to login if no valid session
  if (pathname.startsWith('/admin')) {
    const cookie = req.cookies.get('admin_access')?.value;
    log(`[Middleware] Request path: ${pathname}`);
    log(`[Middleware] admin_access cookie found: ${!!cookie}`);
    
    if (!cookie) {
      log(`[Middleware] Redirecting to /login (no cookie found)`);
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const payload = await verifyTokenEdge(cookie);
      log(`[Middleware] Token payload verified:`, payload);
      
      if (!payload || payload.role !== 'admin') {
        log(`[Middleware] Redirecting to /login (invalid payload or role)`);
        return NextResponse.redirect(new URL('/login', req.url));
      }
    } catch (err) {
      logError(`[Middleware] Token verification exception:`, err.message);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
