'use client';

import { useState } from 'react';
import { 
  X, MapPin, Clock, CreditCard, Banknote, 
  ExternalLink, CheckCircle2, AlertCircle,
  Users, Calendar, Info, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface TeamMember {
  name: string;
  role: string;
}

interface ArtistBookingDetailModalProps {
  booking: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ArtistBookingDetailModal({ booking, onClose, onUpdate }: ArtistBookingDetailModalProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actualEndTime, setActualEndTime] = useState(booking.endTime || '');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: '', role: '' }]);

  const addMember = () => setTeamMembers([...teamMembers, { name: '', role: '' }]);
  const removeMember = (index: number) => setTeamMembers(teamMembers.filter((_, i) => i !== index));
  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...teamMembers];
    newMembers[index][field] = value;
    setTeamMembers(newMembers);
  };

  const handleCompleteShow = async () => {
    if (!actualEndTime) return toast.error('Please specify the actual end time');
    if (teamMembers.some(m => !m.name || !m.role)) return toast.error('Please fill in all team member details');

    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking._id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualEndTime,
          teamMembers: teamMembers.filter(m => m.name && m.role)
        })
      });

      if (res.ok) {
        toast.success('Performance officially logged as completed!');
        onUpdate();
        onClose();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to sync completion report');
      }
    } catch (err) {
      toast.error('System synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                booking.status === 'confirmed' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}>
                {booking.status}
              </span>
              <span className="text-zinc-600 font-bold">•</span>
              <span className="text-sm font-bold text-zinc-400 italic">#{booking._id.slice(-6).toUpperCase()}</span>
            </div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{booking.clientName}</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-zinc-800 rounded-2xl transition-colors text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <AnimatePresence mode="wait">
            {!isCompleting ? (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Core Specs Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  <DetailItem icon={<Calendar size={14}/>} label="Performance Date" value={new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} />
                  <DetailItem icon={<Clock size={14}/>} label="Time Slot" value={`${booking.startTime} - ${booking.endTime}`} />
                  <DetailItem icon={<Info size={14}/>} label="Setup Type" value={booking.performanceType.replace('_', ' ')} />
                  <DetailItem icon={booking.paymentStatus === 'paid' ? <CreditCard size={14}/> : <AlertCircle size={14}/>} label="Finance Status" value={booking.paymentStatus === 'paid' ? 'FUNDED & SECURED' : 'PAYMENT PENDING'} color={booking.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'} />
                  <DetailItem icon={<Users size={14}/>} label="Nature of Event" value={booking.eventType} />
                </div>

                {/* Location Card */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Venue Deployment</p>
                        <h4 className="text-xl font-bold text-white italic truncate max-w-[300px]">{booking.venueName}</h4>
                        <p className="text-sm font-medium text-zinc-400 mt-1">{booking.fullAddress || booking.city}</p>
                      </div>
                    </div>
                  </div>
                  
                  {booking.googleMapsLink && (
                    <a 
                      href={booking.googleMapsLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-zinc-200 text-black rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl"
                    >
                      Launch Navigation
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>

                {/* Billed Information */}
                {booking.billingName && (
                   <div className="space-y-3">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Administrative Contact</p>
                      <div className="p-5 border border-zinc-800 rounded-3xl flex items-center justify-between">
                         <div>
                            <p className="text-sm font-bold text-zinc-200">{booking.billingName}</p>
                            <p className="text-xs text-zinc-500 mt-1">{booking.clientPhone}</p>
                         </div>
                         <div className="p-3 bg-zinc-800 rounded-2xl text-zinc-400">
                            <Info size={16} />
                         </div>
                      </div>
                   </div>
                )}

                {/* Footer Action */}
                {booking.status !== 'completed' && (
                  <button 
                    onClick={() => setIsCompleting(true)}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-emerald-600/20 flex items-center justify-center gap-3"
                  >
                    Mark Transformation Complete
                    <CheckCircle2 size={18} />
                  </button>
                )}

                {booking.completionReport && (
                   <div className="p-6 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-3xl">
                      <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Performance Logged</p>
                      <div className="space-y-2">
                         <p className="text-sm text-zinc-400">Actual End: <span className="text-white font-bold">{booking.completionReport.actualEndTime}</span></p>
                         <p className="text-sm text-zinc-400">Team Size: <span className="text-white font-bold">{booking.completionReport.teamMembers.length} Members</span></p>
                      </div>
                   </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="completion"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs not-italic">✓</span>
                    End of Show Report
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Actual End Time</label>
                    <input 
                      type="time" 
                      value={actualEndTime}
                      onChange={(e) => setActualEndTime(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Deployment Team</label>
                      <button onClick={addMember} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400">+ Add Personnel</button>
                    </div>
                    
                    <div className="space-y-3">
                      {teamMembers.map((member, idx) => (
                        <div key={idx} className="flex gap-3">
                          <input 
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => updateMember(idx, 'name', e.target.value)}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                          />
                          <input 
                            placeholder="Role (e.g. Vocalist)"
                            value={member.role}
                            onChange={(e) => updateMember(idx, 'role', e.target.value)}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                          />
                          {teamMembers.length > 1 && (
                            <button onClick={() => removeMember(idx)} className="p-3 bg-zinc-800 rounded-2xl text-zinc-500 hover:text-red-500 transition-colors">
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsCompleting(false)}
                    className="flex-1 py-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-black uppercase text-xs tracking-widest rounded-3xl transition-all"
                  >
                    Back to Details
                  </button>
                  <button 
                    onClick={handleCompleteShow}
                    disabled={loading}
                    className="flex-[2] py-5 bg-white hover:bg-zinc-200 text-black font-black uppercase text-xs tracking-widest rounded-3xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    Sync Completion Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function DetailItem({ icon, label, value, color = 'text-white' }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className={`text-sm font-bold truncate ${color}`}>{value}</p>
    </div>
  );
}
