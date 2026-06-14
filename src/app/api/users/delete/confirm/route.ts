import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId, otp } = await req.json();

    if (!targetUserId || !otp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Verify OTP against the ADMIN
    const admin = await User.findById(session.user.id).select('+deleteOtp +deleteOtpExpiry');

    if (!admin || admin.deleteOtp !== otp || (admin.deleteOtpExpiry && admin.deleteOtpExpiry < new Date())) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Clear OTP
    await User.findByIdAndUpdate(session.user.id, {
      $unset: { deleteOtp: 1, deleteOtpExpiry: 1 }
    });

    // Perform deletion
    const deletedUser = await User.findByIdAndDelete(targetUserId);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User already deleted or not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete confirm error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
