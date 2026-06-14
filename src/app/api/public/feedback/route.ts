import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, rating, feedback } = await req.json();

    if (!bookingId || rating === undefined) {
      return NextResponse.json({ error: 'bookingId and rating are required' }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }

    await connectDB();

    // 1. Update Booking with the new rating
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only update if not already rated, or overwrite if allowed. Assuming overwrite is allowed here.
    booking.clientSatisfactionRating = numericRating;
    if (feedback) {
      booking.clientFeedback = feedback;
    }
    await booking.save();

    // 2. Recalculate Artist Performance Rating
    // Identify artists involved in this booking
    const artistsToUpdate: string[] = [];
    if (booking.artistId) artistsToUpdate.push(booking.artistId.toString());
    if (booking.artistIds && booking.artistIds.length > 0) {
      booking.artistIds.forEach((id: any) => {
        if (!artistsToUpdate.includes(id.toString())) {
          artistsToUpdate.push(id.toString());
        }
      });
    }

    for (const artistId of artistsToUpdate) {
      // Find all bookings for this artist that have a rating
      const artistBookings = await Booking.find({
        $or: [{ artistId }, { artistIds: artistId }],
        clientSatisfactionRating: { $exists: true, $ne: null }
      });

      if (artistBookings.length > 0) {
        const totalRating = artistBookings.reduce((sum, b) => sum + (b.clientSatisfactionRating || 0), 0);
        const averageRating = (totalRating / artistBookings.length).toFixed(1);

        // Update the Artist's profile
        await User.findByIdAndUpdate(artistId, {
          performanceRating: Number(averageRating)
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Feedback recorded and artist ratings updated.' });
  } catch (error: any) {
    console.error('Error processing feedback:', error);
    return NextResponse.json({ error: 'Failed to process feedback' }, { status: 500 });
  }
}
