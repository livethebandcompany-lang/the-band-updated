import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Razorpay from 'razorpay';
import { sendPaymentLinkEmail } from '@/lib/mailer';

// Initializing Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'subadmin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'Booking is already paid' }, { status: 400 });
    }

    // 1. Create Razorpay Payment Link
    const amountInPaisa = Math.round(booking.totalAmount * 100);
    const paymentLink = await razorpay.paymentLink.create({
      amount: amountInPaisa,
      currency: 'INR',
      accept_partial: false,
      description: `Payment for ${booking.eventType} booking on ${new Date(booking.eventDate).toLocaleDateString('en-IN')} — ${booking.billingName}`,
      customer: {
        name: booking.billingName || booking.clientName,
        email: booking.clientEmail || '',
        contact: booking.clientPhone.startsWith('+')
          ? booking.clientPhone
          : `+91${booking.clientPhone}`,
      },
      notify: {
        sms: true,   // Razorpay sends SMS natively (Option A)
        email: false, // We send email ourselves for branded template
      },
      reminder_enable: true,
      notes: {
        bookingId: booking._id.toString(),
      },
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/invoice/${booking._id.toString()}`,
      callback_method: 'get',
    });

    // 2. Update Booking with Link info
    booking.razorpayLinkId = paymentLink.id;
    await booking.save();

    // 3. Send branded Email Notification via our mailer (Hostinger SMTP)
    if (booking.clientEmail) {
      await sendPaymentLinkEmail(
        booking.clientEmail,
        booking.billingName || booking.clientName,
        booking.eventType,
        booking.totalAmount,
        paymentLink.short_url
      );
    }

    return NextResponse.json({
      success: true,
      paymentLink: paymentLink.short_url,
      paymentLinkId: paymentLink.id,
      message: 'Payment link generated and sent via SMS & email successfully',
    });

  } catch (error: any) {
    console.error('Payment Link generation error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to generate payment link',
    }, { status: 500 });
  }
}
