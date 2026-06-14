import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { generateInvoicePdf } from '@/lib/invoice-generator';
import { sendPaidBookingInvoiceEmail } from '@/lib/mailer';

async function generateInvoiceNumber(): Promise<string> {
  const latestBooking = await Booking.findOne({ invoiceNumber: { $exists: true, $ne: null } })
    .sort({ createdAt: -1 })
    .lean();

  if (!latestBooking || !latestBooking.invoiceNumber) {
    return 'TBC-1001';
  }

  const parts = latestBooking.invoiceNumber.split('-');
  const lastNum = parseInt(parts[1] || '1000');
  return `TBC-${(lastNum + 1).toString()}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'subadmin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Auto-generate invoice number if this booking doesn't have one yet
    if (!booking.invoiceNumber) {
      booking.invoiceNumber = await generateInvoiceNumber();
      booking.invoiceDate   = new Date();
      // Ensure status is confirmed when generating invoice
      if (booking.status === 'pending') booking.status = 'confirmed';
      if (booking.paymentStatus === 'not_paid') booking.paymentStatus = 'paid';
      await booking.save();
    }

    // Always generate a fresh PDF with the latest design (forces recompile cache clear)
    console.log(`[Resend Invoice] Generating fresh PDF for booking ${id}`);
    const pdfBase64 = await generateInvoicePdf(booking.toObject());
    booking.invoicePdf = pdfBase64;
    await booking.save();

    if (!booking.clientEmail) {
      return NextResponse.json({ 
        success: true,
        message: `Invoice generated (${booking.invoiceNumber}) but no client email on file — PDF not sent.`,
        invoiceNumber: booking.invoiceNumber,
      });
    }

    await sendPaidBookingInvoiceEmail(
      booking.clientEmail,
      booking.clientName || booking.billingName || 'Client',
      booking.toObject(),
      pdfBase64
    );

    return NextResponse.json({ 
      success: true, 
      message: `Invoice ${booking.invoiceNumber} sent to ${booking.clientEmail}`,
      invoiceNumber: booking.invoiceNumber,
    });

  } catch (error: any) {
    console.error('[Resend Invoice Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
