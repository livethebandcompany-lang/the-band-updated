import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import InvoicesList from '@/components/admin/InvoicesList';
import { FileText, Plus, DollarSign, TrendingUp } from 'lucide-react';

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const isAdmin = session.user.role === 'admin' || session.user.role === 'subadmin';
  if (!isAdmin) redirect('/admin');

  await connectDB();

  const bookings = await Booking.find({
    invoiceNumber: { $exists: true, $ne: null },
    archived: false,
  })
    .sort({ invoiceDate: -1 })
    .limit(200);

  const invoices = bookings.map((b) => ({
    _id: b._id.toString(),
    invoiceNumber: b.invoiceNumber,
    invoiceDate: b.invoiceDate ? b.invoiceDate.toISOString() : null,
    clientName: b.clientName,
    clientEmail: b.clientEmail,
    clientPhone: b.clientPhone,
    billingName: b.billingName,
    eventType: b.eventType,
    eventDate: b.eventDate.toISOString(),
    city: b.city,
    venueName: b.venueName,
    totalAmount: b.totalAmount || 0,
    paymentStatus: b.paymentStatus,
    paymentMode: b.paymentMode,
    razorpayPaymentId: b.razorpayPaymentId,
  }));

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidCount = invoices.filter((inv) => inv.paymentStatus === 'paid').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            Invoice Management
          </h1>
          <p className="text-zinc-500 mt-1">
            View, download, and manage all generated invoices
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total Invoices</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {invoices.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total Revenue</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Paid Invoices</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {paidCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <InvoicesList invoices={invoices} isAdmin={isAdmin} />
    </div>
  );
}
