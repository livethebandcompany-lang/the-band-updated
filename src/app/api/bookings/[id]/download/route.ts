import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { generateInvoicePdf } from '@/lib/invoice-generator';

export async function GET(
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

    if (!booking.invoiceNumber) {
      return NextResponse.json({ 
        error: 'Invoice cannot be generated for unconfirmed bookings.' 
      }, { status: 400 });
    }

    // Force recompile to clear outdated memory cache
    console.log(`Generating fresh PDF for booking ${id}`);
    const pdfBase64 = await generateInvoicePdf(booking);

    // Store it back to save future generation
    booking.invoicePdf = pdfBase64;
    await booking.save();

    // Convert base64 to Uint8Array for better serverless compatibility
    const binaryString = atob(pdfBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Invoice_${booking.invoiceNumber || 'TBC'}.pdf`,
      },
    });

  } catch (error: any) {
    console.error('[Booking Download Error]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
