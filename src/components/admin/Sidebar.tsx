'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Role } from '@/types';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Database, 
  Settings, 
  LogOut, 
  MessageSquare,
  Calendar,
  ClipboardList,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
  icon: any;
  description: string;
}

const navItems: NavItem[] = [
  { 
    href: '/admin', 
    label: 'Dashboard', 
    roles: ['admin', 'subadmin', 'artist'], 
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  { 
    href: '/admin/bookings', 
    label: 'Booking CRM', 
    roles: ['admin', 'subadmin'], 
    icon: Briefcase,
    description: 'Manage Leads & Events'
  },
  { 
    href: '/admin/invoices', 
    label: 'Invoices', 
    roles: ['admin', 'subadmin'], 
    icon: FileText,
    description: 'Invoice Management'
  },
  { 
    href: '/admin/database', 
    label: 'Database', 
    roles: ['admin'], 
    icon: Database,
    description: 'Central Data Store'
  },
  { 
    href: '/admin/enquiries', 
    label: 'Enquiries', 
    roles: ['admin', 'subadmin'], 
    icon: MessageSquare,
    description: 'Public Leads & Emails'
  },
  { 
    href: '/admin/calendar', 
    label: 'Calendar', 
    roles: ['admin', 'subadmin', 'artist'], 
    icon: Calendar,
    description: 'Dynamic Schedule'
  },
  { 
    href: '/admin/my-bookings', 
    label: 'Total Bookings', 
    roles: ['artist'], 
    icon: ClipboardList,
    description: 'Operational Details'
  },
  { 
    href: '/admin/invites', 
    label: 'Profile Creator', 
    roles: ['admin'], 
    icon: Users,
    description: 'User Management Hub'
  },
  { 
    href: '/admin/manage-website', 
    label: 'Manage Website', 
    roles: ['admin'], 
    icon: Settings,
    description: 'Website Content CMS'
  },
  { 
    href: '/admin/pipeline', 
    label: 'Event Pipeline', 
    roles: ['admin', 'subadmin'], 
    icon: LayoutDashboard,
    description: 'Team Performance'
  },
  { 
    href: '/admin/clients', 
    label: 'Clients DB', 
    roles: ['admin', 'subadmin'], 
    icon: Users,
    description: 'CRM & Network'
  },
  { 
    href: '/admin/artists-database', 
    label: 'Artists DB', 
    roles: ['admin', 'subadmin'], 
    icon: Users,
    description: 'Roster Management'
  },
  { 
    href: '/admin/analytics', 
    label: 'Analytics', 
    roles: ['admin', 'subadmin'], 
    icon: LayoutDashboard,
    description: 'Business Insights'
  },
];

interface AdminSidebarProps {
  role: Role;
  isDbConnected?: boolean;
}

export default function AdminSidebar({ role, isDbConnected = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800/50 flex flex-col relative z-20">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50">
        <Link href="/admin" className="block">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full flex items-center justify-center">
              <img 
                src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png" 
                alt="Company Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-6 text-center px-2">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white leading-tight">
                The Band Company
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3 opacity-80">
                 <div className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_10px_rgba(16,185,129,0.4)]`} />
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{isDbConnected ? 'Systems Live' : 'System Offline'}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 py-8 overflow-y-auto space-y-8 scrollbar-hide">
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Menu</p>
          <nav className="space-y-1">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-zinc-800/60 text-blue-600 dark:text-zinc-100'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-blue-600 dark:text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="active-nav" className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-zinc-300" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/50">
        <button
          onClick={async () => {
            await signOut({ redirect: false });
            router.push('/auth/login');
            router.refresh();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut size={18} className="text-zinc-400 group-hover:text-red-500 transition-colors" />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
