import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  Zap, 
  ArrowUpRight, 
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Music,
  Star
} from 'lucide-react';
import { 
  LeadSourceChart, 
  SalesPerformanceChart, 
  RevenueTrendChart 
} from '@/components/admin/DashboardCharts';
import Link from 'next/link';

async function getDashboardData(userId: string, role: string) {
  await connectDB();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (role === 'artist') {
    const [myBookings, pending, upcoming] = await Promise.all([
      Booking.countDocuments({ artistId: userId }),
      Booking.countDocuments({ artistId: userId, status: 'pending' }),
      Booking.find({ artistId: userId, eventDate: { $gte: today } }).sort({ eventDate: 1 }).limit(3),
    ]);
    return { myBookings, pending, upcoming };
  }

  // Admin / Subadmin Data
  const [
    totalBookings,
    totalUsers,
    pendingBookings,
    revenueStats,
    sourceStats,
    salesStats,
    upcomingEvents,
    recentBookings
  ] = await Promise.all([
    Booking.countDocuments({ archived: false }),
    User.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    
    // Revenue Stats
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { 
        _id: null, 
        total: { $sum: '$totalAmount' },
        net: { $sum: { $add: ['$finalAmount', '$additionalChargesAmount'] } },
        tax: { $sum: '$taxAmount' }
      } }
    ]),

    // Lead Sources
    Booking.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count' } }
    ]),

    // Sales Performance
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: '$salesPerson', revenue: { $sum: '$totalAmount' } } },
      { $project: { name: '$_id', revenue: 1 } }
    ]),

    // Upcoming Events
    Booking.find({ eventDate: { $gte: today }, archived: false })
      .sort({ eventDate: 1 })
      .limit(5),

    // Recent Bookings
    Booking.find({ archived: false })
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  return {
    totalBookings,
    totalUsers,
    pendingBookings,
    totalRevenue: revenueStats[0]?.total || 0,
    netRevenue: revenueStats[0]?.net || 0,
    taxCollected: revenueStats[0]?.tax || 0,
    sourceStats: sourceStats || [],
    salesStats: salesStats || [],
    upcomingEvents: upcomingEvents || [],
    recentBookings: recentBookings || []
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const data = await getDashboardData(session.user.id, session.user.role);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
            Welcome, {session.user.name || 'Artist'} 
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {session.user.role === 'artist' ? 'Your upcoming performance schedule' : 'Overview of your business metrics'}
          </p>
        </div>
        {session.user.role !== 'artist' && (
          <div className="flex items-center gap-3">
            <Link href="/admin/bookings" className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm">
              View Bookings
            </Link>
            <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium transition-all shadow-sm">
              Generate Report
            </button>
          </div>
        )}
      </div>

      {session.user.role === 'artist' ? (
        <div className="space-y-8">
           {/* Artist Stats */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard 
                icon={<Music size={18} />} 
                label="Total Performances" 
                value={(data as any).myBookings || 0} 
                trend="Lifetime career" 
                color="indigo" 
              />
              <StatCard 
                icon={<Star size={18} />} 
                label="Active Lock-ins" 
                value={((data as any).myBookings || 0) - ((data as any).pending || 0)} 
                trend="Confirmed events" 
                color="emerald" 
              />
              <StatCard 
                icon={<Clock size={18} />} 
                label="Pending Syncs" 
                value={(data as any).pending || 0} 
                trend="Awaiting details" 
                color="amber" 
              />
           </div>

           {/* Artist Upcoming Section */}
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Next Performances</h3>
                    <p className="text-sm text-zinc-500 mt-1">Your detailed upcoming itinerary</p>
                 </div>
                 <Link href="/admin/calendar" className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-[0.1em]">
                    View Full Calendar →
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {data.upcoming?.map((event: any, i: number) => (
                   <div key={i} className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] rounded-full group-hover:bg-blue-500/10 transition-all" />
                      
                      <div className="inline-flex px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">
                         {new Date(event.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>

                      <h4 className="text-lg font-bold text-zinc-900 dark:text-white truncate">{event.clientName}</h4>
                      <div className="space-y-3 mt-4">
                         <div className="flex items-center gap-2 text-zinc-500">
                            <Clock size={14} className="shrink-0" />
                            <span className="text-xs font-semibold">{event.startTime} - {event.endTime}</span>
                         </div>
                         <div className="flex items-center gap-2 text-zinc-500">
                            <ArrowUpRight size={14} className="shrink-0" />
                            <span className="text-xs font-semibold">{event.venueName}, {event.city}</span>
                         </div>
                      </div>

                      <div className={`mt-6 inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${event.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                         Status: {event.status}
                      </div>
                   </div>
                 ))}
                 {(!data.upcoming || data.upcoming.length === 0) && (
                   <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50">
                      <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No Performances Scheduled Yet</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard 
              icon={<TrendingUp size={18} />} 
              label="Gross Revenue" 
              value={`₹${data.totalRevenue?.toLocaleString('en-IN')}`} 
              trend="+12.5%"
              color="blue"
            />
            <StatCard 
              icon={<Clock size={18} />} 
              label="Pending Deals" 
              value={data.pendingBookings} 
              trend="Action required"
              color="amber"
            />
            <StatCard 
              icon={<ShieldCheck size={18} />} 
              label="Confirmed Leads" 
              value={data.totalBookings} 
              trend="Active ecosystem"
              color="emerald"
            />
            <StatCard 
              icon={<CreditCard size={18} />} 
              label="GST Collected" 
              value={`₹${data.taxCollected?.toLocaleString('en-IN')}`} 
              trend="Fiscal status"
              color="indigo"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Performance */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <div>
                     <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Sales Performance</h3>
                     <p className="text-sm text-zinc-500 mt-0.5">Revenue attribution by personnel</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-blue-500 border border-zinc-100 dark:border-zinc-800 text-zinc-400">
                     <Zap size={16} />
                  </div>
               </div>
               <SalesPerformanceChart data={data.salesStats || []} />
            </div>

            {/* Lead Sources */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <div>
                     <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Lead Vectors</h3>
                     <p className="text-sm text-zinc-500 mt-0.5">Discovery channel analytics</p>
                  </div>
               </div>
               <LeadSourceChart data={data.sourceStats || []} />
               <div className="mt-6 space-y-3">
                  {(data.sourceStats || []).slice(0, 3).map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm font-medium">
                       <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${i===0?'bg-blue-500':i===1?'bg-indigo-500':'bg-violet-500'}`} />
                          <span className="text-zinc-600 dark:text-zinc-400">{s.name}</span>
                       </div>
                       <span className="text-zinc-900 dark:text-zinc-200">{s.value} leads</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Upcoming Events */}
             <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Operations Queue</h3>
                      <p className="text-sm text-zinc-500 mt-0.5">Next 5 scheduled performances</p>
                   </div>
                   <Link href="/admin/calendar" className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                      <ChevronRight size={18} />
                   </Link>
                </div>
                
                <div className="space-y-3">
                   {data.upcomingEvents?.map((event: any, i: number) => (
                     <div key={i} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 rounded-xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-lg flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-sm shadow-zinc-200/50 dark:shadow-none">
                           <p className="text-[10px] font-bold text-red-500 uppercase leading-none">{new Date(event.eventDate).toLocaleString('default', { month: 'short' })}</p>
                           <p className="text-lg font-semibold text-zinc-900 dark:text-white leading-none mt-1">{new Date(event.eventDate).getDate()}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{event.clientName}</p>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-zinc-500 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded shadow-sm">{event.eventType}</span>
                              <span className="text-xs font-medium text-zinc-500">{event.city}</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-semibold text-zinc-900 dark:text-white">₹{(event.totalAmount || 0).toLocaleString()}</p>
                           <div className={`mt-1 text-xs font-medium ${event.paymentStatus === 'paid' ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}`}>
                              {event.paymentStatus}
                           </div>
                        </div>
                     </div>
                   ))}
                   {(!data.upcomingEvents || data.upcomingEvents.length === 0) && (
                     <div className="py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm font-medium text-zinc-500">No upcoming events</p>
                     </div>
                   )}
                </div>
             </div>

             {/* Recent Bookings */}
             <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Recent Activity</h3>
                      <p className="text-sm text-zinc-500 mt-0.5">Latest lead acquisition</p>
                   </div>
                </div>
                
                <div className="space-y-3">
                   {data.recentBookings?.map((booking: any, i: number) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-10 bg-blue-500/20 rounded-full" />
                           <div>
                              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{booking.clientName}</p>
                              <p className="text-xs text-zinc-500 font-medium mt-0.5 capitalize">{booking.source}</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <p className="text-xs font-medium text-zinc-400">Handled by</p>
                           <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">{booking.salesPerson}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: any) {
  const colorMap: any = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 p-6 rounded-2xl transition-all shadow-sm hover:shadow-md dark:shadow-none relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="px-2 py-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 rounded-md">
           <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{trend}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <p className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1 uppercase tracking-tight">{value}</p>
      </div>
    </div>
  );
}
