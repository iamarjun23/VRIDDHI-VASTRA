import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import rateLimit from '@/lib/rate-limit';
import { logActivity } from '@/lib/activity';
import { log, logError } from '@/lib/logger';

// 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

  // Brute-force protection
  try {
    await loginLimiter.check(5, ip);
  } catch {
    return NextResponse.json(
      { error: 'Too many login attempts. Please wait 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    await dbConnect();
    const body = await req.json();
    const password = typeof body?.password === 'string' ? body.password.trim() : '';

    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    let admin = await Admin.findOne();
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin account not found in database. Contact system administrator.' },
        { status: 503 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    logActivity('ADMIN_LOGIN', 'admin', 'Successful admin login', ip);

    // Sign the JWT
    const { signToken } = await import('@/lib/session');
    const token = await signToken({ role: 'admin', ip, tokenVersion: admin.tokenVersion || 0, id: admin._id });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name:     'admin_access',
      value:    token,
      httpOnly: true,
      secure:   true,
      sameSite: 'strict',
      path:     '/',
      maxAge:   60 * 60 * 24, // 24 hours
    });
    return response;
  } catch (error) {
    logError('Login error:', error.message);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
