'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  Map as MapIcon, 
  ExternalLink,
  Calendar,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistBookingDetailModal from './ArtistBookingDetailModal';

interface Booking {
  _id: string;
  clientName: string;
  eventType: string;
  performanceType: string;
  eventDate: Date | string;
  startTime: string;
  endTime: string;
  venueName: string;
  city: string;
  googleMapsLink?: string;
  status: string;
  paymentStatus: string;
}

export default function MyBookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings'); 
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing performance ledger...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 bg-zinc-800/30 rounded-full flex items-center justify-center mb-6 border border-zinc-700/50">
          <Calendar size={32} className="text-zinc-600" />
        </div>
        <h3 className="text-xl font-bold text-white">Itinerary Empty</h3>
        <p className="text-zinc-500 text-sm mt-2 max-w-xs">No performances have been assigned to your deployment queue yet.</p>
      </div>
    );
  }

  const upcomingShows = bookings.filter(b => b.status !== 'completed');
  const completedShows = bookings.filter(b => b.status === 'completed');

  return (
    <div className="space-y-12 relative z-10">
      <section className="space-y-6">
        <div className="flex items-center gap-3 ml-2">
          <Zap size={18} className="text-blue-500 fill-blue-500/20" />
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Deployment Queue</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {upcomingShows.map((booking, idx) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedBooking(booking)}
                className="group bg-zinc-950/40 border border-zinc-800/80 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all hover:bg-zinc-950/60 shadow-2xl relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full group-hover:bg-blue-500/10 transition-all" />
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 border border-blue-500/20">
                        <Zap size={10} />
                        {new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tight truncate max-w-[250px]">
                        {booking.clientName}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-xl border ${
                      booking.status === 'confirmed' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {booking.status === 'confirmed' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                  </div>
                  <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</p>
                        <p className="text-sm font-semibold text-zinc-200 capitalize">{booking.eventType}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Time Slot</p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                          <Clock size={14} className="text-blue-500" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Performance Deployment</p>
                       <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                              <MapPin size={14} className="text-zinc-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-zinc-100 italic uppercase truncate">{booking.venueName}</p>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{booking.city}</p>
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-zinc-800/50 flex items-center justify-between text-zinc-500 group-hover:text-white transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-widest">View Detailed Operations Brief</span>
                     <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {completedShows.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-2">
            <CheckCircle2 size={18} className="text-zinc-600" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600">Performance Archive</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
            {completedShows.map((booking: any) => (
              <div 
                key={booking._id} 
                onClick={() => setSelectedBooking(booking)}
                className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl cursor-pointer hover:bg-zinc-900 transition-all"
              >
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{new Date(booking.eventDate).toLocaleDateString()}</p>
                <h4 className="text-sm font-bold text-zinc-300 italic uppercase">{booking.clientName}</h4>
                <div className="flex items-center gap-2 mt-3 text-emerald-500">
                  <CheckCircle2 size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Fulfilled</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedBooking && (
        <ArtistBookingDetailModal 
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={fetchBookings}
        />
      )}
    </div>
  );
}
