import { generateInvoicePdf } from './src/lib/invoice-generator';
import fs from 'fs';

async function run() {
  try {
    const fakeBooking = {
      invoiceNumber: 'TBC-9999',
      invoiceDate: new Date(),
      eventDate: new Date(),
      eventType: 'Wedding',
      city: 'Delhi',
      quotedAmount: 15000,
      discountAmount: 1000,
      additionalChargesAmount: 2000,
      taxAmount: 2880,
      totalAmount: 18880,
      durationMinutes: 120,
      performanceType: 'duet',
      billingName: 'Test Client',
      clientPhone: '9876543210',
      clientEmail: 'test@example.com',
      additionalChargesItems: 'Travel, Accommodation',
      paymentMode: 'cash'
    };
    
    console.log('Generating PDF...');
    const pdfBase64 = await generateInvoicePdf(fakeBooking);
    console.log('PDF generated, saving to test.pdf');
    fs.writeFileSync('test.pdf', Buffer.from(pdfBase64, 'base64'));
    console.log('Done! test.pdf created in root folder.');
  } catch (e) {
    console.error(e);
  }
}

run();
