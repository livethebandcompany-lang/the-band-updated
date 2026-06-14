import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { handleBookingConfirmation } from '@/lib/booking-service';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error('Webhook signature or secret missing');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Webhook signature mismatch');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`Razorpay Webhook Event: ${event}`);

    // 2. Handle Payment Link Paid Event
    if (event === 'payment_link.paid') {
      const paymentLink = payload.payload.payment_link.entity;
      const razorpayLinkId = paymentLink.id;
      const bookingId = paymentLink.notes?.bookingId;

      if (razorpayLinkId) {
        await connectDB();
        
        let booking;
        if (bookingId) {
          booking = await Booking.findById(bookingId);
        } else {
          // Fallback to searching by link ID
          booking = await Booking.findOne({ razorpayLinkId });
        }

        if (booking) {
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
          booking.expiresAt = undefined; // Clear TTL on payment

          const paymentId = payload.payload.payment?.entity?.id;

          await booking.save();
          console.log(`Booking ${booking._id} marked as paid via webhook. Payment ID: ${paymentId}`);

          // Centralized Confirmation Processing (Emails, Notifications for all roles)
          await handleBookingConfirmation(booking._id.toString(), paymentId);
        } else {
          console.warn(`Booking not found for Razorpay Link ID: ${razorpayLinkId}`);
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
