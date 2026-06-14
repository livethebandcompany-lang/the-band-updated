'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Database, Search, Download, Trash2, Calendar, MapPin, 
  ChevronDown, ChevronUp, Repeat, CheckCircle2,
  Phone, Mail, PlusCircle, Filter, Users, Banknote, CreditCard, Activity,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import CreateBookingModal from './CreateBookingModal';
import EditBookingModal from './EditBookingModal';
import { exportBookingsToExcel } from '@/lib/exportUtils';
import { Edit2 } from 'lucide-react';

export default function ClientDatabaseView({ clients, userRole }: { clients: any[], userRole: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [repeatBookingClient, setRepeatBookingClient] = useState<any>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all', // 'all', 'month', 'year', 'custom'
    customStart: '',
    customEnd: '',
    paymentMode: 'all',
    repeatOnly: false,
    city: 'all',
    source: 'all',
    salesExec: 'all'
  });

  // Unique lists for dropdowns
  const availableCities = useMemo(() => Array.from(new Set(clients.flatMap(c => c.bookings.map((b: any) => b.city)).filter(Boolean))), [clients]);
  const availableSources = useMemo(() => Array.from(new Set(clients.flatMap(c => c.bookings.map((b: any) => b.source)).filter(Boolean))), [clients]);
  const availableExecs = useMemo(() => Array.from(new Set(clients.flatMap(c => c.bookings.map((b: any) => b.salesPerson)).filter(Boolean))), [clients]);

  const allBookings = clients.flatMap(c => c.bookings);

  const filteredBookings = allBookings.filter((b: any) => {
    // 1. Core Text Search
    const searchMatch = b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || b.clientPhone.includes(searchQuery);
    if (!searchMatch) return false;

    // 2. Repeat Client Toggle
    if (filters.repeatOnly) {
       const clientCount = allBookings.filter(x => x.clientPhone === b.clientPhone).length;
       if (clientCount < 2) return false;
    }

    // 3. Date Logic
    const bDate = new Date(b.eventDate);
    if (filters.dateRange === 'month') {
      const now = new Date();
      if (bDate.getMonth() !== now.getMonth() || bDate.getFullYear() !== now.getFullYear()) return false;
    } else if (filters.dateRange === 'year') {
      const now = new Date();
      if (bDate.getFullYear() !== now.getFullYear()) return false;
    } else if (filters.dateRange === 'custom') {
       if (filters.customStart && bDate < new Date(filters.customStart)) return false;
       if (filters.customEnd && bDate > new Date(filters.customEnd)) return false;
    }

    // 4. Payment Mode Logic
    if (filters.paymentMode !== 'all') {
      const isOnline = b.paymentMode === 'upi' || b.paymentMode === 'bank';
      if (filters.paymentMode === 'online' && !isOnline) return false;
      if (filters.paymentMode === 'cash' && b.paymentMode !== 'cash') return false;
    }

    // 5. Metadata Matches
    if (filters.city !== 'all' && b.city !== filters.city) return false;
    if (filters.source !== 'all' && b.source !== filters.source) return false;
    if (filters.salesExec !== 'all' && b.salesPerson !== filters.salesExec) return false;

    return true;
  });

  // Dynamic Metrics Calculation (Based on Active Filters)
  const totalDeals = filteredBookings.length;
  const totalRevenue = filteredBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || b.finalAmount || 0), 0);
  const cashRevenue = filteredBookings.filter((b: any) => b.paymentMode === 'cash').reduce((sum: number, b: any) => sum + (b.totalAmount || b.finalAmount || 0), 0);
  const onlineRevenue = filteredBookings.filter((b: any) => b.paymentMode === 'upi' || b.paymentMode === 'bank').reduce((sum: number, b: any) => sum + (b.totalAmount || b.finalAmount || 0), 0);

  const handleDelete = async (bookingId: string) => {
    if (!window.confirm("CRITICAL WARNING: Are you absolutely sure you want to permanently delete this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Record purged permanently from database.');
        router.refresh();
      }
    } catch {
      toast.error('Server error during purge.');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
            <Database size={32} className="text-yellow-500" />
            Master Database
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Long-term Storage & CRM Analytics
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* Global Search Interface */}
           <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 group focus-within:border-yellow-500/50 transition-all">
              <Search size={16} className="text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
              <input 
                 type="text" 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 placeholder="Search Clients / Phone..." 
                 className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-white focus:outline-none w-48 placeholder:text-zinc-700" 
              />
           </div>
           
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`flex items-center gap-3 px-6 py-3.5 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${showFilters ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
           >
              <Filter size={16} /> Filters
           </button>

           <button 
             onClick={() => exportBookingsToExcel(filteredBookings, 'Master_Archive_Export')}
             className="flex items-center gap-3 px-8 py-3.5 bg-yellow-500 border border-yellow-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black hover:bg-yellow-400 transition-all"
           >
              <Download size={16} />
              Export .xlsx
           </button>
        </div>
      </div>

      {/* Extreme Filter Dashboard */}
      {showFilters && (
         <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
            {/* Timeline Filter */}
            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Event Timeline</label>
               <select 
                 value={filters.dateRange} 
                 onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                 className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl outline-none p-3 focus:border-yellow-500"
               >
                  <option value="all">Lifetime History</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Date Range</option>
               </select>
               {filters.dateRange === 'custom' && (
                  <div className="flex gap-2 mt-2">
                     <input type="date" value={filters.customStart} onChange={(e) => setFilters({...filters, customStart: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-lg text-xs p-2 text-zinc-400" />
                     <input type="date" value={filters.customEnd} onChange={(e) => setFilters({...filters, customEnd: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-lg text-xs p-2 text-zinc-400" />
                  </div>
               )}
            </div>

            {/* Financials */}
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Payment Origin</label>
                  <select 
                     value={filters.paymentMode} 
                     onChange={(e) => setFilters({...filters, paymentMode: e.target.value})}
                     className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl outline-none p-3 focus:border-yellow-500"
                  >
                     <option value="all">All Modes</option>
                     <option value="online">Online / UPI</option>
                     <option value="cash">Hard Cash</option>
                  </select>
               </div>
               
               <label className="flex items-center gap-3 bg-black border border-zinc-800 p-3 rounded-xl cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${filters.repeatOnly ? 'bg-yellow-500' : 'bg-zinc-800'}`}>
                     {filters.repeatOnly && <CheckCircle2 size={12} className="text-black" />}
                  </div>
                  <input type="checkbox" checked={filters.repeatOnly} onChange={(e) => setFilters({...filters, repeatOnly: e.target.checked})} className="hidden" />
                  <span className="text-xs font-bold text-zinc-300">Repeated Clients Only</span>
               </label>
            </div>

            {/* Local & Operations */}
            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Target City</label>
               <select 
                 value={filters.city} 
                 onChange={(e) => setFilters({...filters, city: e.target.value})}
                 className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl outline-none p-3 focus:border-yellow-500"
               >
                  <option value="all">All Territories</option>
                  {availableCities.map(city => <option key={city as string} value={city as string}>{city as string}</option>)}
               </select>

               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mt-4">Acquisition Source</label>
               <select 
                 value={filters.source} 
                 onChange={(e) => setFilters({...filters, source: e.target.value})}
                 className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl outline-none p-3 focus:border-yellow-500"
               >
                  <option value="all">Any Source</option>
                  {availableSources.map(src => <option key={src as string} value={src as string}>{String(src).replace('_', ' ')}</option>)}
               </select>
            </div>

             {/* Team & Reps */}
             <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Sales Executive</label>
               <select 
                 value={filters.salesExec} 
                 onChange={(e) => setFilters({...filters, salesExec: e.target.value})}
                 className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl outline-none p-3 focus:border-yellow-500"
               >
                  <option value="all">Any Agent</option>
                  {availableExecs.map(exec => <option key={exec as string} value={exec as string}>{exec as string}</option>)}
               </select>
               
               <button 
                  onClick={() => setFilters({dateRange: 'all', customStart: '', customEnd: '', paymentMode: 'all', repeatOnly: false, city: 'all', source: 'all', salesExec: 'all'})}
                  className="w-full flex items-center justify-center gap-2 p-3 mt-4 text-xs font-bold text-zinc-500 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-xl"
               >
                  <X size={14} /> Clear Adjustments
               </button>
            </div>
         </div>
      )}

      {/* Global CRM Metrics Widget */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500"><Activity size={18} /><h3 className="text-xs font-black uppercase tracking-widest">Total Deals</h3></div>
            <p className="text-4xl font-black text-white">{totalDeals}</p>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500"><Banknote size={18} /><h3 className="text-xs font-black uppercase tracking-widest">Total Revenue</h3></div>
            <div className="flex items-baseline gap-1">
               <span className="text-lg font-bold text-emerald-500">₹</span>
               <p className="text-4xl font-black text-emerald-500">{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500"><Banknote size={18} /><h3 className="text-xs font-black uppercase tracking-widest">Cash Revenue</h3></div>
            <div className="flex items-baseline gap-1">
               <span className="text-lg font-bold text-white">₹</span>
               <p className="text-4xl font-black text-white">{cashRevenue.toLocaleString('en-IN')}</p>
            </div>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500"><CreditCard size={18} /><h3 className="text-xs font-black uppercase tracking-widest">Online Revenue</h3></div>
            <div className="flex items-baseline gap-1">
               <span className="text-lg font-bold text-white">₹</span>
               <p className="text-4xl font-black text-white">{onlineRevenue.toLocaleString('en-IN')}</p>
            </div>
         </div>
      </div>

      <div className="space-y-4">
         {filteredBookings.map((booking: any) => (
             <div key={booking._id} className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group hover:bg-zinc-800/20 transition-all duration-300">
                
                <div className="flex items-start gap-6 flex-1 min-w-0">
                   <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 border border-zinc-700 shrink-0">
                      {booking.clientName.charAt(0).toUpperCase()}
                   </div>
                   <div className="min-w-0">
                      <div className="flex items-center gap-3">
                         <h3 className="text-xl font-bold text-white tracking-tight truncate">{booking.clientName}</h3>
                         <span className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                            {booking.eventType} 
                         </span>
                         {booking.status === 'completed' && (
                           <span className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                             Completed
                           </span>
                         )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 opacity-80">
                         <span className="flex items-center gap-1.5 text-xs text-zinc-400"><Phone size={12}/> {booking.clientPhone}</span>
                         {booking.clientEmail && <span className="flex items-center gap-1.5 text-xs text-zinc-400"><Mail size={12}/> {booking.clientEmail}</span>}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3">
                         <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            <Calendar size={12} /> {new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                         </p>
                         <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <MapPin size={12}/> {booking.city || booking.venueName}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 lg:gap-8 shrink-0 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-zinc-800 lg:border-t-0">
                   <div className="text-left lg:text-right flex-1 lg:flex-none">
                      <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600 block mb-1">Total Value</span>
                      <span className="text-lg font-bold text-emerald-500">₹{(booking.totalAmount || booking.finalAmount).toLocaleString()}</span>
                   </div>

                   <div className="flex items-center gap-2">
                       <span className="px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-500 flex items-center gap-1 border border-emerald-500/20">
                          <CheckCircle2 size={10} /> Paid
                       </span>
                       {booking.paymentMode === 'cash' ? (
                          <span className="px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase bg-zinc-800 text-zinc-400 flex items-center gap-1 border border-zinc-700">
                             <Banknote size={10} /> Cash
                          </span>
                       ) : (
                          <span className="px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase bg-zinc-800 text-zinc-400 flex items-center gap-1 border border-zinc-700">
                             <CreditCard size={10} /> Online
                          </span>
                       )}
                   </div>

                   <div className="flex items-center gap-3">
                        {booking.invoiceNumber && (
                           <a 
                              href={`/api/bookings/${booking._id}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-amber-500 rounded-full transition-all duration-300 shadow-[0_0_20px_-10px_rgba(245,158,11,0.4)]"
                              title="Download Invoice Ledger"
                           >
                              <Download size={18} />
                           </a>
                        )}
                        <button 
                           onClick={() => setRepeatBookingClient(booking)}
                           className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 text-yellow-500 rounded-full transition-all duration-300"
                           title="Quick Repeat Booking"
                        >
                           <Repeat size={18} />
                        </button>
                        {userRole === 'admin' && (
                           <>
                             <button 
                                onClick={() => setEditingBookingId(booking._id)}
                                className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 text-blue-500 rounded-full transition-all duration-300"
                                title="Edit Record Details"
                             >
                                <Edit2 size={18} />
                             </button>
                             <button 
                                onClick={() => handleDelete(booking._id)}
                                className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-red-900/50 text-zinc-500 hover:text-red-500 rounded-full transition-all duration-300"
                                title="Purge Record Permanent"
                             >
                                <Trash2 size={18} />
                             </button>
                           </>
                        )}
                   </div>
                </div>

             </div>
         ))}

         {filteredBookings.length === 0 && (
            <div className="py-32 text-center">
               <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Database size={24} className="text-zinc-700" />
               </div>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">0 Records Found Matching Criteria</p>
               <button onClick={() => setFilters({dateRange: 'all', customStart: '', customEnd: '', paymentMode: 'all', repeatOnly: false, city: 'all', source: 'all', salesExec: 'all'})} className="mt-4 px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-colors">
                  Clear Filters
               </button>
            </div>
         )}
      </div>

      {repeatBookingClient && (
         <CreateBookingModal
            onClose={() => setRepeatBookingClient(null)}
            onRefresh={() => router.refresh()}
            isRepeatBooking={true}
            prefillData={repeatBookingClient}
         />
      )}

      {editingBookingId && (
         <EditBookingModal
            bookingId={editingBookingId}
            onClose={() => setEditingBookingId(null)}
            onRefresh={() => router.refresh()}
         />
      )}
    </>
  );
}
