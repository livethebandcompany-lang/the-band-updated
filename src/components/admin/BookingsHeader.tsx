'use client';

import { Plus, Download, Filter, Search, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import CreateBookingModal from './CreateBookingModal';
import { exportBookingsToExcel } from '@/lib/exportUtils';

interface BookingsHeaderProps {
  isAdmin: boolean;
  stats: any;
  bookings: any[];
}

export default function BookingsHeader({ isAdmin, stats, bookings }: BookingsHeaderProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6 mb-6">
      <div className="flex flex-col md:flex-row items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
            Booking CRM
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Managing {stats.totalBookings} performance cycles
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => exportBookingsToExcel(bookings)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors shadow-sm"
          >
            <Download size={16} />
            Export Data
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus size={16} />
              New Lead
            </button>
          )}
        </div>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <MiniStat label="Confirmed" value={stats.confirmedCount} color="emerald" />
         <MiniStat label="Pending Payments" value={stats.pendingPayments} color="amber" />
         <MiniStat label="Net Value" value={`₹${stats.totalRevenue.toLocaleString()}`} color="blue" />
         <MiniStat label="System Health" value="Active" color="indigo" />
      </div>

      {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} onRefresh={() => window.location.reload()} />}
    </div>
  );
}

function MiniStat({ label, value, color }: any) {
  const colorMap: any = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
  };
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 p-4 rounded-xl flex items-center justify-between transition-all shadow-sm">
       <span className="text-xs font-semibold text-zinc-500">{label}</span>
       <span className={`text-sm font-semibold ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]}`}>{value}</span>
    </div>
  );
}
