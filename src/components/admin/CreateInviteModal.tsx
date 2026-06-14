'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BiX, BiShieldQuarter, BiEnvelope, BiUserCircle, BiCheckCircle } from 'react-icons/bi';

interface CreateInviteModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateInviteModal({ onClose, onSuccess }: CreateInviteModalProps) {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    allowedEmail: '',
    role: 'artist',
    otp: '',
  });

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/invite/request-otp', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Verification OTP sent to your email');
      setStep('verify');
    } catch (err: any) {
      toast.error(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const createInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length !== 6) return toast.error('Please enter 6-digit OTP');
    
    setLoading(true);
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Invite code created and sent successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white">
      <div className="bg-[#0f0f0f] border border-[#27272a] rounded-2xl w-full max-w-md overflow-hidden transform transition-all shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
          <h3 className="text-xl font-black uppercase tracking-tighter">Generate Profile Token</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <BiX size={24} className="text-zinc-400" />
          </button>
        </div>

        <div className="p-6">
          {step === 'request' ? (
            <form onSubmit={requestOtp} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Target Email Address</label>
                  <div className="relative">
                    <BiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="email"
                      required
                      value={formData.allowedEmail}
                      onChange={(e) => setFormData({ ...formData, allowedEmail: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-yellow-500/50 outline-none transition-all"
                      placeholder="artist@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Assign Role</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'artist', label: 'Artist', icon: BiUserCircle, desc: 'Performance & Profile access', color: 'purple' },
                      { id: 'subadmin', label: 'Sub-Admin', icon: BiShieldQuarter, desc: 'Full CRM & Enquiry access', color: 'pink' },
                      { id: 'sales_executive', label: 'Sales Executive', icon: BiCheckCircle, desc: 'Leads & Booking focus', color: 'red' }
                    ].map((role) => {
                      const isActive = formData.role === role.id;
                      const roleColor = role.color;
                      
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: role.id })}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                            isActive 
                              ? `bg-${roleColor}-500/10 border-${roleColor}-500/50 text-white` 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className={`p-2 rounded-lg transition-colors ${
                            isActive ? `bg-${roleColor}-500 text-white` : 'bg-zinc-900 text-zinc-500 group-hover:text-zinc-300'
                          }`}>
                            <role.icon size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{role.label}</p>
                            <p className="text-[10px] opacity-50 font-medium">{role.desc}</p>
                          </div>
                          {isActive && (
                            <div className={`ml-auto w-2.5 h-2.5 rounded-full bg-${roleColor}-500 shadow-[0_0_12px_rgba(0,0,0,0.5)] border border-black/20`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                 <p className="text-[10px] text-yellow-500/60 font-medium leading-relaxed italic">
                   Note: For security, you will receive a verification code on your admin email before the invite is issued.
                 </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Requesting OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={createInvite} className="space-y-6 py-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                  <BiShieldQuarter size={32} />
                </div>
                <h4 className="text-lg font-bold mb-2">Verify Identity</h4>
                <p className="text-sm text-zinc-400">
                  Enter the 6-digit code sent to your email to authorize this invitation.
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                required
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center text-3xl font-black tracking-[0.5em] text-yellow-500 focus:border-yellow-500 outline-none"
                placeholder="000000"
              />

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('request')} className="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-medium">Back</button>
                <button
                  type="submit"
                  disabled={loading || formData.otp.length !== 6}
                  className="flex-[2] bg-yellow-500 hover:bg-yellow-400 text-black font-black p-4 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Confirm & Create'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
