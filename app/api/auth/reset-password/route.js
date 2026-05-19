import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

import { log, logError } from "@/lib/logger";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp, newPassword } = await req.json();

    const admin = await Admin.findOne();
    if (!admin) {
      return NextResponse.json({ error: 'No admin found.' }, { status: 404 });
    }

    if (admin.email !== email) {
      return NextResponse.json({ error: 'Email does not match admin records.' }, { status: 400 });
    }

    if (admin.otpLockUntil && admin.otpLockUntil > new Date()) {
      return NextResponse.json({ error: 'Account locked due to too many failed attempts. Try again later.' }, { status: 429 });
    }

    if (!admin.otp) {
      return NextResponse.json({ error: 'No OTP requested.' }, { status: 400 });
    }

    if (!admin.otpExpiry || admin.otpExpiry < new Date()) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, admin.otp);
    if (!isValid) {
      admin.otpAttempts = (admin.otpAttempts || 0) + 1;
      if (admin.otpAttempts >= 5) {
        admin.otpLockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15 min
        await admin.save();
        return NextResponse.json({ error: 'Too many attempts. Locked for 15 minutes.' }, { status: 429 });
      }
      await admin.save();
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    // Password strength validation
    if (!newPassword || newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long and contain uppercase, lowercase, and a number.' }, { status: 400 });
    }

    // OTP is valid, update password
    const hashedNew = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNew;
    
    // Revoke previous JWTs by bumping tokenVersion
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    
    // Clear OTP
    admin.otp = null;
    admin.otpExpiry = null;
    admin.otpAttempts = 0;
    admin.otpLockUntil = null;
    
    await admin.save();

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    logError('Reset password error:', error.message);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
