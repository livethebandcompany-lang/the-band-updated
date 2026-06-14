import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { sendAdminNotificationEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'subadmin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Required fields validation
    const isPending = data.status === 'pending';
    const requiredFields = isPending 
      ? ['clientName', 'clientPhone']
      : [
          'clientName', 'clientPhone', 'eventType', 'performanceType', 
          'eventDate', 'startTime', 'endTime', 'venueName', 'city', 
          'quotedAmount', 'finalAmount', 'source', 'salesPerson', 'billingName'
        ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    await connectDB();

    const newBooking = await Booking.create({
      ...data,
      createdBy: session.user.id,
    });

    // Notify Admin
    await sendAdminNotificationEmail(newBooking);

    return NextResponse.json(newBooking, { status: 201 });

  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const query: any = {};
    if (session.user.role === 'artist') {
      query.artistId = session.user.id;
    }

    // If ?all=true is passed, bypass this to allow Calendar or Master views to fetch everything.
    const url = new URL(req.url);
    if (url.searchParams.get('all') !== 'true') {
      // Admins & Subadmins: Filter out paid AND completed (Archive)
      if (session.user.role !== 'artist') {
        query.paymentStatus = { $ne: 'paid' };
        query.status = { $ne: 'completed' };
      } 
      // Artists: Only see their active (non-completed) shows
      else {
        query.status = { $ne: 'completed' };
      }
    }

    const bookings = await Booking.find(query)
      .populate('artistId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
