'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { BiUserCheck, BiUserMinus } from 'react-icons/bi';
import UserActionModal from './UserActionModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersList({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'subadmin': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'artist': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const quickToggleStatus = async (user: User) => {
    setLoadingId(user._id);
    try {
      const res = await fetch('/api/users/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user._id, isActive: !user.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {initialUsers.map((user) => (
                <tr key={user._id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getRoleStyles(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => quickToggleStatus(user)}
                      disabled={loadingId === user._id}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
                        user.isActive 
                          ? 'text-green-500 hover:bg-green-500/10' 
                          : 'text-red-500 hover:bg-red-500/10'
                      } ${loadingId === user._id ? 'opacity-50 animate-pulse' : ''}`}
                      title={user.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-xs font-medium uppercase tracking-tight">{user.isActive ? 'Active' : 'Inactive'}</span>
                      {user.isActive ? <BiUserMinus size={14} className="ml-1 opacity-40" /> : <BiUserCheck size={14} className="ml-1 opacity-40" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors px-3 py-1 bg-yellow-500/10 rounded-md border border-yellow-500/20"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <UserActionModal
          user={{
            id: selectedUser._id,
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
            isActive: selectedUser.isActive,
          }}
          onClose={() => setSelectedUser(null)}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
}
