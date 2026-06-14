import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { generateInvoicePdf } from '@/lib/invoice-generator';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const booking = await Booking.findById(id).lean();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Force recompile 
    console.log(`Generating fresh PDF for invoice download ${id}`);
    const base64Pdf = await generateInvoicePdf(booking);
    const pdfBuffer = Buffer.from(base64Pdf, 'base64');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice_${booking.invoiceNumber || 'TBC'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Invoice PDF download error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
