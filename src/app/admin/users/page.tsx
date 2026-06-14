import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import UsersList from '@/components/admin/UsersList';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  
  // Protect the route
  if (!session || session.user.role !== 'admin') {
    redirect('/admin');
  }

  await connectDB();
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  // Convert Mongoose docs to plain objects for the client
  const plainUsers = users.map(user => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-sm text-zinc-500 font-medium">Manage artist and sub-admin accounts.</p>
        </div>
      </div>

      <UsersList initialUsers={plainUsers} />
    </div>
  );
}
