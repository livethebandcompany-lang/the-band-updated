import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// GET /api/users (admin only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectDB();
  const users = await User.find().select('-password -resetOtp -resetOtpExpiry').sort({ createdAt: -1 }).lean();
  return NextResponse.json(users);
}

// PATCH /api/users (admin: update role or status)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, role, isActive } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent self-demotion
    if (userId === session.user.id && role && role !== 'admin') {
      return NextResponse.json(
        { error: 'You cannot change your own role' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (role) updates.role = role;
    if (typeof isActive === 'boolean') updates.isActive = isActive;

    await connectDB();
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select(
      '-password'
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/users/:id (admin only)
export async function DELETE(req: NextRequest) {
    // Note: The structure provided didn't have a specific delete route for users in the file name, 
    // but usually it's good to have. 
    // For now I'll stick to the requested structure which uses PATCH for status (isActive).
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
