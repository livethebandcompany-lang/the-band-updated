import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    await connectDB();

    // Build a regex for case-insensitive partial match
    const regex = new RegExp(q, 'i');

    // Query bookings — search across name, phone, email, city, eventType, invoiceNumber
    const bookings = await Booking.find({
      $or: [
        { clientName: regex },
        { clientPhone: regex },
        { clientEmail: regex },
        { city: regex },
        { eventType: regex },
        { invoiceNumber: regex },
        { venueName: regex },
        { salesPerson: regex },
      ],
    })
      .select('_id clientName clientPhone clientEmail eventType city eventDate invoiceNumber paymentStatus totalAmount')
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    const results: any[] = [];

    bookings.forEach((booking: any) => {
      const eventDateStr = booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '';

      // Add as a Booking result
      results.push({
        id: booking._id.toString(),
        type: 'booking',
        title: booking.clientName,
        subtitle: `${booking.eventType} • ${booking.city}${eventDateStr ? ' • ' + eventDateStr : ''}`,
        meta: booking.totalAmount ? `₹${Number(booking.totalAmount).toLocaleString('en-IN')}` : '',
        href: `/admin/bookings`,
      });

      // If it has an invoice number, add as Invoice result too
      if (booking.invoiceNumber) {
        results.push({
          id: `inv-${booking._id.toString()}`,
          type: 'invoice',
          title: booking.invoiceNumber,
          subtitle: `${booking.clientName} • ${booking.eventType}`,
          meta: booking.paymentStatus === 'paid' ? 'Paid' : 'Unpaid',
          href: `/admin/invoice/${booking._id.toString()}`,
        });
      }

      // Deduplicate: Add as Client result (unique by phone)
    });

    // Deduplicate clients by phone
    const seenPhones = new Set<string>();
    const clientResults: any[] = [];
    bookings.forEach((booking: any) => {
      if (!seenPhones.has(booking.clientPhone)) {
        seenPhones.add(booking.clientPhone);
        clientResults.push({
          id: `client-${booking._id.toString()}`,
          type: 'client',
          title: booking.clientName,
          subtitle: booking.clientPhone + (booking.clientEmail ? ` • ${booking.clientEmail}` : ''),
          meta: booking.city,
          href: `/admin/database`,  // Client database page
        });
      }
    });

    // Merge: bookings first, then invoices, then clients — cap total
    const allResults = [...results, ...clientResults].slice(0, 20);

    return NextResponse.json({ results: allResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [] });
  }
}
