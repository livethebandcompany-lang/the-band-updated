import Booking from '@/models/Booking';
import User from '@/models/User';
import Notification from '@/models/Notification';
import {
  sendPaidBookingInvoiceEmail,
  sendPaidBookingAdminNotificationEmail,
  sendArtistNewGigEmail,
  sendSubadminNotificationEmail,
  sendFulfillmentAdminEmail,
  sendBroadcastNewGigEmail
} from '@/lib/mailer';
import connectDB from '@/lib/db';
import { generateInvoicePdf } from '@/lib/invoice-generator';

async function generateInvoiceNumber(): Promise<string> {
  const latestBooking = await Booking.findOne({ invoiceNumber: { $exists: true } })
    .sort({ invoiceNumber: -1 })
    .lean();

  if (!latestBooking || !latestBooking.invoiceNumber) {
    return 'TBC-1001';
  }

  const lastNum = parseInt(latestBooking.invoiceNumber.split('-')[1]);
  return `TBC-${(lastNum + 1).toString()}`;
}

export async function handleBookingConfirmation(bookingId: string, razorpayPaymentId?: string) {
  try {
    await connectDB();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error(`Booking Service: Booking ${bookingId} not found`);
      return;
    }

    // 1. Mark as Paid/Confirmed and Generate Invoice
    let updatedNeeded = false;
    if (booking.paymentStatus !== 'paid') {
      booking.paymentStatus = 'paid';
      updatedNeeded = true;
    }
    if (booking.status !== 'confirmed') {
      booking.status = 'confirmed';
      updatedNeeded = true;
    }
    if (booking.expiresAt) {
      booking.expiresAt = undefined;
      updatedNeeded = true;
    }

    if (!booking.invoiceNumber) {
      booking.invoiceNumber = await generateInvoiceNumber();
      booking.invoiceDate = new Date();
      updatedNeeded = true;
    }

    if (razorpayPaymentId && !booking.razorpayPaymentId) {
      booking.razorpayPaymentId = razorpayPaymentId;
      updatedNeeded = true;
    }

    if (updatedNeeded) {
      // 1.5 Generate and Store PDF Invoice Record
      try {
        const pdfBase64 = await generateInvoicePdf(booking);
        booking.invoicePdf = pdfBase64;
      } catch (pdfErr) {
        console.error('Booking Service: PDF generation failed', pdfErr);
      }
      
      await booking.save();
      console.log(`Booking Service: ${bookingId} confirmed, paid, and invoice record stored`);
    }

    // 2. Send Client Invoice with Attachment
    if (booking.clientEmail) {
      await sendPaidBookingInvoiceEmail(booking.clientEmail, booking.clientName, booking, booking.invoicePdf);
    }

    // 3. Notify Team Members (Email & In-App)
    const activeUsers = await User.find({ isActive: true });

    const notificationPromises = activeUsers.map(async (user) => {
      const role = user.role;

      // Define Title/Message by Role
      let title = '✅ Booking Confirmed';
      let message = `Booking for ${booking.clientName} is now active.`;
      let type: 'payment' | 'booking' | 'event_reminder' = 'booking';
      let link = '/admin/bookings';

      if (role === 'admin') {
        title = '💰 Payment Received';
        message = `${booking.clientName} paid ₹${booking.finalAmount?.toLocaleString()} for ${booking.eventType}.`;
        type = 'payment';
        link = '/admin/database';

        // Email Admin
        await sendPaidBookingAdminNotificationEmail(booking, user.email);
      } else if (role === 'subadmin') {
        title = '🛡️Booking Secured';
        message = `New confirmed booking: ${booking.clientName} - ${booking.eventType}.`;
        link = '/admin/bookings';

        // Email Subadmin
        await sendSubadminNotificationEmail(user.email, user.name, booking);
      } else if (role === 'artist') {
        title = '🎸 New Gig Confirmed';
        // Get admin/creator name for attribution
        const createdByUser = activeUsers.find(u => u._id.toString() === booking.createdBy?.toString());
        const adminName = createdByUser?.name || 'Admin';
        // If assigned to this artist
        if (booking.artistId?.toString() === user._id.toString()) {
          message = `New booking: ${booking.eventType} at ${booking.venueName}, ${booking.city} on ${new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at ${booking.startTime}. Assigned by ${adminName}.`;
          await sendArtistNewGigEmail(user.email, user.name, booking);
        } else {
          message = `New gig confirmed in ${booking.city} on ${new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}. Posted by ${adminName}.`;
          await sendBroadcastNewGigEmail(user.email, booking);
        }
        link = '/admin/calendar';
      } else if (role === 'sales_executive') {
        title = '📈 Sale Closed';
        message = `Your lead ${booking.clientName} has completed the payment.`;
        link = '/admin/bookings';
        // (Optional: Email sales exec if needed)
      }

      // Create Individual Notification
      return Notification.create({
        title,
        message,
        type,
        recipientId: user._id,
        recipientRole: role,
        link,
      });
    });

    await Promise.all(notificationPromises);
    console.log(`Booking Service: Notifications and emails dispatched for booking ${bookingId}`);

  } catch (error) {
    console.error('Booking Service Error:', error);
    throw error;
  }
}

export async function handleBookingCompletion(bookingId: string) {
  try {
    await connectDB();
    const booking = await Booking.findById(bookingId).lean();
    if (!booking || booking.status !== 'completed') {
      console.error(`Booking Service: Completion event failed for ${bookingId}`);
      return;
    }

    // Notify all Admins and Sub-admins
    const staff = await User.find({ role: { $in: ['admin', 'subadmin'] }, isActive: true });

    await Promise.all(staff.map(async (user) => {
      // In-app Notification
      await Notification.create({
        title: '🎭 Performance Fulfilled',
        message: `${booking.clientName}'s show at ${booking.venueName} was marked DONE by the artist.`,
        type: 'booking',
        recipientId: user._id,
        recipientRole: user.role,
        link: '/admin/database',
      });

      // Email Notification (Implement if mailer supports it)
      // await sendFulfillmentAdminEmail(user.email, user.name, booking);
    }));

    console.log(`Booking Service: Fulfillment alerts sent for ${bookingId}`);

  } catch (error) {
    console.error('Booking Service Error (Completion):', error);
  }
}
