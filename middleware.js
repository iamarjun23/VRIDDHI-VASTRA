import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/session"

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect all /admin pages — redirect to login if no valid session
  if (pathname.startsWith('/admin')) {
    const cookie = req.cookies.get('admin_access')?.value;
    
    if (!cookie) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const payload = await verifyToken(cookie);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run on admin pages — API rate limiting is handled per-route
  matcher: ["/admin/:path*"]
}
