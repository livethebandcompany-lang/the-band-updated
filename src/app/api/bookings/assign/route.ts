import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, artistId, artistIds, artistPayments } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    await connectDB();

    const updateData: any = {};
    const unsetData: any = {};

    if (artistIds && Array.isArray(artistIds)) {
      if (artistIds.length > 0) {
        updateData.artistIds = artistIds;
        updateData.artistId = artistIds[0];
      } else {
        unsetData.artistIds = "";
        unsetData.artistId = "";
      }
    }

    if (artistPayments && Array.isArray(artistPayments)) {
      if (artistPayments.length > 0) {
        updateData.artistPayments = artistPayments;
      } else {
        unsetData.artistPayments = "";
      }
    }

    const finalUpdate: any = {};
    if (Object.keys(updateData).length > 0) finalUpdate.$set = updateData;
    if (Object.keys(unsetData).length > 0) finalUpdate.$unset = unsetData;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      finalUpdate,
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Artist assigned successfully' });
  } catch (error) {
    console.error('Assign artist error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
