import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'subadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    await connectDB();
    
    // Fetch all inquiries sorted by newest first
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
