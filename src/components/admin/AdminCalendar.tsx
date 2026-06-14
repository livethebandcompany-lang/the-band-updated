'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import ArtistBookingDetailModal from './ArtistBookingDetailModal';

interface Booking {
  _id: string;
  clientName: string;
  eventType: string;
  performanceType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  city: string;
  fullAddress?: string;
  googleMapsLink?: string;
  paymentStatus: 'not_paid' | 'partial' | 'paid';
  status: string;
  billingName?: string;
  clientPhone?: string;
  clientEmail?: string;
}

export default function AdminCalendar() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings?all=true');
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

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const getBookingsForDay = (day: number) => {
    return bookings.filter(b => {
      const d = new Date(b.eventDate);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const handleEventClick = (booking: Booking) => {
    if (session?.user?.role === 'artist') {
      setSelectedBooking(booking);
    }
  };

  return (
    <div className="bg-transparent font-sans">
      {/* Calendar Header with Logo Theme Accents */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-1 bg-zinc-950 border border-amber-500/10 p-2 rounded-[2rem] shadow-2xl">
          <button 
            onClick={prevMonth} 
            className="p-3 hover:bg-zinc-900 rounded-2xl transition-all text-zinc-600 hover:text-amber-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="px-12 text-center min-w-[240px]">
             <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
               {monthName} <span className="text-zinc-800 not-italic mx-1 font-light">/</span> <span className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">{year}</span>
             </h2>
          </div>
          <button 
            onClick={nextMonth} 
            className="p-3 hover:bg-zinc-900 rounded-2xl transition-all text-zinc-600 hover:text-amber-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-6 py-3 bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
              <Zap size={12} className="text-amber-500" />
              {bookings.length} Performances Logged
           </div>
        </div>
      </div>

      {/* Calendar Grid - Premium Dark/Gold Theme */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {/* Week Days */}
        <div className="grid grid-cols-7 border-b border-zinc-900 bg-zinc-950/80">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-6 text-center">
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">{d}</span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-px bg-zinc-900/50">
          {Array.from({ length: 42 }).map((_, i) => {
            const day = i - firstDay + 1;
            const isCurrentMonth = day > 0 && day <= days;
            const dayBookings = isCurrentMonth ? getBookingsForDay(day) : [];
            const isToday = isCurrentMonth && day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            return (
              <div 
                key={i} 
                className={`min-h-[200px] p-5 bg-zinc-950 font-sans transition-all relative group ${
                  !isCurrentMonth ? 'opacity-0 pointer-events-none' : 'hover:bg-zinc-900/40'
                }`}
              >
                {/* Day Number with Gold Glow for Today */}
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-base font-black italic tracking-tighter transition-all duration-500 ${
                    isToday ? 'text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-110' : 'text-zinc-800 group-hover:text-zinc-500'
                  }`}>
                    {isCurrentMonth ? day.toString().padStart(2, '0') : ''}
                  </span>
                  {dayBookings.length > 0 && (
                     <div className="flex gap-1">
                        <div className={`w-2 h-2 rounded-full ${dayBookings.some(b => b.status === 'completed') ? 'bg-red-500 animate-pulse' : 'bg-amber-500 animate-pulse'} shadow-2xl`} />
                     </div>
                  )}
                </div>

                {/* Event Cards */}
                <div className="space-y-3">
                  {dayBookings.slice(0, 3).map((b, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEventClick(b)}
                      className={`p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden group/item ${
                        b.status === 'completed' 
                          ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/50' 
                          : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800/80 hover:border-amber-500/30 shadow-xl'
                      } ${session?.user?.role === 'artist' ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      {/* Brand Gradient Overlay for Active Events */}
                      {b.status !== 'completed' && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                      )}
                      {b.status === 'completed' && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
                      )}
                      
                      <div className="flex items-center justify-between mb-2">
                         <h4 className={`text-[10px] font-black italic uppercase truncate tracking-tight ${
                           b.status === 'completed' ? 'text-red-400' : 'text-white'
                         }`}>
                           {b.clientName}
                         </h4>
                         <div className={`w-1.5 h-1.5 rounded-full ${
                           b.status === 'completed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                           b.status === 'confirmed' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                           'bg-zinc-600'
                         }`} />
                      </div>
                      
                      <div className="space-y-1.5 border-t border-zinc-800/50 pt-2">
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                          <Clock size={8} className="text-zinc-700" />
                          <span className={b.status === 'completed' ? 'text-red-900/60' : 'text-zinc-400'}>{b.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-500 truncate">
                          <MapPin size={8} className="text-zinc-700" />
                          <span className="truncate">{b.city}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {dayBookings.length > 3 && (
                    <div className="text-[8px] font-black text-zinc-700 uppercase text-center py-2 bg-zinc-950 rounded-xl border border-zinc-900">
                      + {dayBookings.length - 3} Units
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Legend - Logo Themed */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-10">
         <LegendItem color="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" label="CONFIRMED PERFORMANCE" />
         <LegendItem color="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" label="FULFILLED / COMPLETED" />
         <LegendItem color="bg-zinc-700" label="DEAL IN PROGRESS" />
      </div>

      {/* Detail Modal */}
      {selectedBooking && session?.user?.role === 'artist' && (
        <ArtistBookingDetailModal 
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={fetchBookings}
        />
      )}
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-3">
       <div className={`w-2 h-2 rounded-full ${color}`} />
       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}
