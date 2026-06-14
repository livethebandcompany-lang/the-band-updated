import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Razorpay from 'razorpay';
import { handleBookingConfirmation } from '@/lib/booking-service';
import Notification from '@/models/Notification';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    await connectDB();
    const booking = await Booking.findById(id).select(
      'paymentStatus status razorpayLinkId clientName finalAmount'
    );

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Proactively check Razorpay if not paid (especially useful for local dev without webhooks)
    if (booking.paymentStatus !== 'paid' && booking.razorpayLinkId) {
      try {
        const link = await razorpay.paymentLink.fetch(booking.razorpayLinkId);
        if (link.status === 'paid' || link.status === 'partially_paid') {
          // Update database
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
          booking.expiresAt = undefined;
          
          // Attempt to extract order id or any ID present on the link 
          if ((link as any).order_id) booking.razorpayOrderId = (link as any).order_id;
          
          await booking.save();
          console.log(`Booking ${booking._id} marked as paid via active polling loop`);

          // Try to get payment ID from the link if possible
          const pollPaymentId = (link as any).payment_id; // Sometimes present in certain versions/responses
          
          // Centralized Confirmation Processing (Emails, Notifications for all roles)
          await handleBookingConfirmation(booking._id.toString(), pollPaymentId);
        }
      } catch (razorpayError) {
        console.error('Failed to fetch from Razorpay directly:', razorpayError);
      }
    }

    return NextResponse.json({
      paymentStatus: booking.paymentStatus,
      status: booking.status,
      razorpayLinkId: booking.razorpayLinkId || null,
      clientName: booking.clientName,
      finalAmount: booking.finalAmount,
    });
  } catch (error: any) {
    console.error('Payment status poll error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
