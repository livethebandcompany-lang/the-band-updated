'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Activity, PieChart as PieChartIcon, Target, Users, DollarSign, BarChart3 } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session?.user && !['admin', 'subadmin'].includes(session.user.role)) {
      router.push('/admin');
    } else if (status === 'authenticated') {
      fetchAnalyticsData();
    }
  }, [status, session]);

  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch analytics data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Business Analytics</h1>
        <p className="text-sm text-zinc-500 mt-1">Deep insights into revenue, conversions, and profitability.</p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Best Month" 
          value={data?.bestMonth?.month || 'N/A'} 
          subtitle={`₹${data?.bestMonth?.revenue?.toLocaleString()}`}
          icon={<TrendingUp size={20} className="text-emerald-500" />}
          color="emerald"
        />
        <MetricCard 
          title="Repeat Customers" 
          value={`${data?.repeatCustomerPercentage || 0}%`} 
          subtitle="Of total bookings"
          icon={<Users size={20} className="text-blue-500" />}
          color="blue"
        />
        <MetricCard 
          title="Top Lead Source" 
          value={data?.topSources?.[0]?.source || 'N/A'} 
          subtitle="Highest converting channel"
          icon={<Target size={20} className="text-indigo-500" />}
          color="indigo"
        />
        <MetricCard 
          title="Most Profitable Event" 
          value={data?.topEventTypes?.[0]?.type || 'N/A'} 
          subtitle="Highest revenue generator"
          icon={<DollarSign size={20} className="text-amber-500" />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Growth (Simplified view without heavy chart lib) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <Activity size={20} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Monthly Revenue (Last 12M)</h3>
          </div>
          <div className="h-64 flex items-end gap-2 mt-4">
            {data?.monthlyRevenue?.map((m: any, i: number) => {
              const maxRev = Math.max(...(data.monthlyRevenue.map((mr: any) => mr.revenue) || [1]));
              const heightPct = Math.max(10, (m.revenue / maxRev) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group relative">
                   <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-xs py-1 px-2 rounded font-medium whitespace-nowrap z-10 pointer-events-none">
                      ₹{m.revenue.toLocaleString()}
                   </div>
                   <div className="w-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors rounded-t-sm" style={{ height: `${heightPct}%` }}></div>
                   <span className="text-[10px] font-medium text-zinc-500 truncate w-full text-center">{m.month.split(' ')[0]}</span>
                </div>
              );
            })}
            {(!data?.monthlyRevenue || data.monthlyRevenue.length === 0) && (
              <div className="w-full h-full flex items-center justify-center text-sm text-zinc-500">No revenue data</div>
            )}
          </div>
        </div>

        {/* Highest ROI Ads */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <PieChartIcon size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Ad Platform Performance</h3>
          </div>
          <div className="space-y-4">
            {data?.adSources?.map((ad: any, i: number) => (
              <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                   <p className="font-semibold text-zinc-900 dark:text-white capitalize">{ad.adPlatform.replace('_', ' ')}</p>
                   <p className="text-xs font-medium text-zinc-500">{ad.leads} leads converted</p>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{ad.revenue?.toLocaleString()}</p>
              </div>
            ))}
            {(!data?.adSources || data.adSources.length === 0) && (
              <p className="text-sm text-zinc-500 text-center py-4">No ad conversion data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Artist Profitability */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <BarChart3 size={20} className="text-indigo-500" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Artist Profitability</h3>
               <p className="text-sm text-zinc-500 mt-0.5">Revenue generated vs base cost</p>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-semibold uppercase tracking-wider">
                  <tr>
                     <th className="px-4 py-3 rounded-l-lg">Artist Name</th>
                     <th className="px-4 py-3 text-right">Performances</th>
                     <th className="px-4 py-3 text-right">Revenue Generated</th>
                     <th className="px-4 py-3 text-right rounded-r-lg">Estimated Profit</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {data?.artistProfitability?.map((ap: any, i: number) => (
                     <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-4 font-medium text-zinc-900 dark:text-white">{ap.artistName || 'Unknown'}</td>
                        <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-400">{ap.performances}</td>
                        <td className="px-4 py-4 text-right text-zinc-900 dark:text-white font-semibold">₹{ap.revenueGenerated?.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">₹{ap.estimatedProfit?.toLocaleString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {(!data?.artistProfitability || data.artistProfitability.length === 0) && (
               <div className="py-8 text-center text-zinc-500 text-sm border border-zinc-100 dark:border-zinc-800 mt-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                  No artist profitability data found.
               </div>
            )}
         </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
    blue: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
    indigo: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
    amber: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-zinc-500">{title}</p>
        <div className={`p-2 rounded-xl border ${colors[color]}`}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-black text-zinc-900 dark:text-white capitalize">{value}</p>
        <p className="text-xs font-medium text-zinc-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
