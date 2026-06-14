import { jsPDF } from 'jspdf';

const LOGO_URL = 'https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png';
const QR_URL   = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://wa.me/917779945379';

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/png';
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
}

export async function generateInvoicePdf(booking: any): Promise<string> {
  const doc = new jsPDF('p', 'mm', 'a4') as any;

  // Fetch logo + QR in parallel
  const [logoBase64, qrBase64] = await Promise.all([
    fetchImageAsBase64(LOGO_URL),
    fetchImageAsBase64(QR_URL),
  ]);

  // ── Data Prep ──────────────────────────────────────────────────────────────
  const invoiceDate = booking.invoiceDate
    ? new Date(booking.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const eventDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'TBD';

  const performanceFee = booking.quotedAmount || 0;
  const discount       = booking.discountAmount || 0;
  const additional     = booking.additionalChargesAmount || 0;
  const subtotal       = performanceFee - discount + additional;
  const tax            = booking.taxAmount || 0;
  const total          = booking.totalAmount || 0;

  const durationHours = booking.durationMinutes
    ? (booking.durationMinutes / 60).toFixed(1).replace(/\.0$/, '')
    : '2.5';

  const bandTypeMap: Record<string, string> = {
    solo: 'Solo Artist', duet: 'Duet', trio: 'Trio',
    '4piece': '4-Piece Band', full_band: 'Full Band',
  };
  const bandTypeLabel = booking.performanceType
    ? (bandTypeMap[booking.performanceType] || booking.performanceType)
    : 'Band';

  const clientName = booking.billingName || booking.clientName || 'Client';

  // ── Color Palette ───────────────────────────────────────────────────────────
  type RGB = [number, number, number];
  const BLACK: RGB = [13, 13, 13];
  const TRUE_BLACK: RGB = [0, 0, 0];
  const GOLD: RGB = [197, 160, 89];
  const CREAM: RGB = [245, 240, 232];
  const WHITE: RGB = [255, 255, 255];
  const GRAY_TEXT: RGB = [180, 180, 180];
  const DARK_TEXT: RGB = [17, 17, 17];

  // ── Dimensions ──────────────────────────────────────────────────────────────
  const W = 210;
  const H = 297;
  const MARGIN = 12;
  const INDENT = MARGIN + 8; // 20

  // 1. Draw solid black base
  doc.setFillColor(...BLACK);
  doc.rect(0, 0, W, H, 'F');

  // 2. Draw gold frame
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.rect(5, 5, W - 10, H - 10, 'S');

  // ── Header (Black Background) ───────────────────────────────────────────────
  
  // Left Side - Logo + Title + Tagline (Centered in left half)
  const leftCenter = 55;
  let hLeftY = 16;
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', leftCenter - 18, hLeftY, 36, 36);
    hLeftY += 42;
  }
  
  doc.setTextColor(...WHITE);
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('THE BAND COMPANY', leftCenter, hLeftY, { align: 'center' });
  
  hLeftY += 6;
  doc.setTextColor(...GOLD);
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.text('Live music Experiences, Curated to Perfection.', leftCenter, hLeftY, { align: 'center' });

  // Right Side - Invoice Details
  const rX = 110;
  let rY = 24;
  const lineGap = 7;

  // Add a faint gold border separating left and right header
  doc.setDrawColor(197, 160, 89, 0.4);
  doc.setLineWidth(0.2);
  doc.line(100, 16, 100, hLeftY + 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GOLD);
  doc.setFontSize(10);
  doc.text('INVOICE NO:', rX, rY);
  
  doc.setTextColor(...WHITE);
  doc.text(String(booking.invoiceNumber || 'TBC-0001'), rX + 28, rY);

  rY += 8;

  const addDetailRow = (lbl: string, val: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY_TEXT);
    doc.setFontSize(9);
    doc.text(lbl, rX, rY);
    
    doc.setTextColor(...WHITE);
    doc.text(val, rX + 24, rY);
    rY += lineGap;
  };

  addDetailRow('Invoice Date:', invoiceDate);
  addDetailRow('Event Date:', eventDate);
  addDetailRow('Event Type:', String(booking.eventType || 'Private Celebration'));
  addDetailRow('Location:', String(booking.city || 'Mumbai'));

  const headerEnd = Math.max(hLeftY, rY) + 12;

  // ── Pre-calculate Cream Section Height ──────────────────────────────────────
  let bY = headerEnd + 14; 
  let sY = bY + 30; // Further down below BILLED TO
  if (booking.clientEmail) sY += 6;

  // Simulation for Service Details Height
  let sY_sim = sY + 8 + 6 + 6 + 4; // Headers and basic text
  if (booking.additionalChargesItems) {
    const items = booking.additionalChargesItems.split(',');
    sY_sim += items.length * 6;
  }

  // Simulation for Payment Breakdown Box Height
  const boxY = headerEnd + 8; // Starts near the top of the cream section
  let numRows = 2; 
  if (discount > 0) numRows++;
  if (additional > 0) numRows++;
  if (tax > 0) numRows++;
  
  let pY_sim = boxY + 22 + (numRows * 7) + 12; // title gap + rows + totals
  if (booking.paymentMode === 'cash') pY_sim += 10;
  const boxH = Math.max(pY_sim - boxY + 8, 85);
  
  const creamEnd = Math.max(sY_sim, boxY + boxH) + 15;

  // ── Draw Cream Section ─────────────────────────────────────────────────────
  doc.setFillColor(...CREAM);
  doc.rect(5, headerEnd, W - 10, creamEnd - headerEnd, 'F');

  // BILLED TO (Left Column)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GOLD);
  doc.setFontSize(11);
  doc.text('BILLED TO', INDENT, bY);

  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(13);
  doc.text(clientName, INDENT + 28, bY);

  bY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(51, 51, 51);
  doc.text(`Phone:  +91 ${booking.clientPhone || ''}`, INDENT, bY);

  if (booking.clientEmail) {
    bY += 7;
    doc.text(`Email:  ${booking.clientEmail}`, INDENT, bY);
  }

  // SERVICE DETAILS (Left Column)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GOLD);
  doc.setFontSize(11);
  doc.text('SERVICE DETAILS', INDENT, sY);

  sY += 8;
  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(12);
  doc.text('Live Music Performance-', INDENT, sY);
  
  sY += 6;
  doc.text(bandTypeLabel, INDENT, sY);

  sY += 7;
  doc.setFontSize(11);
  doc.text(`Duration: ${durationHours} Hours`, INDENT, sY);

  sY += 7;
  const soundLabel = booking.soundIncluded ? 'Sound: Included ✓' : 'Sound: Excluded';
  if (booking.soundIncluded) {
    doc.setTextColor(34, 197, 94); // green
  } else {
    doc.setTextColor(120, 120, 120); // grey
  }
  doc.text(soundLabel, INDENT, sY);
  doc.setTextColor(...DARK_TEXT); // reset

  if (booking.additionalChargesItems) {
    sY += 6;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(85, 85, 85);
    doc.setFontSize(9.5);
    const items = booking.additionalChargesItems.split(',');
    items.forEach((item: string) => {
      doc.text(`• ${item.trim()}`, INDENT, sY);
      sY += 6;
    });
  }

  // ── RIGHT COLUMN (Payment Breakdown Box) ───────────────────────────────────
  const boxX = 100;
  const boxW = 95;
  
  // Outer black box
  doc.setFillColor(...TRUE_BLACK);
  doc.rect(boxX, boxY, boxW, boxH, 'F');

  // Inner corner ornaments
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  const cx = boxX + 4;
  const cy = boxY + 4;
  const cw = boxW - 8;
  const ch = boxH - 8;
  const cl = 5; // corner line length
  
  // Top Left
  doc.line(cx, cy, cx + cl, cy); doc.line(cx, cy, cx, cy + cl);
  // Top Right
  doc.line(cx + cw, cy, cx + cw - cl, cy); doc.line(cx + cw, cy, cx + cw, cy + cl);
  // Bottom Left
  doc.line(cx, cy + ch, cx + cl, cy + ch); doc.line(cx, cy + ch, cx, cy + ch - cl);
  // Bottom Right
  doc.line(cx + cw, cy + ch, cx + cw - cl, cy + ch); doc.line(cx + cw, cy + ch, cx + cw, cy + ch - cl);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.setFontSize(9.5);
  doc.text('PAYMENT BREAKDOWN', boxX + boxW / 2, boxY + 14, { align: 'center', charSpace: 1.2 });

  let pY = boxY + 24;
  const pLx = boxX + 10;
  const pRx = boxX + boxW - 10;

  const addP = (l: string, r: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9.5);
    doc.text(l, pLx, pY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(r, pRx, pY, { align: 'right' });
    pY += 7;
  };

  addP('Performance Fee', `Rs. ${performanceFee.toLocaleString('en-IN')}`);
  if (discount > 0)   addP('Discount Applied', `- Rs. ${discount.toLocaleString('en-IN')}`);
  if (additional > 0) addP('Logistics & Extras', `Rs. ${additional.toLocaleString('en-IN')}`);
  
  // subtotal line
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.2);
  doc.line(pLx, pY - 3, pRx, pY - 3);

  addP('Subtotal', `Rs. ${subtotal.toLocaleString('en-IN')}`);
  if (tax > 0) addP('GST (18%)', `Rs. ${tax.toLocaleString('en-IN')}`);

  // Grand total divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(pLx, pY + 2, pRx, pY + 2);

  pY += 10;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GOLD);
  doc.setFontSize(10.5);
  doc.text('GRAND TOTAL', pLx, pY);
  
  pY += 8;
  doc.setTextColor(...WHITE);
  doc.setFontSize(16);
  // Align left as in UI
  doc.text(`Rs. ${total.toLocaleString('en-IN')}`, pLx, pY);

  if (booking.paymentMode === 'cash') {
    pY += 9;
    doc.setDrawColor(74, 222, 128); 
    doc.setLineWidth(0.8);
    doc.line(pLx, pY - 3, pLx + 2, pY - 3); 
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 222, 128);
    doc.setFontSize(9.5);
    doc.text('✓ CASH PAYMENT DONE', pLx + 4, pY);
  }

  // ── Footer (Black Background) ──────────────────────────────────────────────
  let ty = creamEnd + 20;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GOLD);
  doc.setFontSize(11);
  doc.text('TERMS', INDENT, ty);

  ty += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 220, 220);
  doc.setFontSize(9.5);
  
  const termsText = [
    '• 100% payment is required to confirm the booking.',
    '• Payment is non-refundable in case of cancellation within 7 days of the event.',
    '• Client to provide basic setup requirements (space, power, permissions)',
    '  for smooth performance.'
  ];
  
  termsText.forEach(t => {
    doc.text(t, INDENT + 2, ty);
    ty += 6;
  });

  // Thank you next to Terms
  ty += 8;
  doc.setFont('times', 'italic');
  doc.setTextColor(...GOLD);
  doc.setFontSize(14);
  doc.text('Thank you for choosing The Band Company!', INDENT, ty);

  // QR Block on the right side
  if (qrBase64) {
    const qW = 32;
    const qH = 32;
    const qX = W - INDENT - qW;
    const qY = creamEnd + 16;
    
    doc.setFillColor(...WHITE);
    doc.rect(qX, qY, qW, qH, 'F');
    doc.addImage(qrBase64, 'PNG', qX + 1, qY + 1, qW - 2, qH - 2);
  }

  return doc.output('datauristring').split(',')[1];
}
