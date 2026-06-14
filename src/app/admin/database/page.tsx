import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import ClientDatabaseView from '@/components/admin/ClientDatabaseView';
import { redirect } from 'next/navigation';

async function getClientsFromPaidBookings() {
  await connectDB();
  // Fetch ALL completed sales OR paid bookings
  const archived = await Booking.find({ 
    $or: [
      { paymentStatus: 'paid' },
      { status: 'completed' }
    ]
  }).sort({ eventDate: -1 }).lean();
  
  // Aggregate them into a Client Profile object
  const clientsMap: any = {};
  for (const b of archived) {
    const key = b.clientPhone;
    if (!clientsMap[key]) {
      clientsMap[key] = {
        clientName: b.clientName,
        clientPhone: b.clientPhone,
        clientEmail: b.clientEmail,
        clientAltPhone: b.clientAltPhone,
        clientInstagram: b.clientInstagram,
        companyName: b.companyName,
        billingName: b.billingName,
        bookings: []
      };
    }
    
    // Safely parse out Mongo ObjectID bindings before pushing to Client Component boundary
    b._id = b._id.toString();
    if (b.artistId) b.artistId = b.artistId.toString();
    if (b.createdBy) b.createdBy = b.createdBy.toString();
    
    clientsMap[key].bookings.push(b);
  }
  
  return JSON.parse(JSON.stringify(Object.values(clientsMap)));
}

export default async function DatabaseArchivePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return redirect('/admin');
  }

  const clients = await getClientsFromPaidBookings();

  return (
    <div className="font-sans pb-20">
       <ClientDatabaseView clients={clients} userRole={session.user.role} />
    </div>
  );
}
