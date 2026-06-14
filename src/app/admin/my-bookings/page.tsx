import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import MyBookingsView from '@/components/admin/MyBookingsView';
import { ClipboardList, Filter } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');
  
  // Only Artists and Admins can see this personal itinerary view
  if (session.user.role !== 'artist' && session.user.role !== 'admin') {
    redirect('/admin');
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
            <ClipboardList size={32} className="text-blue-500" />
            Performance Ledger
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Dynamic Operations & Deployment Architecture
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
           <Filter size={14} className="text-zinc-500" />
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Itinerary</span>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[3rem] p-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
         <MyBookingsView />
      </div>
    </div>
  );
}
