"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import AdminPageTransition from "@/components/admin/AdminPageTransition";
import { Role } from "@/types";

interface AdminShellProps {
  children: React.ReactNode;
  role: Role;
  isDbConnected: boolean;
  user: any;
}

/**
 * AdminShell isolates all "use client" admin UI (Sidebar + Header)
 * into a single client boundary so the admin/layout.tsx Server Component
 * can import ONE client module instead of two, fixing the Turbopack
 * module factory error caused by multiple client components being
 * statically imported in a server layout.
 */
export default function AdminShell({ children, role, isDbConnected, user }: AdminShellProps) {
  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 overflow-hidden font-merriweather">
      <AdminSidebar role={role} isDbConnected={isDbConnected} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Soft background glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03),transparent_60%)] pointer-events-none" />
        <AdminHeader user={user} />
        <main className="flex-1 overflow-auto p-8 lg:p-10 relative">
          <div className="max-w-7xl mx-auto">
            <AdminPageTransition>
              {children}
            </AdminPageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
