import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Booking from '@/models/Booking';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'subadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Fetch artists
    const artists = await User.find({ role: 'artist' })
      .select('-password -deleteOtp -inviteOtp -resetOtp') // Exclude sensitive fields
      .lean()
      .sort({ name: 1 });

    // Fetch their assigned events (both active and past)
    const bookings = await Booking.find({ 
      $or: [
        { artistId: { $in: artists.map(a => a._id) } },
        { artistIds: { $in: artists.map(a => a._id) } }
      ]
    }).select('_id clientName eventType status eventDate artistId artistIds').lean();

    // Attach events to artists
    const artistsWithEvents = artists.map((artist: any) => {
      const assignedEvents = bookings.filter(b => 
        b.artistId?.toString() === artist._id.toString() || 
        b.artistIds?.some((id: any) => id.toString() === artist._id.toString())
      ).map(b => ({
        _id: b._id,
        clientName: b.clientName,
        eventType: b.eventType,
        status: b.status,
        eventDate: b.eventDate
      }));
      return { ...artist, assignedEvents };
    });

    return NextResponse.json(artistsWithEvents);
  } catch (error: any) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'subadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const { id, genreStrengths, baseFee, availabilityStatus, performanceRating, adharCardNumber, jobType } = data;

    if (!id) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (genreStrengths !== undefined) updateData.genreStrengths = genreStrengths;
    if (baseFee !== undefined) updateData.baseFee = baseFee;
    if (availabilityStatus !== undefined) updateData.availabilityStatus = availabilityStatus;
    if (performanceRating !== undefined) updateData.performanceRating = performanceRating;
    if (adharCardNumber !== undefined) updateData.adharCardNumber = adharCardNumber;
    if (jobType !== undefined) updateData.jobType = jobType;

    const updatedArtist = await User.findOneAndUpdate(
      { _id: id, role: 'artist' },
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedArtist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json(updatedArtist);
  } catch (error: any) {
    console.error('Error updating artist:', error);
    return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 });
  }
}
