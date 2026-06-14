import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin Dashboard | The Band Company',
  description: 'Administrative dashboard for The Band Company.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/auth/login');
  if (!session.user.isActive) redirect('/auth/login?error=Deactivated');

  let isConnected = false;
  try {
    await connectDB();
    isConnected = mongoose.connection.readyState === 1;
  } catch (error) {
    console.error("DB Connection Error:", error);
  }

  return (
    <AdminShell role={session.user.role} isDbConnected={isConnected} user={session.user}>
      {children}
    </AdminShell>
  );
}
