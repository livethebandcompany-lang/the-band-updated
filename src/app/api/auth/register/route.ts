import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import InviteCode from '@/models/InviteCode';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, inviteCode, adharCardNumber, jobType } = await req.json();

    // Validate inputs
    if (!name || !email || !password || !inviteCode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify invite code — first find by code alone, then check email
    const inviteByCode = await InviteCode.findOne({
      code: inviteCode.toUpperCase(),
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!inviteByCode) {
      return NextResponse.json(
        { error: 'Invalid or expired invite code' },
        { status: 400 }
      );
    }

    if (inviteByCode.allowedEmail !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'This invite code is not valid for this email address' },
        { status: 400 }
      );
    }

    const invite = inviteByCode;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: invite.role,
      provider: 'credentials',
      ...(adharCardNumber && { adharCardNumber }),
      ...(jobType && { jobType }),
    });

    // Mark invite as used
    await InviteCode.findByIdAndUpdate(invite._id, {
      isUsed: true,
      usedBy: user._id,
    });

    return NextResponse.json(
      { message: 'Account created successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
