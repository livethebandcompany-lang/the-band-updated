import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import EnquiriesView from '@/components/admin/EnquiriesView';

async function getEnquiries() {
  await connectDB();
  // Fetch ALL inquiries, sort newest first
  const rawData = await Inquiry.find().sort({ createdAt: -1 }).lean();
  
  // Clean up mongoose _id for client prop injection
  return rawData.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      mobile: doc.mobile,
      destination: doc.destination,
      date: doc.date,
      message: doc.message,
      type: doc.type,
      status: doc.status,
      createdAt: doc.createdAt.toISOString()
  }));
}

export default async function EnquiriesPage() {
  const session = await getServerSession(authOptions);
  if (!session || !['admin', 'subadmin'].includes(session.user.role)) return null;

  const data = await getEnquiries();

  return (
    <div className="font-sans pb-20">
       <EnquiriesView initialData={data} userRole={session.user.role} />
    </div>
  );
}
