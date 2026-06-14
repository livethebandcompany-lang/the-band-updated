import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';

/**
 * ARCHIVE CRON JOB
 * Moves bookings to 'archived: true' if the event date is in the past.
 * This should be triggered daily (e.g., via GitHub Actions or Vercel Cron).
 */
export async function GET(req: Request) {
  try {
    // Basic auth check if needed (e.g., via CRON_SECRET)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update all confirmed/completed bookings whose date has passed
    const result = await Booking.updateMany(
      { 
        eventDate: { $lt: today }, 
        archived: false,
        status: { $in: ['confirmed', 'completed'] } 
      },
      { $set: { archived: true } }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Archived ${result.modifiedCount} historical records successfully.`,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('CRON Archive Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
