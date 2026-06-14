'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BiTrash, BiShieldQuarter, BiX, BiUserCheck, BiUserMinus, BiCalendarEvent, BiCheckCircle } from 'react-icons/bi';

interface UserActionModalProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  onClose: () => void;
  onRefresh: () => void;
}

export default function UserActionModal({ user, onClose, onRefresh }: UserActionModalProps) {
  const [step, setStep] = useState<'manage' | 'otp' | 'assign'>('manage');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);

  useEffect(() => {
    if (step === 'assign') {
      fetchBookings();
    }
  }, [step]);

  const fetchBookings = async () => {
    setFetchingBookings(true);
    try {
      const res = await fetch('/api/bookings?limit=100');
      const data = await res.json();
      // Filter out bookings already assigned to this artist
      setBookings(data.bookings.filter((b: any) => b.artistId?._id !== user.id));
    } catch (err) {
      toast.error('Failed to fetch bookings');
    } finally {
      setFetchingBookings(false);
    }
  };

  const assignToBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, artistId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Artist assigned successfully');
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err: any) {
      toast.error(err.message || 'Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user.id, isActive: !user.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success(data.message);
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/delete/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Deletion OTP sent to your email');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message || 'Failed to request deletion');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (otp.length !== 6) return toast.error('Please enter 6-digit OTP');
    setLoading(true);
    try {
      const res = await fetch('/api/users/delete/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user.id, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('User deleted successfully');
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white">
      <div className="bg-[#0f0f0f] border border-[#27272a] rounded-2xl w-full max-w-lg overflow-hidden transform transition-all shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
          <div>
            <h3 className="text-xl font-bold">Manage User</h3>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <BiX size={24} className="text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {step === 'manage' && (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-sm text-zinc-400 mb-1">Account Info</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 rounded border border-zinc-700 mt-1 inline-block">
                      {user.role}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${user.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Quick Actions</h4>
                <button
                  onClick={toggleStatus}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all font-medium disabled:opacity-50 ${
                    user.isActive 
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20' 
                      : 'bg-green-600/10 hover:bg-green-600/20 text-green-500 border-green-600/20'
                  }`}
                >
                  {user.isActive ? <BiUserMinus size={20} /> : <BiUserCheck size={20} />}
                  {loading ? 'Updating...' : user.isActive ? 'Deactivate Account' : 'Activate Account'}
                </button>

                {user.role === 'artist' && (
                  <button
                    onClick={() => setStep('assign')}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 p-3 rounded-xl border border-blue-600/20 transition-all font-medium"
                  >
                    <BiCalendarEvent size={20} />
                    Assign to Bookings
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-[#27272a]">
                <h4 className="text-xs font-bold text-red-500 mb-4 uppercase tracking-widest opacity-60">Danger Zone</h4>
                <button
                  onClick={requestDelete}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 p-3 rounded-xl border border-red-600/20 transition-all font-medium disabled:opacity-50"
                >
                  <BiTrash size={20} />
                  {loading ? 'Processing...' : 'Delete Account Permanently'}
                </button>
              </div>
            </div>
          )}

          {step === 'assign' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep('manage')} className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400">
                  <BiX size={20} />
                </button>
                <h4 className="font-bold">Assign {user.name} to Bookings</h4>
              </div>

              <div className="space-y-2">
                {fetchingBookings ? (
                  <div className="py-12 text-center text-zinc-500">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                    No available bookings found.
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking._id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-between group">
                      <div>
                        <p className="text-sm font-bold">{booking.clientName}</p>
                        <p className="text-[10px] text-zinc-500">{new Date(booking.eventDate).toLocaleDateString()} • {booking.city}</p>
                      </div>
                      <button
                        onClick={() => assignToBooking(booking._id)}
                        disabled={loading}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-blue-500 rounded-lg text-white transition-all disabled:opacity-50"
                      >
                        <BiCheckCircle size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-600/20">
                <BiShieldQuarter size={32} />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Verify Deletion</h4>
                <p className="text-sm text-zinc-400">
                  Enter the 6-digit code sent to your email to confirm the permanent deletion of <strong>{user.name}</strong>.
                </p>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center text-3xl font-black tracking-[0.5em] text-red-500 focus:border-red-600 outline-none"
                placeholder="000000"
              />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('manage')} className="flex-1 bg-zinc-900 p-3 rounded-xl border border-zinc-800 font-medium">Cancel</button>
                <button onClick={confirmDelete} disabled={loading || otp.length !== 6} className="flex-[2] bg-red-600 p-3 rounded-xl font-bold disabled:opacity-50">Confirm Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
