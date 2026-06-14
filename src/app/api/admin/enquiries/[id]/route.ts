import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'subadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing Inquiry ID' }, { status: 400 });

    const updates = await request.json();

    await connectDB();
    
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedInquiry) {
        return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ inquiry: updatedInquiry }, { status: 200 });
  } catch (error) {
    console.error('Failed to update inquiry:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Super Admin privileges required for record deletion.' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing Inquiry ID' }, { status: 400 });

    await connectDB();
    
    const deletedInquiry = await Inquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
        return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
