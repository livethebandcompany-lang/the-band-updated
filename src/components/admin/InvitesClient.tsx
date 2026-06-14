'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CreateInviteModal from './CreateInviteModal';

interface Invite {
  _id: string;
  code: string;
  role: string;
  allowedEmail: string;
  expiresAt: string;
  isUsed: boolean;
  createdBy: { name: string };
}

export default function InvitesClient({ initialInvites }: { initialInvites: Invite[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRefresh = () => {
    router.refresh();
  };

  const getRoleColor = (role: string) => {
    switch(role.toLowerCase()) {
      case 'admin': return 'text-yellow-500';
      case 'subadmin': return 'text-pink-500';
      case 'artist': return 'text-purple-500';
      case 'sales_executive': return 'text-blue-500';
      default: return 'text-zinc-500';
    }
  };

  const revokeInvite = async (id: string, isUsed: boolean) => {
    const action = isUsed ? 'permanently delete' : 'revoke';
    if (!confirm(`Are you sure you want to ${action} this invite code?`)) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/invite?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete invite');
      
      toast.success(isUsed ? 'Invite deleted successfully' : 'Invite revoked successfully');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Profile Creator</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Issue Secure Admin Access Tokens</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
        >
          <Ticket size={18} />
          Generate New Token
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialInvites.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 italic">
             No active invites found.
          </div>
        ) : (
          initialInvites.map((invite) => (
            <div key={invite._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${invite.isUsed ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                  {invite.isUsed ? 'Used' : 'Active'}
                </span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                   EXP: {new Date(invite.expiresAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Secure Admin Token</p>
                <code className={`text-2xl font-black tracking-[0.2em] font-mono ${getRoleColor(invite.role)}`}>{invite.code}</code>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Allowed Email:</span>
                  <span className="text-zinc-300 font-medium truncate ml-2">{invite.allowedEmail}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Role:</span>
                  <span className="text-zinc-300 font-bold uppercase tracking-wider">{invite.role}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Created By:</span>
                  <span className="text-zinc-300 font-medium">{invite.createdBy?.name || 'Admin'}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                {!invite.isUsed ? (
                  <button 
                    onClick={() => revokeInvite(invite._id, false)}
                    disabled={deletingId === invite._id}
                    className="text-[10px] font-bold text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Trash2 size={12} />
                    {deletingId === invite._id ? 'Revoking...' : 'Revoke Invite'}
                  </button>
                ) : (
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Already used</span>
                )}
                <button 
                  onClick={() => revokeInvite(invite._id, true)}
                  disabled={deletingId === invite._id}
                  className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                >
                  <Trash2 size={12} />
                  {deletingId === invite._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <CreateInviteModal 
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
