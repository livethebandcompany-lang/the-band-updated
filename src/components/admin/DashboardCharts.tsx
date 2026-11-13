'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#eab308', '#3b82f6', '#a855f7', '#10b981', '#f43f5e', '#f97316'];

export function LeadSourceChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[260px] w-full mt-4 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 p-6 text-center">
        <p className="text-sm font-medium text-zinc-500">No lead vectors recorded yet</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', color: '#fff' }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SalesPerformanceChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[260px] w-full mt-4 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 p-6 text-center">
        <p className="text-sm font-medium text-zinc-500">No sales performance data logged yet</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="stroke-zinc-200 dark:stroke-zinc-800" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
          />
          <Tooltip 
            cursor={{ fill: 'currentColor', opacity: 0.05 }}
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', color: '#fff' }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
          />
          <Bar 
            dataKey="revenue" 
            fill="#eab308" 
            radius={[6, 6, 0, 0]} 
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueTrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="stroke-zinc-200 dark:stroke-zinc-800" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', color: '#fff' }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#eab308" 
            fillOpacity={1} 
            fill="url(#colorRev)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}