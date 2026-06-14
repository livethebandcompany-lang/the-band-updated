'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  BiX, BiUser, BiPhone, BiEnvelope, BiCalendar,
  BiTime, BiMap, BiWallet, BiLoaderAlt,
  BiChevronRight, BiChevronLeft,
  BiCheckCircle, BiCopy, BiLinkAlt,
  BiBarChartAlt, BiInfoCircle,
  BiHomeHeart, BiCheckSquare, BiSquare, BiPlus, BiMinus
} from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from './CustomSelect';

interface CreateBookingModalProps {
  onClose: () => void;
  onRefresh: () => void;
  isRepeatBooking?: boolean;
  prefillData?: any;
}

const POLL_INTERVAL_MS = 3000;
const COUNTDOWN_SECONDS = 600;

type ModalStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function CreateBookingModal({ onClose, onRefresh, isRepeatBooking = false, prefillData = null }: CreateBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<ModalStep>(isRepeatBooking ? 2 as ModalStep : 1 as ModalStep);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentTimedOut, setPaymentTimedOut] = useState(false);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessedRef = useRef(false);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientAltPhone: '',
    clientEmail: '',
    clientInstagram: '',
    companyName: '',
    billingName: '',
    eventType: 'wedding',
    performanceType: 'solo',
    eventDate: '',
    startTime: '19:00',
    endTime: '22:00',
    durationMinutes: 180,
    venueName: '',
    cityPreset: 'mumbai',
    city: 'Mumbai',
    fullAddress: '',
    googleMapsLink: '',
    stayRequired: false,
    soundIncluded: false,
    quotedAmount: '',
    finalAmount: '',
    taxEnabled: false,
    additionalChargesItems: '',
    additionalChargesAmount: '',
    paymentMode: 'upi',
    source: 'instagram',
    campaignName: '',
    salesPerson: 'unassigned',
    otherSalesPerson: '',
    referralName: '',
    notes: '',
  });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [extraCharges, setExtraCharges] = useState([{ item: '', amount: '' }]);
  const [execOptions, setExecOptions] = useState<{value: string, label: string}[]>([
    {value:'unassigned',label:'Unassigned'},
    {value:'other',label:'Other (Specify)'}
  ]);

  useEffect(() => {
    fetch('/api/users/executives')
      .then(r => r.ok ? r.json() : [])
      .then(users => {
        if (Array.isArray(users)) {
          const dynamicOps = users.map((u: any) => ({ value: u.name, label: u.name }));
          setExecOptions([
            {value: 'unassigned', label: 'Unassigned'},
            ...dynamicOps,
            {value: 'other', label: 'Other (Specify)'}
          ]);
        }
      })
      .catch(console.error);
  }, []);

  const updateCharge = (index: number, field: 'item' | 'amount', value: string) => {
    const newCh = [...extraCharges];
    newCh[index][field] = value;
    setExtraCharges(newCh);
  };

  useEffect(() => {
    if (isRepeatBooking && prefillData) {
      setFormData(prev => ({
        ...prev,
        clientName: prefillData.clientName || '',
        clientPhone: prefillData.clientPhone || '',
        clientEmail: prefillData.clientEmail || '',
        companyName: prefillData.companyName || '',
        billingName: prefillData.billingName || '',
        city: prefillData.city || '',
        cityPreset: 'other'
      }));
    }
  }, [isRepeatBooking, prefillData]);

  useEffect(() => {
    if (isRepeatBooking) return;
    if (formData.clientName.length < 3 && formData.clientPhone.length < 4) {
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const q = formData.clientName || formData.clientPhone;
        const res = await fetch(`/api/clients/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
           const data = await res.json();
           setSearchResults(data);
           setShowDropdown(data.length > 0);
        }
      } catch (err) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [formData.clientName, formData.clientPhone, isRepeatBooking]);

  const selectClient = (client: any) => {
    setFormData(prev => ({
      ...prev,
      clientName: client.clientName || '',
      clientPhone: client.clientPhone || '',
      clientEmail: client.clientEmail || '',
      companyName: client.companyName || '',
      billingName: client.billingName || '',
      city: client.city || '',
      cityPreset: 'other'
    }));
    setShowDropdown(false);
    toast.success('Client CRM profile loaded!');
  };

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const [startH, startM] = formData.startTime.split(':').map(Number);
      const [endH, endM] = formData.endTime.split(':').map(Number);
      const start = new Date(2000, 0, 1, startH, startM);
      const endTime = new Date(2000, 0, 1, endH, endM);
      let end = endTime;
      if (end < start) end = new Date(2000, 0, 2, endH, endM);
      if (end < start) end = new Date(2000, 0, 2, endH, endM);
      const diffMs = end.getTime() - start.getTime();
      setFormData(prev => ({ ...prev, durationMinutes: Math.floor(diffMs / 60000) }));
    }
  }, [formData.startTime, formData.endTime]);

  useEffect(() => {
    if (formData.clientName && !formData.billingName) {
      setFormData(prev => ({ ...prev, billingName: prev.clientName }));
    }
  }, [formData.clientName]);

  const calculateExtraTotal = () => extraCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  const calculateTax = () => {
    if (!formData.taxEnabled) return 0;
    const base = Number(formData.finalAmount) || 0;
    return Math.round((base + calculateExtraTotal()) * 0.18);
  };

  const calculateTotal = () => {
    const base = Number(formData.finalAmount) || 0;
    return base + calculateExtraTotal() + calculateTax();
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startPolling = useCallback((bookingId: string) => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(pollRef.current!);
          setPaymentTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}/payment-status`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.paymentStatus === 'paid' && !isProcessedRef.current) {
          isProcessedRef.current = true;
          clearInterval(pollRef.current!);
          clearInterval(timerRef.current!);
          setPaymentConfirmed(true);
          onRefresh();
          toast.success('🎉 Payment confirmed!');
        }
      } catch { }
    }, POLL_INTERVAL_MS);
  }, [onRefresh]);

  const handleFinalSave = async (paymentMode: 'upi' | 'cash') => {
    isProcessedRef.current = false;
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salesPerson: formData.salesPerson === 'other' ? formData.otherSalesPerson : formData.salesPerson,
          paymentMode,
          soundIncluded: formData.soundIncluded,
          paymentStatus: 'not_paid',
          status: paymentMode === 'upi' ? 'pending' : 'confirmed',
          expiresAt: paymentMode === 'upi' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
          quotedAmount: Number(formData.quotedAmount),
          finalAmount: Number(formData.finalAmount),
          additionalChargesItems: extraCharges.filter(c => c.item || c.amount).map(c => `${c.item} (₹${c.amount || 0})`).join(', '),
          additionalChargesAmount: calculateExtraTotal(),
          taxAmount: calculateTax(),
          totalAmount: calculateTotal(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCreatedBookingId(data._id);

      if (paymentMode === 'cash') {
        toast.success('Booking confirmed! Payment will be collected offline.');
        onRefresh();
        onClose();
        return;
      }

      const linkRes = await fetch('/api/bookings/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: data._id }),
      });
      const linkData = await linkRes.json();
      if (!linkRes.ok) throw new Error(linkData.error || 'Failed to generate link');

      setPaymentLink(linkData.paymentLink);
      setStep(7); 
      startPolling(data._id);
    } catch (err: any) {
      toast.error(err.message || 'Error processing booking');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (s: number) => {
    if (s === 1) return !!(formData.clientName && formData.clientPhone);
    if (s === 2) return !!(formData.eventDate && formData.startTime);
    if (s === 3) return !!(formData.venueName && formData.city);
    if (s === 4) return !!(formData.quotedAmount && formData.finalAmount);
    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      toast.error('Please fill required fields before proceeding');
      return;
    }
    setStep((prev) => (prev + 1) as ModalStep);
  };
  const prevStep = () => setStep((prev) => (prev - 1) as ModalStep);

  const stepsInfo = [
    { title: 'Identity', icon: BiUser },
    { title: 'Event', icon: BiCalendar },
    { title: 'Location', icon: BiMap },
    { title: 'Financial', icon: BiWallet },
    { title: 'Tracking', icon: BiBarChartAlt },
    { title: 'Review', icon: BiCheckCircle },
  ];

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const copyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied!');
    }
  };

  if (step === 7) {
    const countdownPercent = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
           <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900"><motion.div className="h-full bg-blue-600" initial={{width:0}} animate={{width:`${countdownPercent}%`}} /></div>
           <div className="p-10 text-center flex flex-col items-center gap-6">
             {paymentConfirmed ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <BiCheckCircle size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Payment Success</h2>
                    <p className="text-zinc-500 text-sm mt-1">Booking is now confirmed</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-sm text-zinc-500 block mb-1">Total Received</span>
                    <span className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={() => { onRefresh(); onClose(); }} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">Done</button>
                </div>
             ) : (
                <div className="space-y-6 w-full">
                  <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="4" />
                      <motion.circle cx="50" cy="50" r="45" fill="none" className="stroke-blue-600" strokeWidth="4" strokeDasharray="283" initial={{strokeDashoffset:283}} animate={{strokeDashoffset: (countdown/600)*283}} transition={{duration:1, ease:"linear"}} />
                    </svg>
                    <div className="text-center text-zinc-900 dark:text-white">
                      <p className="text-3xl font-semibold leading-none">{Math.floor(countdown/60)}:{(countdown%60).toString().padStart(2,'0')}</p>
                      <p className="text-xs text-zinc-500 mt-1">Check Out</p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight">Awaiting Payment</h2>
                    <p className="text-zinc-500 text-sm mt-2">Link sent to <span className="font-semibold">{formData.clientPhone}</span>. Checking automatically...</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                    <BiLinkAlt className="text-blue-600" size={20} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate flex-1 font-mono">{paymentLink || 'Generating...'}</span>
                    <button onClick={copyLink} className="p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-all"><BiCopy size={18} /></button>
                  </div>
                  <button onClick={() => { onRefresh(); onClose(); }} className="text-zinc-500 text-sm font-medium hover:text-zinc-900 dark:hover:text-white transition-colors">Close Window</button>
                </div>
             )}
           </div>
        </motion.div>
      </div>
    );
  }

  const ReviewScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-blue-600 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <BiInfoCircle size={22} />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Review Booking Summary</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Client Identity</p>
          <div className="space-y-2">
             <div className="flex justify-between text-sm"><span className="text-zinc-500">Name</span><span className="font-medium text-zinc-900 dark:text-white">{formData.clientName}</span></div>
             <div className="flex justify-between text-sm"><span className="text-zinc-500">Phone</span><span className="font-medium text-zinc-900 dark:text-white">{formData.clientPhone}</span></div>
             <div className="flex justify-between text-sm"><span className="text-zinc-500">Billing to</span><span className="font-semibold text-blue-600">{formData.billingName}</span></div>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Event Specs</p>
          <div className="space-y-2">
             <div className="flex justify-between text-sm"><span className="text-zinc-500">Type</span><span className="font-medium text-zinc-900 dark:text-white capitalize">{formData.eventType}</span></div>
             <div className="flex justify-between text-sm"><span className="text-zinc-500">Member</span><span className="font-medium text-zinc-900 dark:text-white capitalize">{formData.performanceType.replace('_', ' ')}</span></div>
             <div className="flex justify-between text-sm"><span className="text-zinc-500">Date</span><span className="font-medium text-zinc-900 dark:text-white">{formData.eventDate}</span></div>
          </div>
        </div>

        <div className="md:col-span-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
           <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Location & Lodging</p>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-blue-600 dark:text-blue-400"><BiMap size={20} /></div>
              <div className="flex-1">
                 <p className="font-medium text-zinc-900 dark:text-white">{formData.venueName}</p>
                 <p className="text-xs text-zinc-500 mt-1">{formData.fullAddress}, {formData.city}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${formData.stayRequired ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                Stay: {formData.stayRequired ? 'YES' : 'NO'}
              </div>
           </div>
        </div>

        <div className="md:col-span-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-3xl p-8">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                 <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Total Deal Amount</p>
                 <h4 className="text-4xl font-semibold text-zinc-900 dark:text-white">₹{calculateTotal().toLocaleString('en-IN')}</h4>
                 {formData.taxEnabled && <p className="text-xs text-zinc-500 mt-2 font-medium">Incl. 18% GST (₹{calculateTax().toLocaleString()})</p>}
              </div>
              
              <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                 <button onClick={() => setFormData({...formData, paymentMode: 'upi'})} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${formData.paymentMode === 'upi' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}>Online (UPI)</button>
                 <button onClick={() => setFormData({...formData, paymentMode: 'cash'})} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${formData.paymentMode === 'cash' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}>Offline (Cash)</button>
              </div>
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-sm font-medium text-emerald-700 dark:text-emerald-400">
         <BiCheckCircle size={18} className="shrink-0" />
         By continuing, you confirm these details and agree to generate a standardized tracking order.
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-4xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900">
           <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-2">
              {stepsInfo.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 shrink-0">
                   <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${step > idx + 1 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : step === idx + 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500'}`}>
                      {step > idx + 1 ? <BiCheckCircle size={18} /> : <s.icon size={18} />}
                   </div>
                   <div className="hidden md:block">
                      <p className={`text-xs font-semibold leading-none ${step === idx + 1 ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>{s.title}</p>
                   </div>
                   {idx < 5 && <div className="hidden md:block w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />}
                </div>
              ))}
           </div>
           <button onClick={onClose} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"><BiX size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 md:px-12 md:py-10">
           <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="max-w-3xl mx-auto">
                 
                 {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                       <div className="col-span-full mb-2"><h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Client Information</h2><p className="text-zinc-500 text-sm mt-1">Basic contact and identity details for the client.</p></div>
                       <div className="relative z-50">
                          <InputField label="Client Name" required value={formData.clientName} onChange={(v: string) => setFormData({...formData, clientName: v})} placeholder="e.g. John Doe" />
                          {showDropdown && searchResults.length > 0 && (
                             <div className="absolute top-[90%] left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden max-h-60 overflow-y-auto backdrop-blur-md">
                                <div className="p-3 bg-zinc-950/90 border-b border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Historical CRM Matches</div>
                                {searchResults.map(c => (
                                  <div key={c._id} onClick={() => selectClient(c)} className="p-4 hover:bg-zinc-800/80 cursor-pointer border-b border-zinc-800/30 last:border-0 transition-colors">
                                     <p className="text-[13px] font-bold text-white tracking-tight">{c.clientName}</p>
                                     <p className="text-[11px] font-medium text-zinc-400 mt-1">{c.clientPhone} • <span className="text-yellow-500">{c.visitCount} Completed Deals</span></p>
                                  </div>
                                ))}
                             </div>
                          )}
                       </div>
                       <InputField label="Phone Number" required value={formData.clientPhone} onChange={(v: string) => setFormData({...formData, clientPhone: v})} placeholder="+91 XXXXXXXXXX" />
                       <InputField label="Email Address" value={formData.clientEmail} onChange={(v: string) => setFormData({...formData, clientEmail: v})} placeholder="john@example.com" />
                       <InputField label="Instagram ID" value={formData.clientInstagram} onChange={(v: string) => setFormData({...formData, clientInstagram: v})} placeholder="@instagram_handle" />
                       <InputField label="Company / Entity" value={formData.companyName} onChange={(v: string) => setFormData({...formData, companyName: v})} placeholder="e.g. Acme Corp" />
                       <InputField label="Billing Name" required value={formData.billingName} onChange={(v: string) => setFormData({...formData, billingName: v})} placeholder="Entity Name for Invoice" highlight />
                    </div>
                 )}

                 {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                       <div className="col-span-full mb-2"><h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Event Logistics</h2><p className="text-zinc-500 text-sm mt-1">Configure performance parameters and timing.</p></div>
                       <CustomSelect label="Nature of Event" value={formData.eventType} onChange={(v: string) => setFormData({...formData, eventType: v})} options={[
                          {value:'wedding',label:'Wedding'},
                          {value:'mehendi',label:'Mehendi'},
                          {value:'haldi',label:'Haldi'},
                          {value:'sangeet',label:'Sangeet'},
                          {value:'cocktail_night',label:'Cocktail Night'},
                          {value:'wedding_ceremony',label:'Wedding Ceremony'},
                          {value:'reception',label:'Reception'},
                          {value:'after_party',label:'After-party'},
                          {value:'birthday',label:'Birthday Party'},
                          {value:'anniversary',label:'Anniversary'},
                          {value:'house_party',label:'House Party'},
                          {value:'reunion_party',label:'Reunion Party'},
                          {value:'baby_shower',label:'Baby Shower'},
                          {value:'corporate',label:'Corporate'},
                          {value:'annual_corporate',label:'Annual Corporate Party'},
                          {value:'team_offsite',label:'Team Offsite / Retreat'},
                          {value:'award_night',label:'Award Night'},
                          {value:'product_launch',label:'Product Launch'},
                          {value:'bachelorette',label:'Bachelorette'},
                          {value:'brunch',label:'Brunch'},
                          {value:'private_party',label:'Private Party'},
                          {value:'other',label:'Other'},
                        ]} />
                       <CustomSelect label="Performance Setup" value={formData.performanceType} onChange={(v: string) => setFormData({...formData, performanceType: v})} options={[{value:'solo',label:'Solo Performance'},{value:'duet',label:'Duet Setup'},{value:'trio',label:'Trio Concept'},{value:'4piece',label:'4-Piece Pro'},{value:'full_band',label:'Full Band Show'}]} />
                       <InputField label="Event Date" type="date" required value={formData.eventDate} onChange={(v: string) => setFormData({...formData, eventDate: v})} />
                       <div className="grid grid-cols-2 gap-4">
                          <InputField label="Start Time" type="time" required value={formData.startTime} onChange={(v: string) => setFormData({...formData, startTime: v})} />
                          <InputField label="End Time" type="time" required value={formData.endTime} onChange={(v: string) => setFormData({...formData, endTime: v})} />
                       </div>
                       <div className="col-span-full p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium text-sm"><BiTime size={18} /> Calculated Duration</div>
                          <div className="text-lg font-semibold text-zinc-900 dark:text-white">{formatDuration(formData.durationMinutes)}</div>
                       </div>
                    </div>
                 )}

                 {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                       <div className="col-span-full mb-2"><h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Venue Details</h2><p className="text-zinc-500 text-sm mt-1">Operational details for arrival and accommodation.</p></div>
                       <InputField label="Venue Name" required value={formData.venueName} onChange={(v: string) => setFormData({...formData, venueName: v})} placeholder="e.g. The Taj Palace" />
                       
                       <div className="space-y-4">
                          <CustomSelect 
                             label="City / Destination" 
                             value={formData.cityPreset} 
                             onChange={(v: string) => {
                               setFormData(prev => ({ 
                                 ...prev, 
                                 cityPreset: v, 
                                 city: v !== 'other' ? v.charAt(0).toUpperCase() + v.slice(1) : '' 
                               }))
                             }} 
                             options={[
                               {value:'lonavala',label:'Lonavala'},
                               {value:'karjat',label:'Karjat'},
                               {value:'alibaug',label:'Alibaug'},
                               {value:'mumbai',label:'Mumbai'},
                               {value:'pune',label:'Pune'},
                               {value:'other',label:'Other+'}
                             ]} 
                          />
                          {formData.cityPreset === 'other' && (
                             <InputField 
                               label="Enter City Name" 
                               required 
                               value={formData.city} 
                               onChange={(v: string) => setFormData({...formData, city: v})} 
                               placeholder="e.g. Bangalore" 
                             />
                          )}
                       </div>
                       <div className="col-span-full"><InputField label="Full Address" value={formData.fullAddress} onChange={(v: string) => setFormData({...formData, fullAddress: v})} placeholder="Landmark or gate instructions..." textarea /></div>
                       <div className="col-span-full"><InputField label="Google Maps URL" value={formData.googleMapsLink} onChange={(v: string) => setFormData({...formData, googleMapsLink: v})} placeholder="Maps URL..." /></div>
                       <div className="col-span-full flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">
                          <div className="flex items-center gap-4">
                             <div className={`p-2.5 rounded-xl ${formData.stayRequired ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'}`}><BiHomeHeart size={20} /></div>
                             <div><p className="text-sm font-semibold text-zinc-900 dark:text-white">Accommodation Included</p><p className="text-xs text-zinc-500 mt-0.5">Stay required for the artist & team</p></div>
                          </div>
                          <button onClick={() => setFormData({...formData, stayRequired: !formData.stayRequired})} className={`w-11 h-6 rounded-full relative transition-colors ${formData.stayRequired ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.stayRequired ? 'right-1' : 'left-1'}`} />
                          </button>
                       </div>
                    </div>
                 )}

                 {step === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                       <div className="col-span-full mb-2"><h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Financial Ledger</h2><p className="text-zinc-500 text-sm mt-1">Pricing and taxation structure for this lead.</p></div>
                       <InputField label="Quoted Amount (₹)" type="number" required value={formData.quotedAmount} onChange={(v: string) => setFormData({...formData, quotedAmount: v})} placeholder="Initial Quote" />
                       <InputField label="Agreed Deal (₹)" type="number" required value={formData.finalAmount} onChange={(v: string) => setFormData({...formData, finalAmount: v})} placeholder="Final Negotiated Value" />
                       
                       <div className="col-span-full bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
                          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                             <div className="flex items-center gap-2"><BiWallet className="text-blue-600 dark:text-blue-500" size={18} /><h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Monetary Additions</h4></div>
                             <button onClick={() => setFormData({...formData, taxEnabled: !formData.taxEnabled})} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${formData.taxEnabled ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400' : 'bg-white border-zinc-200 text-zinc-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400'}`}>
                                {formData.taxEnabled ? <BiCheckSquare size={16} /> : <BiSquare size={16} />}
                                Apply 18% GST
                             </button>
                          </div>

                          {/* Sound Included Toggle */}
                          <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                             <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${formData.soundIncluded ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'}`}>
                                  <BiCheckCircle size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">Sound System Included</p>
                                  <p className="text-xs text-zinc-500 mt-0.5">Is sound/PA system included in this package?</p>
                                </div>
                             </div>
                             <button onClick={() => setFormData({...formData, soundIncluded: !formData.soundIncluded})} className={`w-11 h-6 rounded-full relative transition-colors ${formData.soundIncluded ? 'bg-purple-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.soundIncluded ? 'right-1' : 'left-1'}`} />
                             </button>
                          </div>

                          <div className="space-y-4">
                             {extraCharges.map((charge, idx) => (
                               <div key={idx} className="flex flex-col md:flex-row gap-3 items-end">
                                  <div className="flex-1 w-full"><InputField label={idx === 0 ? "Extra Expenses" : "Additional Item"} value={charge.item} onChange={(v: string) => updateCharge(idx, 'item', v)} placeholder="e.g. Travel, Sounds..." /></div>
                                  <div className="w-full md:w-32"><InputField label="Extra Cost (₹)" type="number" value={charge.amount} onChange={(v: string) => updateCharge(idx, 'amount', v)} placeholder="0" /></div>
                                  <div className="flex items-center gap-2 pb-[1px]">
                                    <button onClick={() => extraCharges.length > 1 ? setExtraCharges(extraCharges.filter((_, i) => i !== idx)) : setExtraCharges([{item:'', amount:''}])} className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors border border-red-500/10 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/20" title="Remove row">
                                       <BiMinus size={20} />
                                    </button>
                                    {idx === extraCharges.length - 1 && (
                                       <button onClick={() => setExtraCharges([...extraCharges, {item:'', amount:''}])} className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors border border-blue-500/10 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30" title="Add another expense">
                                          <BiPlus size={20} />
                                       </button>
                                    )}
                                  </div>
                               </div>
                             ))}
                          </div>
                          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center justify-between border-l-4 border-l-blue-600">
                             <div><p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Net Final Total</p><p className="text-xs text-zinc-500 mt-0.5">Base + Extras + GST</p></div>
                             <div className="text-2xl font-bold text-zinc-900 dark:text-white">₹{calculateTotal().toLocaleString('en-IN')}</div>
                          </div>
                       </div>
                    </div>
                 )}

                 {step === 5 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                       <div className="col-span-full mb-2"><h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Internal Ops & Tracking</h2><p className="text-zinc-500 text-sm mt-1">Lead acquisition and operational handler details.</p></div>
                       <CustomSelect label="Lead Acquisition Source" value={formData.source} onChange={(v: string) => setFormData({...formData, source: v})} options={[
                          {value:'instagram',label:'Instagram'},
                          {value:'referral',label:'Personal Referral'},
                          {value:'google',label:'Google Discovery'},
                          {value:'google_ad',label:'Google Ad'},
                          {value:'meta_ad',label:'Meta Ad'},
                          {value:'wedding_planner',label:'Event Planner'},
                          {value:'b2b',label:'B2B'},
                          {value:'b2b_sv',label:'B2B SV'},
                          {value:'repeat_client',label:'Repeat Client'},
                          {value:'other',label:'Other Channels'},
                        ]} />
                       <InputField label="Campaign Ref" value={formData.campaignName} onChange={(v: string) => setFormData({...formData, campaignName: v})} placeholder="Ad or Campaign tag" />
                       <CustomSelect 
                         label="Assigned Sales Exec" 
                         value={formData.salesPerson} 
                         onChange={(v: string) => setFormData({...formData, salesPerson: v})} 
                         options={execOptions} 
                       />
                       {formData.salesPerson === 'other' && (
                         <div className="col-span-full mt-[-10px]">
                            <InputField label="Specify Exec Name" value={formData.otherSalesPerson} onChange={(v: string) => setFormData({...formData, otherSalesPerson: v})} placeholder="Type exact name here..." required textarea />
                         </div>
                       )}
                       {formData.source === 'referral' && <InputField label="Referrer Name" value={formData.referralName} onChange={(v: string) => setFormData({...formData, referralName: v})} placeholder="Who referred?" />}
                       <div className="col-span-full"><InputField label="Internal Notes & Conditions" value={formData.notes} onChange={(v: string) => setFormData({...formData, notes: v})} placeholder="Add any background context..." textarea /></div>
                    </div>
                 )}

                 {step === 6 && <ReviewScreen />}

              </motion.div>
           </AnimatePresence>
        </div>

        <div className="p-6 md:px-8 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-between">
            <button 
              onClick={step === 1 ? onClose : prevStep} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${step === 1 ? 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800' : 'text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-100 dark:text-zinc-300 dark:bg-zinc-800 border-transparent dark:hover:bg-zinc-700'}`}
            >
               {step === 1 ? 'Cancel' : <><BiChevronLeft size={18} /> Back</>}
            </button>
            
            <div className="flex items-center gap-3">
               {step < 6 ? (
                 <button 
                   onClick={nextStep} 
                   className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl text-sm font-semibold transition-all shadow-sm"
                 >
                   Continue <BiChevronRight size={18} />
                 </button>
               ) : (
                 <button 
                   onClick={() => handleFinalSave(formData.paymentMode as any)}
                   disabled={loading}
                   className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50"
                 >
                   {loading ? <BiLoaderAlt className="animate-spin" size={18} /> : <BiCheckCircle size={18} />}
                   {loading ? 'Processing...' : 'Confirm & Create'}
                 </button>
               )}
            </div>
        </div>

      </motion.div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, required, type = 'text', highlight, textarea }: any) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center gap-1.5">
         <label className={`text-xs font-semibold ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{label}{required && <span className="text-red-500">*</span>}</label>
      </div>
      {textarea ? (
         <textarea 
            rows={3}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-white dark:bg-zinc-900/40 border ${highlight ? 'border-blue-300 dark:border-blue-500/50 focus:border-blue-500 outline-none ring-1 ring-blue-500/20' : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 outline-none hover:border-zinc-300 dark:hover:border-zinc-700'} rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white transition-all resize-none placeholder:text-zinc-400`}
         />
      ) : (
         <input 
            type={type}
            required={required}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-white dark:bg-zinc-900/40 border ${highlight ? 'border-blue-300 dark:border-blue-500/50 focus:border-blue-500 outline-none ring-1 ring-blue-500/20' : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 outline-none hover:border-zinc-300 dark:hover:border-zinc-700'} rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 [color-scheme:light_dark]`}
         />
      )}
    </div>
  );
}
