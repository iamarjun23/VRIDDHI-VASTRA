import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const admin = await Admin.findOne();
    if (!admin) {
      return NextResponse.json({ error: 'No admin found. Please login first to initialize.' }, { status: 404 });
    }

    if (admin.email !== email) {
      return NextResponse.json({ error: 'Email does not match admin records.' }, { status: 400 });
    }

    // Generate a 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    // Send email via nodemailer
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      // Removed dev mode log
      return NextResponse.json({ success: true, message: 'OTP generated' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this or use host/port if not gmail
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

    return NextResponse.json({ success: true, message: 'OTP sent to email.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
