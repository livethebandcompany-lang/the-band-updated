import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import InviteCode from '@/models/InviteCode';
import User from '@/models/User';
import { sendInviteEmail } from '@/lib/mailer';
import crypto from 'crypto';

function generateCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g. "A3F9B2C1"
}

// GET /api/invite - List all invite codes (admin only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectDB();
  const invites = await InviteCode.find()
    .populate('createdBy', 'name email')
    .populate('usedBy', 'name email')
    .sort({ createdAt: -1 });

  return NextResponse.json(invites);
}

// POST /api/invite - Create invite code (admin only, OTP required)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { role, allowedEmail, otp, expiresInDays = 7, sendEmail = true } = await req.json();

    if (!role || !allowedEmail || !otp) {
      return NextResponse.json(
        { error: 'Role, email, and OTP are required' },
        { status: 400 }
      );
    }

    if (!['subadmin', 'artist', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    await connectDB();

    // Verify OTP
    const admin = await User.findById(session.user.id);
    if (!admin || admin.inviteOtp !== otp || !admin.inviteOtpExpiry || admin.inviteOtpExpiry < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Clear OTP after use
    admin.inviteOtp = undefined;
    admin.inviteOtpExpiry = undefined;
    await admin.save();

    // Check if there's an existing unused invite for this email
    const existingInvite = await InviteCode.findOne({
      allowedEmail: allowedEmail.toLowerCase(),
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: 'An active invite already exists for this email' },
        { status: 409 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const invite = await InviteCode.create({
      code,
      role,
      allowedEmail: allowedEmail.toLowerCase(),
      expiresAt,
      createdBy: session.user.id,
    });

    // Send invite email
    if (sendEmail) {
      await sendInviteEmail(allowedEmail, code, role, admin?.name || 'Admin');
    }

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    console.error('Invite creation error:', error);
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}

// DELETE /api/invite?id=xxx - Revoke invite (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await connectDB();
  await InviteCode.findByIdAndDelete(id);

  return NextResponse.json({ message: 'Invite revoked' });
}
