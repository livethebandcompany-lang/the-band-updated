'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BiX, BiUserCircle, BiCheckCircle, BiCalendarEvent } from 'react-icons/bi';

interface BookingActionModalProps {
  booking: {
    id: string;
    clientName: string;
    eventType: string;
    clientEmail?: string;
    currentArtistId?: string;
    currentArtistIds?: string[];
  };
  onClose: () => void;
  onRefresh: () => void;
}

export default function BookingActionModal({ booking, onClose, onRefresh }: BookingActionModalProps) {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingArtists, setFetchingArtists] = useState(false);
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>(
    booking.currentArtistIds?.length ? booking.currentArtistIds : 
    (booking.currentArtistId ? [booking.currentArtistId] : [])
  );
  const [artistPayments, setArtistPayments] = useState<Record<string, string>>({});
  const [manualPaymentId, setManualPaymentId] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setFetchingArtists(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setArtists(data.filter((u: any) => u.role === 'artist'));
    } catch (err) {
      toast.error('Failed to fetch artists');
    } finally {
      setFetchingArtists(false);
    }
  };

  const toggleArtist = (artistId: string) => {
    setSelectedArtistIds(prev => {
      if (prev.includes(artistId)) {
        const newPayments = { ...artistPayments };
        delete newPayments[artistId];
        setArtistPayments(newPayments);
        return prev.filter(id => id !== artistId);
      }
      if (prev.length >= 3) {
        toast.error('Maximum 3 artists can be assigned');
        return prev;
      }
      return [...prev, artistId];
    });
  };

  const updateArtistPayment = (artistId: string, amount: string) => {
    setArtistPayments(prev => ({ ...prev, [artistId]: amount }));
  };

  const assignArtists = async () => {
    setLoading(true);
    try {
      const paymentsArray = selectedArtistIds.map(id => ({
        artistId: id,
        amount: artistPayments[id] ? Number(artistPayments[id]) : 0
      }));

      const res = await fetch('/api/bookings/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId: booking.id, 
          artistId: selectedArtistIds[0],
          artistIds: selectedArtistIds,
          artistPayments: paymentsArray,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(
        selectedArtistIds.length > 0 
          ? `${selectedArtistIds.length} artist${selectedArtistIds.length > 1 ? 's' : ''} assigned successfully`
          : 'All artists removed successfully'
      );
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign artists');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentStatus: 'paid', 
          status: 'confirmed',
          paymentMode: paymentMode,
          ...(manualPaymentId.trim() && { razorpayPaymentId: manualPaymentId.trim() }) 
        }),
      });
      if (!res.ok) throw new Error('Failed to update payment status');

      toast.success('Booking marked as Paid');
      onRefresh();
      onClose();

      // Fire-and-forget: generate invoice + email PDF to client
      fetch(`/api/bookings/${booking.id}/resend-invoice`, { method: 'POST' })
        .then(async (r) => {
          const data = await r.json().catch(() => ({}));
          if (r.ok) {
            if (booking.clientEmail) {
              toast.success(`Invoice emailed to ${booking.clientEmail}`);
            } else {
              toast(`Invoice ${data.invoiceNumber || ''} generated (no client email on file)`, { icon: '📄' });
            }
          }
        })
        .catch(() => { /* silent — booking already marked paid */ });

    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white">
      <div className="bg-[#0f0f0f] border border-[#27272a] rounded-2xl w-full max-w-md overflow-hidden transform transition-all shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
          <div>
            <h3 className="text-xl font-bold">Manage Booking</h3>
            <p className="text-sm text-zinc-500">{booking.clientName} • {booking.eventType}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <BiX size={24} className="text-zinc-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
              <BiUserCircle size={16} /> Assign Artist
            </h4>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {fetchingArtists ? (
                <div className="py-8 text-center text-zinc-500">Loading artists...</div>
              ) : artists.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 italic">No artists found.</div>
              ) : (
                artists.map((artist) => {
                  const isSelected = selectedArtistIds.includes(artist._id);
                  return (
                    <div key={artist._id} className={`w-full p-4 rounded-xl border flex flex-col transition-all ${
                      isSelected
                        ? 'bg-blue-900/40 border-blue-500/60'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-blue-500/30 hover:bg-zinc-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleArtist(artist._id)}
                          disabled={loading}
                          className="flex items-center gap-3 flex-1"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                            isSelected ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            {artist.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-white">{artist.name}</p>
                            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{artist.email}</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => toggleArtist(artist._id)}
                          disabled={loading}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <BiCheckCircle size={14} className="text-white" />}
                        </button>
                      </div>
                      
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-blue-500/30 flex items-center justify-between">
                          <label className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Event Payment (₹)</label>
                          <input 
                            type="number"
                            placeholder="e.g. 15000"
                            value={artistPayments[artist._id] || ''}
                            onChange={(e) => updateArtistPayment(artist._id, e.target.value)}
                            className="w-32 bg-zinc-950 border border-blue-500/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                {selectedArtistIds.length} artist{selectedArtistIds.length !== 1 ? 's' : ''} selected
                <span className="text-zinc-600 ml-1">(max 3)</span>
              </p>
              <button
                onClick={assignArtists}
                disabled={loading}
                className={`px-4 py-2 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors ${
                  selectedArtistIds.length === 0 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Updating...' : selectedArtistIds.length === 0 ? 'Clear Assignment' : 'Assign Artists'}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800 space-y-3">
             <div className="flex gap-3 mb-3">
               <div className="w-1/3 space-y-1.5">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Method</label>
                 <select
                   value={paymentMode}
                   onChange={(e) => setPaymentMode(e.target.value)}
                   className="w-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 outline-none rounded-xl px-4 py-2.5 text-sm text-white transition-all appearance-none cursor-pointer"
                 >
                   <option value="cash">Cash</option>
                   <option value="bank">Bank Transfer</option>
                   <option value="upi">UPI / Scanner</option>
                   <option value="cheque">Cheque</option>
                 </select>
               </div>
               <div className="w-2/3 space-y-1.5">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Transaction ID (Optional)</label>
                 <input
                   type="text"
                   placeholder="e.g. UPI Ref / Cheque No."
                   value={manualPaymentId}
                   onChange={(e) => setManualPaymentId(e.target.value)}
                   className="w-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 focus:border-green-500/50 outline-none rounded-xl px-4 py-2.5 text-sm text-white transition-all placeholder:text-zinc-600"
                 />
               </div>
             </div>
             <button
               onClick={markAsPaid}
               disabled={loading}
               className="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold hover:bg-green-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <BiCheckCircle size={18} />
               Mark as Paid
             </button>
             <p className="text-[11px] text-zinc-500 text-center italic">
               Manual updates are recorded in the database immediately.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
