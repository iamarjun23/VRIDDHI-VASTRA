import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import { log, logError } from "@/lib/logger";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const admin = await Admin.findOne();
    if (!admin || admin.email !== email) {
      return NextResponse.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });
    }

    if (admin.otpLockUntil && admin.otpLockUntil > new Date()) {
      return NextResponse.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });
    }

    // Generate an 8 digit OTP securely
    const otp = crypto.randomInt(10000000, 100000000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const hashedOtp = await bcrypt.hash(otp, 10);

    admin.otp = hashedOtp;
    admin.otpExpiry = otpExpiry;
    admin.otpAttempts = 0;
    admin.otpLockUntil = null;
    await admin.save();

    // Send email via nodemailer
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      return NextResponse.json({ success: true, message: 'OTP generated' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const mailOptions = {
      from: `"Vriddhi Vastra Admin" <${smtpEmail}>`,
      to: email,
      subject: 'Admin Password Reset OTP',
      text: `Your OTP for resetting the admin password is: ${otp}. It will expire in 15 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4a5d23;">Password Reset Request</h2>
          <p>You requested a password reset for the Vriddhi Vastra Admin Portal.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #000; background: #f9f8f6; padding: 10px; display: inline-block; border-radius: 8px;">${otp}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });
  } catch (error) {
    logError('Forgot password error:', error.message);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
