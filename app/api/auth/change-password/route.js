import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/session';

import { log, logError } from "@/lib/logger";

export async function POST(req) {
  try {
    const token = req.cookies.get('admin_access')?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { oldPassword, newPassword } = await req.json();

    const admin = await Admin.findOne();
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long and contain uppercase, lowercase, and a number.' }, { status: 400 });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNew;
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    await admin.save();

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    logError('Change password error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
