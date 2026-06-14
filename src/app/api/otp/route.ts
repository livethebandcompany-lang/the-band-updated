import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendOtpEmail } from '@/lib/mailer';

// Generate OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/otp - Send OTP
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'No account found with that email address.' }, { status: 404 });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user._id, {
      resetOtp: hashedOtp,
      resetOtpExpiry: expiry,
    });

    await sendOtpEmail(user.email, otp, user.name);

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

// PUT /api/otp - Verify OTP and reset password
export async function PUT(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtpExpiry: { $gt: new Date() },
    }).select('+resetOtp +resetOtpExpiry');

    if (!user || !user.resetOtp) {
      return NextResponse.json(
        { error: 'OTP has expired or is invalid' },
        { status: 400 }
      );
    }

    const isValidOtp = await bcrypt.compare(otp, user.resetOtp);
    if (!isValidOtp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      $unset: { resetOtp: 1, resetOtpExpiry: 1 },
    });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
