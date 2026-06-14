import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { handleBookingCompletion } from '@/lib/booking-service';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'artist') {
      return NextResponse.json({ error: 'Unauthorized: Artist role required' }, { status: 403 });
    }

    const { id } = await context.params;
    const { actualEndTime, teamMembers } = await req.json();

    if (!actualEndTime || !teamMembers || !Array.isArray(teamMembers)) {
      return NextResponse.json({ error: 'Missing completion details' }, { status: 400 });
    }

    await connectDB();

    const booking = await Booking.findOne({ _id: id, artistId: session.user.id });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found or not assigned to you' }, { status: 404 });
    }

    if (booking.status === 'completed') {
      return NextResponse.json({ error: 'Performance already logged as completed' }, { status: 400 });
    }

    // Update booking with completion report
    booking.status = 'completed' as any;
    booking.completionReport = {
      actualEndTime,
      teamMembers,
      completedAt: new Date()
    };

    await booking.save();

    console.log(`Artist ${session.user.name} completed show ${id}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Performance officially logged in database' 
    });

  } catch (error: any) {
    console.error('Show completion error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
