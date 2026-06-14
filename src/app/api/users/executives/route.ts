import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'subadmin' && session.user.role !== 'sales_executive')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const executives = await User.find({ 
      role: { $in: ['admin', 'subadmin'] },
      isActive: true 
    })
    .select('name role')
    .sort({ name: 1 })
    .lean();
    
    return NextResponse.json(executives);
  } catch (error) {
    console.error('Failed to fetch executives:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
