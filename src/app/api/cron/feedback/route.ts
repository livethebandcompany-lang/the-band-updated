import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(req: NextRequest) {
  try {
    // Basic security for cron job if not using Vercel's built-in secure header
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const now = new Date();
    
    // 1. Send Initial Feedback Request
    // For events completed in the past, where feedback hasn't been sent yet.
    // Assuming completion means 'completed' status or eventDate < now
    const initialFeedbackTargets = await Booking.find({
      status: 'completed',
      clientSatisfactionRating: { $exists: false },
      feedbackSentAt: { $exists: false },
      archived: false
    });

    let initialSentCount = 0;
    for (const booking of initialFeedbackTargets) {
      // Integration point for WhatsApp (e.g. Twilio API, Interakt) and Email (e.g. Resend, Sendgrid)
      console.log(`[CRON] Sending WhatsApp & Email feedback request to ${booking.clientPhone} and ${booking.clientEmail || 'no-email'} for booking ${booking._id}`);
      
      // Mark as sent
      booking.feedbackSentAt = now;
      await booking.save();
      initialSentCount++;
    }

    // 2. Send Reminder Feedback Request
    // For events where feedback was sent at least 24 hours ago, still no rating, and no reminder sent yet.
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const reminderFeedbackTargets = await Booking.find({
      status: 'completed',
      clientSatisfactionRating: { $exists: false },
      feedbackSentAt: { $lte: oneDayAgo },
      feedbackReminderSentAt: { $exists: false },
      archived: false
    });

    let reminderSentCount = 0;
    for (const booking of reminderFeedbackTargets) {
      // Integration point for sending the WhatsApp and Email reminder
      console.log(`[CRON] Sending WhatsApp & Email feedback REMINDER to ${booking.clientPhone} and ${booking.clientEmail || 'no-email'} for booking ${booking._id}`);
      
      // Mark reminder as sent
      booking.feedbackReminderSentAt = now;
      await booking.save();
      reminderSentCount++;
    }

    return NextResponse.json({
      success: true,
      initialRequestsSent: initialSentCount,
      remindersSent: reminderSentCount
    });
  } catch (error: any) {
    console.error('Error in feedback cron:', error);
    return NextResponse.json({ error: 'Failed to process feedback cron' }, { status: 500 });
  }
}
