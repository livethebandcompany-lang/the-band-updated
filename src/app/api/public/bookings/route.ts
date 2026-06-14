import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import Inquiry from '@/models/Inquiry';
import Notification from '@/models/Notification';
import { sendAdminNotificationEmail, sendCustomerAutoReplyEmail } from '@/lib/mailer';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Identify standard admin to attribute system ownership of the lead
    const admin = await User.findOne({ role: 'admin' }).select('_id').lean();
    
    if (!admin) {
        return NextResponse.json({ error: 'System architecture malformed: No Admin Identity found to attach the lead.' }, { status: 500 });
    }

    const newBooking = await Booking.create({
      clientName: data.name,
      clientPhone: data.mobile,
      clientEmail: data.email,
      billingName: data.name,
      
      eventType: data.eventType || 'private_party',
      performanceType: data.performanceType || 'solo',
      
      eventDate: data.date ? new Date(data.date) : new Date(Date.now() + 86400000), // Default to tomorrow if empty
      startTime: '19:00',
      endTime: '22:00',
      durationMinutes: 180,
      
      venueName: data.venueName || 'Location Not Specified',
      city: data.destination || 'City Not Specified',
      
      quotedAmount: 0,
      finalAmount: 0,
      totalAmount: 0,
      
      paymentStatus: 'not_paid',
      status: 'pending',
      source: 'google',
      salesPerson: 'Web Form Lead',
      notes: `Service Inquiry: ${data.selectedPackage || "General"}\n\nClient Note: ${data.message || "None provided"}`,
      createdBy: admin._id,
    });

    // Also save as an Inquiry in the database to show up in the Enquiries admin panel
    try {
      await Inquiry.create({
        name: data.name || 'Guest',
        email: data.email || 'no-email@thebandcompany.in',
        mobile: data.mobile,
        destination: data.destination || '',
        date: data.date || '',
        message: `Package/Builder: ${data.selectedPackage || "General"}\n\nClient Note: ${data.message || "None provided"}`,
        type: data.selectedPackage || 'Custom Band Builder',
        status: 'new'
      });
      
      // Create admin in-app notification
      await Notification.create({
        title: 'New Inquiry Received',
        message: `${data.name || 'Guest'} submitted a ${data.selectedPackage || 'Custom Band Builder'} from ${data.destination || 'an unknown location'}.`,
        type: 'inquiry',
        link: '/admin/enquiries',
      });
    } catch (inquiryErr) {
      console.error('Failed to save inquiry to database or create notification:', inquiryErr);
    }

    try {
      await sendAdminNotificationEmail(newBooking);
    } catch (emailErr) {
      console.error('Failed to dispatch notification to admin for the new public lead:', emailErr);
    }

    if (data.email && data.email.trim() !== '' && !data.email.includes('whatsapp-inquiry')) {
      try {
        await sendCustomerAutoReplyEmail(
          data.email,
          data.name || 'Guest',
          data.destination || '',
          data.date || '',
          data.selectedPackage
        );
      } catch (custEmailErr) {
        console.error('Failed to dispatch auto-reply to customer:', custEmailErr);
      }
    }

    try {
      const forwardedFor = req.headers.get('x-forwarded-for') || '';
      const clientIp = forwardedFor.split(',')[0] || '';
      
      await sendMetaCapiEvent({
        eventName: 'Lead',
        eventSourceUrl: req.headers.get('referer') || req.url,
        userEmail: data.email || null,
        userPhone: data.mobile || null,
        clientIp: clientIp,
        userAgent: req.headers.get('user-agent') || '',
      });
    } catch (capiErr) {
      console.error('Failed to send Meta CAPI Lead Event:', capiErr);
    }

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.error('Public booking ingestion error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
