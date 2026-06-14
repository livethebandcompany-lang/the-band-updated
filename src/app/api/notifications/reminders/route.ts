import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import Notification from '@/models/Notification';

// POST /api/notifications/reminders
// Should be called by a cron job (e.g. daily at 9 AM)
// Creates event reminders for bookings happening within the next 24 hours
export async function POST(req: Request) {
  try {
    // Validate cron secret if provided
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Find confirmed bookings happening in the next 24-48h window (to avoid duplicates from 24h re-runs)
    const upcomingBookings = await Booking.find({
      status: 'confirmed',
      archived: false,
      eventDate: { $gte: in24h, $lte: in48h },
    }).populate('createdBy', 'name role').lean();

    if (upcomingBookings.length === 0) {
      return NextResponse.json({ message: 'No upcoming events in 24-48h window', count: 0 });
    }

    const allUsers = await User.find({ isActive: true }).lean();
    const adminAndSubadmin = allUsers.filter(u => u.role === 'admin' || u.role === 'subadmin');
    const artists = allUsers.filter(u => u.role === 'artist');

    let notifCount = 0;

    for (const booking of upcomingBookings) {
      const eventDateStr = new Date(booking.eventDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      const createdByName = (booking.createdBy as any)?.name || 'Admin';

      // 1. Admin + Subadmin: event reminder
      for (const user of adminAndSubadmin) {
        await Notification.create({
          title: '📅 Event Tomorrow',
          message: `Reminder: ${booking.clientName}'s ${booking.eventType} at ${booking.venueName}, ${booking.city} is scheduled for ${eventDateStr}.`,
          type: 'event_reminder',
          recipientId: user._id,
          recipientRole: user.role,
          isRead: false,
          link: '/admin/bookings',
        });
        notifCount++;
      }

      // 2. Artist assigned to this booking
      if (booking.artistId) {
        await Notification.create({
          title: '🎸 Gig Tomorrow!',
          message: `You have a performance tomorrow: ${booking.eventType} at ${booking.venueName}, ${booking.city} at ${booking.startTime}. Assigned by ${createdByName}.`,
          type: 'event_reminder',
          recipientId: booking.artistId,
          recipientRole: 'artist',
          isRead: false,
          link: '/admin/calendar',
        });
        notifCount++;
      }
    }

    return NextResponse.json({
      message: `Reminder notifications created`,
      count: notifCount,
      bookings: upcomingBookings.length,
    });
  } catch (error) {
    console.error('[Notifications Reminders]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
