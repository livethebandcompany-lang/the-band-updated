'use client';

import NotificationBell from './NotificationBell';
import GlobalSearch from './GlobalSearch';

export default function AdminHeader({ user }: { user: any }) {
  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800/50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-8 flex-1 mr-4">
        {/* Global Search Bar — fully functional */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Notifications */}
        <NotificationBell />

        <div className="h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800 relative shadow-[inset_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-none" />

        {/* User Profile */}
        <div className="flex items-center gap-3 group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 p-1.5 -mx-1.5 rounded-lg transition-colors">
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-none">{user.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5 capitalize">{user.role}</p>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {user.name?.charAt(0)}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#09090b]" />
          </div>
        </div>
      </div>
    </header>
  );
}
