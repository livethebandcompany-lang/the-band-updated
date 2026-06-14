import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminCalendar from '@/components/admin/AdminCalendar';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
            <CalendarIcon size={32} className="text-yellow-500" />
            Performance Ops
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Dynamic scheduling and deployment architecture
          </p>
        </div>
        
        <div className="flex items-center gap-4 p-5 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl">
           <Info size={16} className="text-yellow-500" />
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Confirmed Ops</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Pending Sync</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] rounded-full" />
         <AdminCalendar />
      </div>
    </div>
  );
}
