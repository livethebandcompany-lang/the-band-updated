'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  Trash2, 
  Settings2,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Filter,
  CreditCard,
  Banknote,
  AlertCircle,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import BookingActionModal from './BookingActionModal';

interface Booking {
  _id: string;
  clientName: string;
  clientPhone: string;
  clientAltPhone?: string;
  clientEmail?: string;
  clientInstagram?: string;
  companyName?: string;
  eventType: string;
  performanceType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  venueName: string;
  city: string;
  fullAddress?: string;
  googleMapsLink?: string;
  stayRequired: boolean;
  quotedAmount: number;
  finalAmount: number;
  totalAmount: number;
  taxAmount: number;
  paymentStatus: 'not_paid' | 'partial' | 'paid';
  paymentMode?: string;
  source?: string;
  campaignName?: string;
  salesPerson?: string;
  status: string;
  artistId?: {
    _id: string;
    name: string;
  };
  artistIds?: string[];
  razorpayLinkId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  invoiceNumber?: string;
}

interface BookingsListProps {
  initialBookings: Booking[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export default function BookingsList({ initialBookings, isAdmin, isSuperAdmin }: BookingsListProps) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    // Auto-refresh the server component payload every 3 seconds
    // to automatically capture payment status changes dynamically
    const pollInterval = setInterval(() => {
      router.refresh();
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [router]);

  // Directly pass all unpaid/pending bookings
  const filteredBookings = initialBookings.sort((a, b) => {
    // Sort logic to bring nearest events to the top
    const dateA = new Date(a.eventDate).getTime();
    const dateB = new Date(b.eventDate).getTime();
    return dateA - dateB;
  });

  const handleSendPaymentLink = async (bookingId: string) => {
    setLoadingId(bookingId);
    try {
      const res = await fetch('/api/bookings/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment link dispatched successfully.');
        router.refresh();
      } else {
        toast.error(data.error || 'Dispatch failed.');
      }
    } catch {
      toast.error('System synchronization error.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleCheckPaymentStatus = async (bookingId: string) => {
    setLoadingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/payment-status`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Check failed');

      if (data.paymentStatus === 'paid') {
        toast.success('Payment confirmed! Booking marked as paid.');
      } else {
        const formattedStatus = data.paymentStatus ? data.paymentStatus.replace('_', ' ') : 'unpaid';
        toast.success(`Checked: Status is currently ${formattedStatus}.`);
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to sync payment status');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!window.confirm('PERMANENTLY PURGE this record? This cannot be undone.')) return;
    setLoadingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Record purged from database.');
        router.refresh();
      }
    } catch {
      toast.error('Purge failed.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="hidden lg:grid grid-cols-12 gap-6 p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div className="col-span-3 text-xs font-black tracking-widest text-zinc-500 uppercase">Lead Record</div>
          <div className="col-span-3 text-xs font-black tracking-widest text-zinc-500 uppercase">Event Specs</div>
          <div className="col-span-2 text-xs font-black tracking-widest text-zinc-500 uppercase">Location & Stay</div>
          <div className="col-span-2 text-xs font-black tracking-widest text-zinc-500 uppercase">Finance Ledger</div>
          <div className="col-span-2 text-xs font-black tracking-widest text-zinc-500 uppercase text-right">Actions</div>
        </div>

        <div className="divide-y divide-zinc-800/50">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div 
                key={booking._id} 
                className="group relative transition-all duration-300 hover:bg-zinc-800/30"
              >
                <div className="lg:grid grid-cols-12 gap-6 p-6 items-center">
                  
                  {/* Subject Name / Phone Info */}
                  <div className="col-span-3 space-y-2.5 mb-6 lg:mb-0">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                         {booking.clientName.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <h3 className="font-bold text-white tracking-tight">{booking.clientName}</h3>
                         <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{booking.clientPhone}</p>
                       </div>
                    </div>
                    {booking.source && (
                       <div className="inline-flex px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                         Src: {booking.source.replace('_', ' ')}
                       </div>
                    )}
                  </div>

                  {/* Event Timing Info */}
                  <div className="col-span-3 space-y-2 mb-6 lg:mb-0">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <CalendarIcon size={14} className="text-zinc-500" />
                      <span className="text-sm font-semibold">
                        {new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                      <Clock size={14} className="text-zinc-600" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="flex gap-2">
                       <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">{booking.eventType}</span>
                       <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{booking.performanceType}</span>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="col-span-2 space-y-2.5 mb-6 lg:mb-0">
                    <div className="flex items-start gap-2 text-zinc-300">
                      <MapPin size={14} className="text-zinc-500 shrink-0 mt-0.5" />
                      <div>
                         <p className="text-sm font-semibold truncate max-w-[150px]">{booking.venueName}</p>
                         <p className="text-xs text-zinc-500 mt-0.5 font-medium">{booking.city}</p>
                      </div>
                    </div>
                    {booking.stayRequired && (
                      <span className="inline-flex px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                        Stay Required
                      </span>
                    )}
                  </div>

                  {/* Pricing Overview */}
                  <div className="col-span-2 space-y-1 mb-6 lg:mb-0">
                    <div className="flex items-baseline gap-1.5">
                       <p className="text-lg font-black text-white italic tracking-tight">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          Base: ₹{booking.quotedAmount.toLocaleString()}
                       </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                       {booking.paymentStatus === 'paid' ? (
                          <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Paid</span>
                       ) : (
                          <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending</span>
                       )}
                       {booking.paymentMode === 'cash' ? (
                          <span className="px-2 py-1 rounded flex items-center gap-1.5 bg-zinc-800 text-[9px] font-black uppercase text-zinc-400 tracking-widest"><Banknote size={10}/> Cash</span>
                       ) : (
                          <span className="px-2 py-1 rounded flex items-center gap-1.5 bg-blue-500/10 text-[9px] font-black uppercase text-blue-400 tracking-widest border border-blue-500/20"><CreditCard size={10}/> Online</span>
                       )}
                    </div>
                  </div>

                  {/* Action Handlers */}
                  <div className="col-span-2 flex items-center justify-end gap-3">
                     <button
                       onClick={() => setSelectedBooking(booking)}
                       className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-full transition-all duration-300"
                       title="Manage Operations"
                     >
                       <Settings2 size={18} />
                     </button>
                     
                     {booking.invoiceNumber && (
                       <a
                         href={`/api/bookings/${booking._id}/download`}
                         download={`Invoice_${booking.invoiceNumber}.pdf`}
                         className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-amber-500 rounded-full transition-all duration-300 shadow-[0_0_20px_-10px_rgba(245,158,11,0.4)]"
                         title="Download Official PDF Invoice"
                       >
                         <Download size={18} />
                       </a>
                     )}

                     {booking.paymentStatus !== 'paid' && booking.razorpayLinkId && (
                       <button
                         onClick={() => handleCheckPaymentStatus(booking._id)}
                         disabled={loadingId === booking._id}
                         className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-emerald-400 disabled:opacity-30 rounded-full transition-all duration-300"
                         title="Sync/Check Razorpay Payment Status"
                       >
                         <RefreshCw size={18} className={loadingId === booking._id ? 'animate-spin' : ''} />
                       </button>
                     )}

                     <button
                       onClick={() => handleSendPaymentLink(booking._id)}
                       disabled={loadingId === booking._id || booking.paymentMode === 'cash'}
                       className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-blue-400 disabled:opacity-30 rounded-full transition-all duration-300"
                       title="Send Payment Link"
                     >
                       <Send size={18} />
                     </button>
                     
                     {isSuperAdmin && (
                       <button
                         onClick={() => handleDelete(booking._id)}
                         disabled={loadingId === booking._id}
                         className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-red-900/50 text-zinc-400 hover:text-red-500 disabled:opacity-30 rounded-full transition-all duration-300"
                         title="Purge Record"
                       >
                         <Trash2 size={18} />
                       </button>
                     )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6">
                <Filter className="w-6 h-6 text-zinc-700" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Queue Empty</h3>
              <p className="text-xs text-zinc-500 font-medium">No pending deals logged in the pipeline.</p>
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <BookingActionModal
          onClose={() => setSelectedBooking(null)}
          onRefresh={() => router.refresh()}
          booking={{
            id: selectedBooking._id,
            clientName: selectedBooking.clientName,
            eventType: selectedBooking.eventType,
            clientEmail: selectedBooking.clientEmail,
            currentArtistId: selectedBooking.artistId?._id,
            currentArtistIds: selectedBooking.artistIds,
          }}
        />
      )}
    </div>
  );
}
