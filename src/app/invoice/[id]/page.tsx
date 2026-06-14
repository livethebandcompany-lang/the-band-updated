import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { Metadata } from 'next';
import DownloadButton from '@/components/admin/DownloadButton';

export const metadata: Metadata = {
  title: 'Invoice | The Band Company',
  description: 'Booking Invoice',
};

async function getBooking(id: string) {
  await connectDB();
  return await Booking.findById(id).lean();
}

export default async function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking: any = await getBooking(id);
  if (!booking) notFound();

  const fmt = (d: any) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const invoiceDate = booking.invoiceDate ? fmt(booking.invoiceDate) : fmt(new Date());
  const eventDate = booking.eventDate ? fmt(booking.eventDate) : 'TBD';

  const fee = booking.quotedAmount || 0;
  const disc = booking.discountAmount || 0;
  const extra = booking.additionalChargesAmount || 0;
  const subtotal = fee - disc + extra;
  const tax = booking.taxAmount || 0;
  const total = booking.totalAmount || 0;

  const durationHours = booking.durationMinutes
    ? (booking.durationMinutes / 60).toFixed(1).replace(/\.0$/, '')
    : '2.5';

  const bandMap: Record<string, string> = {
    solo: 'Solo Artist', duet: 'Duet', trio: 'Trio',
    '4piece': '4-Piece Band', full_band: 'Full Band',
  };
  const bandLabel = booking.performanceType
    ? (bandMap[booking.performanceType] || booking.performanceType)
    : 'Band';
  const clientName = booking.billingName || booking.clientName || 'Client';

  /* ── palette ── */
  const G = '#c5a059';   /* gold  */
  const BK = '#0d0d0d';   /* black */
  const CR = '#f5f0e8';   /* cream */

  return (
    <div style={{
      minHeight: '100vh', background: '#111', fontFamily: 'Georgia, serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 12px',
    }}>

      {/* ╔═══════════════════════════════════╗
          ║          INVOICE  CARD            ║
          ╚═══════════════════════════════════╝ */}
      <div
        id="invoice-element"
        style={{ width: '100%', maxWidth: 680, border: `2px solid ${G}`, boxShadow: '0 30px 80px rgba(0,0,0,0.9)' }}
      >

        {/* ─────────────────────────────────────────────────────────────────
            BLACK HEADER
        ───────────────────────────────────────────────────────────────── */}
        <div style={{
          background: `radial-gradient(ellipse at 80% 10%, rgba(197,160,89,0.12) 0%, transparent 60%), ${BK}`,
          position: 'relative',
          padding: '32px 36px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* inner gold frame */}
          <div style={{ position: 'absolute', inset: 7, border: `1px solid ${G}`, pointerEvents: 'none', zIndex: 1 }} />

          {/* LEFT — logo + Title + tagline */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png"
              alt="The Band Company"
              style={{ width: 140, height: 140, objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(197,160,89,0.35))', marginBottom: 8 }}
            />
            <h1 style={{
              color: '#fff', fontWeight: 700, fontSize: 22,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              margin: '0 0 6px', fontFamily: 'Georgia, serif', textAlign: 'center'
            }}>
              The Band Company
            </h1>
            <p style={{ color: G, fontStyle: 'italic', fontSize: 15, margin: 0, letterSpacing: '0.02em', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
              Live music Experiences, Curated to Perfection.
            </p>
          </div>

          {/* RIGHT — invoice fields */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 24, borderLeft: `1px solid ${G}40` }}>
            <div>
              <span style={{ color: G, fontWeight: 700, fontSize: 17, letterSpacing: '0.08em', fontFamily: 'sans-serif', display: 'inline-block', marginBottom: 2 }}>
                INVOICE NO:
              </span>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 15, fontFamily: 'sans-serif', display: 'block' }}>
                {booking.invoiceNumber || 'TBC-0001'}
              </span>
            </div>
            {([
              ['Invoice Date:', invoiceDate],
              ['Event Date:', eventDate],
              ['Event Type:', booking.eventType || 'Private Celebration'],
              ['Location:', booking.city || 'Mumbai'],
            ] as [string, string][]).map(([lbl, val]) => (
              <div key={lbl} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ color: '#bbb', fontSize: 14, fontFamily: 'sans-serif', flexShrink: 0, minWidth: 95 }}>{lbl}</span>
                <span style={{ color: '#fff', fontSize: 14, fontFamily: 'sans-serif', textTransform: lbl === 'Event Type:' ? 'capitalize' : undefined }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            CREAM MIDDLE BODY
        ───────────────────────────────────────────────────────────────── */}
        <div style={{ background: CR, display: 'flex', alignItems: 'stretch' }}>

          {/* LEFT COLUMN: BILLED TO + SERVICE DETAILS */}
          <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column' }}>

            {/* BILLED TO */}
            <div style={{ padding: '28px 20px 10px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ color: G, fontWeight: 700, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                  BILLED TO
                </span>
                <span style={{ color: '#111', fontWeight: 700, fontSize: 20, fontFamily: 'sans-serif' }}>
                  {clientName}
                </span>
              </div>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#333', fontSize: 16, marginBottom: 8, fontFamily: 'sans-serif', fontWeight: 600 }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 {booking.clientPhone}</span>
              </div>
              {/* Email */}
              {booking.clientEmail && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#333', fontSize: 16, fontFamily: 'sans-serif', fontWeight: 600 }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{booking.clientEmail}</span>
                </div>
              )}
            </div>

            {/* SERVICE DETAILS */}
            <div style={{ padding: '24px 20px 32px 36px' }}>
              <p style={{ color: G, fontWeight: 700, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'sans-serif' }}>
                SERVICE DETAILS
              </p>
              <p style={{ color: '#111', fontWeight: 700, fontSize: 18, lineHeight: 1.55, marginBottom: 10, fontFamily: 'sans-serif' }}>
                Live Music Performance-<br />{bandLabel}
              </p>
              <p style={{ color: '#222', fontWeight: 700, fontSize: 17, marginBottom: 8, fontFamily: 'sans-serif' }}>
                Duration: {durationHours} Hours
              </p>
              <p style={{ color: '#222', fontWeight: 700, fontSize: 17, fontFamily: 'sans-serif' }}>
                Sound; Included/ Excluded
              </p>
              {booking.additionalChargesItems && (
                <ul style={{ marginTop: 10, padding: 0, listStyle: 'none', color: '#555', fontSize: 14, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {booking.additionalChargesItems.split(',').map((item: string, i: number) => (
                    <li key={i} style={{ fontWeight: 600 }}>• {item.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: PAYMENT BREAKDOWN */}
          <div style={{ flex: 1, padding: '24px 24px 24px 0' }}>
            <div style={{
              background: `radial-gradient(ellipse at 50% 50%, #1c1400 0%, #090900 60%, #000 100%)`,
              border: `2px solid ${G}`,
              padding: '24px 20px',
              position: 'relative',
              height: '100%', boxSizing: 'border-box',
              boxShadow: '0 6px 30px rgba(0,0,0,0.5)',
            }}>
              {/* corner ornaments */}
              {([
                { top: 6, left: 6, borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}` },
                { top: 6, right: 6, borderTop: `2px solid ${G}`, borderRight: `2px solid ${G}` },
                { bottom: 6, left: 6, borderBottom: `2px solid ${G}`, borderLeft: `2px solid ${G}` },
                { bottom: 6, right: 6, borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}` },
              ] as any[]).map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 14, height: 14, ...s }} />
              ))}

              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 24, fontFamily: 'sans-serif' }}>
                PAYMENT BREAKDOWN
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 15, fontFamily: 'sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc' }}>
                  <span>Performance Fee</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₹ {fee.toLocaleString('en-IN')}</span>
                </div>
                {disc > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc' }}>
                    <span>Discount Applied</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>- ₹ {disc.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {extra > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc' }}>
                    <span>Logistics &amp; Extras</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>₹ {extra.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', borderTop: '1px solid #333', paddingTop: 10 }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                {tax > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc' }}>
                    <span>GST (18%)</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>₹ {tax.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div style={{ marginTop: 24, borderTop: `2px solid ${G}`, paddingTop: 18 }}>
                <span style={{ color: G, fontWeight: 700, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>
                  GRAND TOTAL
                </span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 24, fontFamily: 'sans-serif', display: 'block' }}>
                  ₹ {total.toLocaleString('en-IN')}
                </span>

                {booking.paymentStatus === 'paid' && (
                  <div style={{ marginTop: 18, background: '#111', padding: '10px 14px', borderLeft: `4px solid #4ade80`, borderRadius: 2 }}>
                    <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                      ✓ PAYMENT COMPLETED
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────────
            BOTTOM BLACK SECTION  (TERMS + THANK YOU)
        ───────────────────────────────────────────────────────────────── */}
        <div style={{ background: BK, padding: '32px 36px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

          <div style={{ flex: 1 }}>
            <p style={{ color: G, fontWeight: 700, fontSize: 17, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'sans-serif' }}>
              TERMS
            </p>
            <ul style={{ listStyle: 'disc', paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              <li style={{ color: '#ddd', fontSize: 14, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                100% payment is required to confirm the booking.
              </li>
              <li style={{ color: '#ddd', fontSize: 14, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                Payment is non-refundable in case of cancellation within 7 days of the event.
              </li>
              <li style={{ color: '#ddd', fontSize: 14, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                Client to provide basic setup requirements (space, power, permissions)<br />for smooth performance.
              </li>
            </ul>
            <p style={{ color: G, fontStyle: 'italic', fontSize: 21, margin: 0, fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}>
              Thank you for choosing The Band Company!
            </p>
          </div>

          {/* WhatsApp QR */}
          <div style={{ flexShrink: 0, background: '#fff', padding: 6, border: `2px solid ${G}`, borderRadius: 4, marginTop: 4 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://wa.me/917779945379"
              alt="WhatsApp QR"
              style={{ width: 100, height: 100, display: 'block' }}
            />
          </div>

        </div>

      </div>

      {/* Download button */}
      <DownloadButton bookingId={booking._id.toString()} invoiceNumber={booking.invoiceNumber} />
    </div>
  );
}
