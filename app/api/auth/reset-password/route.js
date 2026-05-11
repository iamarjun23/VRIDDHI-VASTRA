import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

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

    if (!admin.otp || admin.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    if (!admin.otpExpiry || admin.otpExpiry < new Date()) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
    }

    // OTP is valid, update password
    const hashedNew = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNew;
    
    // Clear OTP
    admin.otp = null;
    admin.otpExpiry = null;
    
    await admin.save();

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
