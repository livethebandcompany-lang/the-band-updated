import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Settings, Shield, Bell, Zap, Database, Lock, User } from 'lucide-react';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
            <Settings size={32} className="text-yellow-500" />
            System Configuration
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Managing global parameters and security protocols
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <SettingsSection 
             icon={<User size={20} />} 
             title="Account Identity" 
             desc="Manage your professional profile and credentials"
           >
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Full Name</label>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 text-sm text-zinc-400 font-bold">{session.user.name}</div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Security Clearance</label>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl px-5 py-3 text-sm text-yellow-500 font-black uppercase tracking-widest">{session.user.role}</div>
                 </div>
              </div>
           </SettingsSection>

           <SettingsSection 
             icon={<Bell size={20} />} 
             title="Intelligence Alerts" 
             desc="Configure real-time booking and payment notifications"
           >
              <div className="space-y-4">
                 <ToggleItem label="New Booking Notifications" desc="Get alerted when a lead is captured via the wizard" active />
                 <ToggleItem label="Payment Confirmations" desc="Receive real-time alerts for UPI/Razorpay success" active />
                 <ToggleItem label="Auto-Archive Logs" desc="Weekly summary of migrated historical records" />
              </div>
           </SettingsSection>

           <SettingsSection 
             icon={<Lock size={20} />} 
             title="Security & Access" 
             desc="Identity management and session security"
           >
              <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all hover:border-zinc-700">
                 Rotate API Access Keys
              </button>
           </SettingsSection>
        </div>

        <div className="space-y-8">
           <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-black text-white italic uppercase mb-2">System Status</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">All core operational modules are functioning within normal parameters.</p>
              
              <div className="mt-8 space-y-4">
                 <StatusItem label="Razorpay Gateway" status="Operational" active />
                 <StatusItem label="Archive Sync" status="Operational" active />
                 <StatusItem label="Talent Registry" status="Syncing" active />
              </div>
           </div>

           <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-black text-white italic uppercase mb-2">Cold Storage</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Central Archive is currently managing 42+ historical records.</p>
              <button className="mt-6 w-full py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                 Clear Cache
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ icon, title, desc, children }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-10">
       <div className="flex items-start gap-5 mb-8">
          <div className="p-3.5 bg-zinc-800 rounded-2xl text-yellow-500">{icon}</div>
          <div>
             <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{title}</h3>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{desc}</p>
          </div>
       </div>
       {children}
    </div>
  );
}

function ToggleItem({ label, desc, active }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-zinc-950/30 rounded-2xl border border-zinc-900">
       <div>
          <p className="text-xs font-black text-white uppercase tracking-tight">{label}</p>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">{desc}</p>
       </div>
       <button className={`w-10 h-5 rounded-full relative transition-all duration-300 ${active ? 'bg-yellow-500' : 'bg-zinc-800'}`}>
          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
       </button>
    </div>
  );
}

function StatusItem({ label, status, active }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
       <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-green-500' : 'text-zinc-600'}`}>{status}</span>
       </div>
    </div>
  );
}
