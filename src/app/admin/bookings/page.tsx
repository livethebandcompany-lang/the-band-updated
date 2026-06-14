import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import BookingsList from '@/components/admin/BookingsList';
import BookingsHeader from '@/components/admin/BookingsHeader';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectDB();
  
  const filter: any = { 
    archived: false,
    status: { $ne: 'completed' } 
  }; // Show only active, non-completed bookings
  if (session.user.role === 'artist') {
    filter.artistId = session.user.id;
  }
  
  const bookings = await Booking.find(filter)
    .populate('artistId', 'name')
    .sort({ createdAt: -1 })
    .limit(100);

  // Convert Mongoose docs to plain objects
  const plainBookings = bookings.map(b => ({
    _id: b._id.toString(),
    clientName: b.clientName,
    clientPhone: b.clientPhone,
    clientAltPhone: b.clientAltPhone,
    clientEmail: b.clientEmail,
    clientInstagram: b.clientInstagram,
    companyName: b.companyName,
    eventType: b.eventType,
    performanceType: b.performanceType,
    eventDate: b.eventDate.toISOString(),
    startTime: b.startTime,
    endTime: b.endTime,
    durationMinutes: b.durationMinutes,
    venueName: b.venueName,
    city: b.city,
    fullAddress: b.fullAddress,
    googleMapsLink: b.googleMapsLink,
    stayRequired: b.stayRequired,
    quotedAmount: b.quotedAmount,
    finalAmount: b.finalAmount,
    totalAmount: b.totalAmount,
    taxAmount: b.taxAmount,
    paymentStatus: b.paymentStatus,
    paymentMode: b.paymentMode,
    source: b.source,
    campaignName: b.campaignName,
    salesPerson: b.salesPerson,
    status: b.status,
    artistId: b.artistId ? {
      _id: b.artistId._id.toString(),
      name: b.artistId.name
    } : undefined,
    razorpayLinkId: b.razorpayLinkId,
    razorpayOrderId: b.razorpayOrderId,
    razorpayPaymentId: b.razorpayPaymentId,
    invoiceNumber: b.invoiceNumber,
  }));

  const isAdmin = session.user.role === 'admin' || session.user.role === 'subadmin';

  // Calculate CRM Stats for Active Bookings
  const stats = {
    totalBookings: plainBookings.length,
    confirmedCount: plainBookings.filter(b => b.status === 'confirmed').length,
    pendingPayments: plainBookings.filter(b => b.paymentStatus !== 'paid' && b.status !== 'cancelled').length,
    totalRevenue: plainBookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || b.finalAmount || 0), 0),
  };

  return (
    <div className="space-y-6">
      <BookingsHeader isAdmin={isAdmin} stats={stats} bookings={plainBookings} />
      <BookingsList initialBookings={plainBookings} isAdmin={isAdmin} isSuperAdmin={session.user.role === 'admin'} />
    </div>
  );
}
