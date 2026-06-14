'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BarChart, Users, Star, IndianRupee, Trophy, TrendingUp } from 'lucide-react';

export default function EventPipelinePage() {
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
      fetchPipelineData();
    }
  }, [status, session]);

  const fetchPipelineData = async () => {
    try {
      const res = await fetch('/api/admin/pipeline');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch pipeline data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Event Pipeline & Team Performance</h1>
        <p className="text-sm text-zinc-500 mt-1">Monitor sales conversions, artist revenues, and client satisfaction.</p>
      </div>

      {/* Satisfaction Overview */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl">
               <Star size={32} className="text-amber-500" />
            </div>
            <div>
               <p className="text-sm font-semibold text-zinc-500">Average Client Satisfaction</p>
               <div className="flex items-end gap-2 mt-1">
                 <p className="text-4xl font-black text-zinc-900 dark:text-white leading-none">
                    {data?.clientSatisfaction?.average?.toFixed(1) || 'N/A'}
                 </p>
                 <span className="text-sm font-medium text-zinc-400 mb-1">/ 5.0</span>
               </div>
            </div>
         </div>
         <div className="text-right">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{data?.clientSatisfaction?.totalReviews || 0}</p>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-1">Total Reviews</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Performance */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <Trophy size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Sales Leaderboard</h3>
          </div>
          
          <div className="space-y-4">
            {data?.salesPerformance?.map((sp: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'}`}>
                    #{i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">{sp.name}</p>
                    <p className="text-xs text-zinc-500">{sp.count} deals closed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{sp.revenue?.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(!data?.salesPerformance || data.salesPerformance.length === 0) && (
               <p className="text-sm text-zinc-500 text-center py-4">No sales data available</p>
            )}
          </div>
        </div>

        {/* Artist Performance */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <TrendingUp size={20} className="text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Artist Revenue Generation</h3>
          </div>
          
          <div className="space-y-4">
            {data?.artistPerformance?.map((ap: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-indigo-500/50 rounded-full" />
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">{ap.artistName || 'Unknown Artist'}</p>
                    <p className="text-xs text-zinc-500">{ap.performances} performances</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">₹{ap.revenueGenerated?.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(!data?.artistPerformance || data.artistPerformance.length === 0) && (
               <p className="text-sm text-zinc-500 text-center py-4">No artist revenue data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
