'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell,
  X,
  Check,
  Trash2,
  ExternalLink,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Music,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'inquiry' | 'payment' | 'booking' | 'system' | 'event_reminder';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ─── Icon + colour per notification type ────────────────────────────────────
const typeConfig: Record<
  string,
  {
    icon: React.ElementType;
    bg: string;
    iconColor: string;
    dot: string;
    badge: string;
    label: string;
  }
> = {
  payment: {
    icon: CreditCard,
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-500',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    label: 'Payment',
  },
  booking: {
    icon: CheckCircle,
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    iconColor: 'text-blue-500',
    dot: 'bg-blue-500',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    label: 'Booking',
  },
  event_reminder: {
    icon: Calendar,
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconColor: 'text-amber-500',
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    label: 'Reminder',
  },
  inquiry: {
    icon: AlertCircle,
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    iconColor: 'text-purple-500',
    dot: 'bg-purple-500',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    label: 'Enquiry',
  },
  system: {
    icon: Music,
    bg: 'bg-zinc-500/10 dark:bg-zinc-500/15',
    iconColor: 'text-zinc-400',
    dot: 'bg-zinc-400',
    badge: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400',
    label: 'System',
  },
};

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ─── Filter tabs ─────────────────────────────────────────────────────────────
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'payment', label: 'Payments' },
  { key: 'booking', label: 'Bookings' },
  { key: 'event_reminder', label: 'Reminders' },
] as const;
type FilterKey = (typeof FILTERS)[number]['key'];

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  const fetchNotifications = useCallback(async (showRefreshAnim = false) => {
    try {
      if (showRefreshAnim) setIsRefreshing(true);
      else setLoading(true);
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch on mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Mark all read when opened
  const handleOpen = async () => {
    const wasOpen = open;
    setOpen(!wasOpen);
    if (!wasOpen && unreadCount > 0) {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const deleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error('Failed to remove notification');
    } finally {
      setDeletingId(null);
    }
  };

  const clearAll = async () => {
    try {
      await fetch('/api/notifications?all=true', { method: 'DELETE' });
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  const handleNavigate = (link?: string) => {
    if (link) {
      setOpen(false);
      router.push(link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell Button ─────────────────────────────────────────────────── */}
      <button
        id="notification-bell-btn"
        onClick={handleOpen}
        className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
        aria-label="Open notifications"
      >
        <Bell size={18} className={open ? 'text-blue-500' : ''} />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-[#09090b] text-[9px] font-black text-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {/* Idle dot */}
        {unreadCount === 0 && (
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 border border-white dark:border-[#09090b]" />
        )}
      </button>

      {/* ── Dropdown Panel ──────────────────────────────────────────────── */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2.5 w-[360px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 z-50 overflow-hidden flex flex-col"
          style={{ maxHeight: '520px' }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                <Bell size={13} className="text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500 text-[10px] font-bold text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchNotifications(true)}
                title="Refresh"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/60 overflow-x-auto bg-zinc-50/80 dark:bg-zinc-900/50">
            {FILTERS.map((f) => {
              const count = f.key === 'all' ? notifications.length : notifications.filter(n => n.type === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    filter === f.key
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {f.label}
                  {count > 0 && (
                    <span className={`text-[9px] px-1 rounded-full font-bold ${filter === f.key ? 'bg-white/20 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1 divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {loading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-zinc-200 dark:border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Loading…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-14 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto">
                  <Check size={18} className="text-zinc-300 dark:text-zinc-600" />
                </div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">All caught up!</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {filter === 'all' ? 'No notifications yet' : `No ${FILTERS.find(f => f.key === filter)?.label.toLowerCase()} yet`}
                </p>
              </div>
            ) : (
              filtered.map((n) => {
                const cfg = typeConfig[n.type] || typeConfig.system;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n._id}
                    onClick={() => handleNavigate(n.link)}
                    className={`flex items-start gap-3 px-4 py-3.5 group transition-all ${
                      n.link ? 'cursor-pointer' : ''
                    } ${
                      !n.isRead
                        ? 'bg-blue-50/40 dark:bg-blue-500/5 hover:bg-blue-50/80 dark:hover:bg-blue-500/10'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                    }`}
                  >
                    {/* Type Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${cfg.bg}`}>
                      <Icon size={14} className={cfg.iconColor} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                            {!n.isRead && (
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                            )}
                          </div>
                          <p className={`text-xs font-semibold leading-tight ${n.isRead ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                            {n.title}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                          {n.link && (
                            <ExternalLink
                              size={10}
                              className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors"
                            />
                          )}
                          <button
                            onClick={(e) => deleteOne(n._id, e)}
                            disabled={deletingId === n._id}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-red-500 text-zinc-400 transition-all disabled:opacity-50"
                            title="Remove"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock size={9} className="text-zinc-300 dark:text-zinc-600" />
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Panel Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/50">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''} •{' '}
                {unreadCount > 0 ? `${unreadCount} unread` : 'all read'}
              </span>
              <button
                onClick={() => fetchNotifications(true)}
                className="text-[10px] font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <RefreshCw size={9} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
