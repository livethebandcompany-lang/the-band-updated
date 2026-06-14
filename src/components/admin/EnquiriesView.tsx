'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, Search, Filter, Mail, Clock, Calendar, MapPin, Send, Plus, X, Users, Globe, Edit2, Save, Trash2, Monitor, Contact
} from 'lucide-react';
import { generateOfferEmail } from '@/lib/email-templates';
import CreateBookingModal from '@/components/admin/CreateBookingModal';
import toast from 'react-hot-toast';

export default function EnquiriesView({ initialData, userRole }: { initialData: any[], userRole: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  
  // Compose Mail State
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Advanced Filters State
  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    status: 'all'
  });

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Booking Creation State
  const [bookingData, setBookingData] = useState<any>(null);

  const availableTypes = useMemo(() => Array.from(new Set(initialData.map((d: any) => d.type).filter(Boolean))), [initialData]);

  // Filtering Logic
  const filteredData = initialData.filter((b: any) => {
    // 1. Core Text Search
    const searchMatch = 
        b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.mobile?.includes(searchQuery) || 
        b.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!searchMatch) return false;

    // 2. Timeline Filter Logic
    const bDate = new Date(b.createdAt);
    if (filters.dateRange === 'month') {
      const now = new Date();
      if (bDate.getMonth() !== now.getMonth() || bDate.getFullYear() !== now.getFullYear()) return false;
    } else if (filters.dateRange === 'year') {
      const now = new Date();
      if (bDate.getFullYear() !== now.getFullYear()) return false;
    }

    // 3. Status logic
    if (filters.status !== 'all' && b.status !== filters.status) return false;

    // 4. Type Match
    if (filters.type !== 'all' && b.type !== filters.type) return false;

    return true;
  });

  const totalInquiries = filteredData.length;
  const currentMonthCount = initialData.filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth()).length;

  // Handle mass broadcast
  const handleBroadcast = async () => {
      if (!composeSubject || !composeBody) {
          toast.error("Format Required: Subject and Body must not be empty.");
          return;
      }
      
      const targetEmails = filteredData.map(d => d.email).filter(Boolean);
      if (targetEmails.length === 0) {
          toast.error("No valid email recipients found in current filter view.");
          return;
      }

      if (!window.confirm(`Initiating mass-mail blast to ${targetEmails.length} recipients. Confirm to proceed.`)) return;

      setIsSending(true);
      try {
          const formattedHtml = generateOfferEmail({
              subject: composeSubject,
              htmlMessage: composeBody
          });

          const payload = {
              targetEmails,
              subject: composeSubject,
              htmlMessage: formattedHtml
          };

          const res = await fetch('/api/admin/enquiries/broadcast', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          
          if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.error || "System rejected broadcast sequence.");
          }
          
          toast.success("Broadcast dispatched successfully!");
          setIsComposing(false);
          setComposeSubject('');
          setComposeBody('');
      } catch (err: any) {
          console.error(err);
          toast.error(err.message || "Failed allocating broadcast block.");
      } finally {
          setIsSending(false);
      }
  };

  const startEditing = (item: any) => {
      setEditingId(item._id);
      setEditForm({
          name: item.name || '',
          email: item.email || '',
          mobile: item.mobile || '',
          destination: item.destination || '',
          date: item.date || '',
          message: item.message || '',
          type: item.type || ''
      });
  };

  const handleSaveEdit = async () => {
      setIsSaving(true);
      try {
          const res = await fetch(`/api/admin/enquiries/${editingId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editForm)
          });
          
          if (!res.ok) throw new Error('Failed to update inquiry');
          
          toast.success('Inquiry updated successfully!');
          setEditingId(null);
          router.refresh(); // Reload server data
      } catch (err) {
          toast.error('Could not save modifications.');
      } finally {
          setIsSaving(false);
      }
  };

  const handleDeleteInquiry = async (item: any) => {
      if (!window.confirm(`Permanently delete lead for ${item.name}? This action cannot be reversed.`)) return;
      try {
          const res = await fetch(`/api/admin/enquiries/${item._id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Deletion rejected securely by API.');
          toast.success("Lead purged from Database.");
          router.refresh();
      } catch (err) {
          toast.error("Failed to delete record.");
      }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
            <MessageSquare size={32} className="text-blue-500" />
            Lead Enquiries
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Public Traffic Intercept Manager
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 group focus-within:border-blue-500/50 transition-all">
              <Search size={16} className="text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                 type="text" 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 placeholder="Find User, Email, Phone..." 
                 className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-white focus:outline-none w-56 placeholder:text-zinc-700" 
              />
           </div>
           
           <button 
             onClick={() => router.push('/admin/enquiries/preview')}
             className="flex items-center gap-3 px-6 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
           >
              <Monitor size={16} /> Preview Tool
           </button>

           <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`flex items-center gap-3 px-6 py-3.5 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${showFilters ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
           >
              <Filter size={16} /> Filters
           </button>

           <button 
             onClick={() => setIsComposing(true)}
             className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 border border-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
           >
              <Mail size={16} />
              Mass Broadcast (${filteredData.length})
           </button>
        </div>
      </div>

      {showFilters && (
         <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Event Timeline</label>
               <select 
                 value={filters.dateRange} 
                 onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                 className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl outline-none p-3 focus:border-blue-500"
               >
                  <option value="all">Lifetime History</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Inquiry Type</label>
               <select 
                 value={filters.type} 
                 onChange={(e) => setFilters({...filters, type: e.target.value})}
                 className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl outline-none p-3 focus:border-blue-500"
               >
                  <option value="all">All Channels</option>
                  {availableTypes.map(type => <option key={type as string} value={type as string}>{type as string}</option>)}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Lead Status</label>
               <select 
                 value={filters.status} 
                 onChange={(e) => setFilters({...filters, status: e.target.value})}
                 className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl outline-none p-3 focus:border-blue-500"
               >
                  <option value="all">Any Status</option>
                  <option value="new">Fresh Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="archived">Archived</option>
               </select>
            </div>

             <div className="space-y-2 flex items-end">
               <button 
                  onClick={() => setFilters({dateRange: 'all', type: 'all', status: 'all'})}
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-zinc-500 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-xl"
               >
                  <X size={14} /> Reset Query
               </button>
            </div>
         </div>
      )}

      {/* Global CRM Metrics Widget */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500"><Users size={18} /><h3 className="text-xs font-black uppercase tracking-widest">Selected Queries</h3></div>
            <p className="text-4xl font-black text-white">{totalInquiries}</p>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500"><Globe size={18} /><h3 className="text-xs font-black uppercase tracking-widest">Global Intercepts</h3></div>
            <p className="text-4xl font-black text-zinc-400">{initialData.length}</p>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500"><Calendar size={18} /><h3 className="text-xs font-black uppercase tracking-widest">This Month</h3></div>
            <p className="text-4xl font-black text-white">{currentMonthCount}</p>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500"><Filter size={18} /><h3 className="text-xs font-black uppercase tracking-widest">Fresh Leads (Total)</h3></div>
            <p className="text-4xl font-black text-blue-500">{initialData.filter(d => d.status === 'new').length}</p>
         </div>
      </div>

      <div className="space-y-4">
         {filteredData.map((item: any) => {
             const isEditing = editingId === item._id;

             return (
             <div key={item._id} className={`bg-zinc-900/40 border ${isEditing ? 'border-blue-500/50' : 'border-zinc-800/50'} rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group hover:bg-zinc-800/20 transition-all duration-300`}>
                
                {isEditing ? (
                   <div className="flex-1 w-full space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                             <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="Lead Name" />
                         </div>
                         <div className="space-y-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Source Tag</label>
                             <input value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. Contact Page" />
                         </div>
                         <div className="space-y-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                             <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 focus:border-blue-500 outline-none" placeholder="Target Email" />
                         </div>
                         <div className="space-y-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mobile Phone</label>
                             <input value={editForm.mobile} onChange={e => setEditForm({...editForm, mobile: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 focus:border-blue-500 outline-none" placeholder="Contact number" />
                         </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800/50">
                          <button onClick={() => setEditingId(null)} className="px-5 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">Cancel</button>
                          <button onClick={handleSaveEdit} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-blue-500/20">{isSaving ? 'Saving...' : <><Save size={14}/> Apply Fixes</>}</button>
                      </div>
                   </div>
                ) : (
                <>
                <div className="flex items-start gap-6 flex-1 min-w-0 w-full">
                   <div className="w-12 h-12 bg-zinc-800 rounded-full flex flex-col items-center justify-center text-zinc-500 border border-zinc-700 shrink-0 uppercase font-black tracking-tighter text-sm">
                      {item.name?.charAt(0) || '?'}
                   </div>
                   <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between w-full">
                         <div className="flex items-center gap-3 min-w-0">
                            <h3 className="text-xl font-bold text-white tracking-tight truncate">{item.name || 'Anonymous User'}</h3>
                            <span className="text-[11px] font-medium text-zinc-500 italic lowercase">
                               from {item.type} 
                            </span>
                         </div>
                         <div className="flex items-center gap-4 shrink-0">
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setBookingData(item)} className="p-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition-colors" title="Convert to CRM Booking">
                                   <Contact size={14} />
                                </button>
                                <button onClick={() => startEditing(item)} className="p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white rounded-md transition-colors" title="Edit Inquiry Info">
                                   <Edit2 size={14} />
                                </button>
                                {userRole === 'admin' && (
                                  <button onClick={() => handleDeleteInquiry(item)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors" title="Trash Entry">
                                     <Trash2 size={14} />
                                  </button>
                                )}
                             </div>
                             <div className="flex items-center gap-2">
                                 <Clock size={12} className="text-zinc-600" />
                                 <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                                     Intercepted {new Date(item.createdAt).toLocaleDateString('en-GB')}
                                 </span>
                             </div>
                         </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 opacity-80">
                         {item.mobile && <span className="flex items-center gap-1.5 text-xs font-medium text-blue-400"><MessageSquare size={12}/> {item.mobile}</span>}
                         {item.email && <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400"><Mail size={12}/> {item.email}</span>}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 mb-2">
                         {item.date && (
                             <p className="flex items-center gap-1.5 text-xs font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                <Calendar size={12} /> {item.date}
                             </p>
                         )}
                         {item.destination && (
                             <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                <MapPin size={12}/> {item.destination}
                             </p>
                         )}
                      </div>

                      {item.message && (
                          <div className="mt-3 p-3 bg-black/50 border border-zinc-800 rounded-xl">
                              <p className="text-xs text-zinc-400 italic font-medium leading-relaxed">"{item.message}"</p>
                          </div>
                      )}
                   </div>
                </div>
                </>
                )}

             </div>
             );
         })}

         {filteredData.length === 0 && (
            <div className="py-32 text-center">
               <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={24} className="text-zinc-700" />
               </div>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">0 Inquiries Found in Log Filter</p>
               <button onClick={() => setFilters({dateRange: 'all', type: 'all', status: 'all'})} className="mt-4 px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-colors">
                  Reset Views
               </button>
            </div>
         )}
      </div>

      {/* HTML Mass Composer Modal Overlayer */}
      {isComposing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                   <div className="flex flex-col">
                       <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                           <Send className="text-blue-500" size={20} /> Broadcast Terminal
                       </h2>
                       <p className="text-xs text-zinc-500 mt-1 font-bold tracking-widest">
                           {filteredData.length} Targets Selected
                       </p>
                   </div>
                   <button onClick={() => setIsComposing(false)} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                       <X size={18} />
                   </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Subject Line</label>
                        <input 
                            type="text"
                            placeholder="Exclusive Offer from The Band Company..."
                            value={composeSubject}
                            onChange={e => setComposeSubject(e.target.value)}
                            className="w-full bg-black border border-zinc-800 text-white rounded-xl p-4 text-sm font-bold placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block flex justify-between">
                            <span>HTML Mail Body</span>
                            <span className="text-blue-500 lowercase italic">Supports full semantic html formatting.</span>
                        </label>
                        <textarea 
                            value={composeBody}
                            onChange={e => setComposeBody(e.target.value)}
                            placeholder="<h1>Hi there,</h1><p>We saw you were looking for live bands!</p>"
                            className="w-full bg-black border border-zinc-800 text-zinc-300 rounded-xl p-4 text-sm font-mono h-64 placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsComposing(false)}
                        className="px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        Abandon
                    </button>
                    <button 
                        onClick={handleBroadcast}
                        disabled={isSending}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                    >
                        {isSending ? 'Transmitting...' : 'Dispatch Wave'}
                    </button>
                </div>
             </div>
          </div>
      )}

      {/* Convert to Booking Modal Wrapper */}
      {bookingData && (
          <CreateBookingModal 
              onClose={() => setBookingData(null)}
              onRefresh={() => {
                  setBookingData(null);
                  toast.success("Lead conversion successful.");
                  router.push('/admin/bookings'); // Send to booking CRM dashboard
              }}
              isRepeatBooking={false}
              prefillData={{
                  clientName: bookingData.name,
                  clientPhone: bookingData.mobile,
                  clientEmail: bookingData.email,
                  city: bookingData.destination,
                  eventDate: bookingData.date ? new Date(bookingData.date) : new Date(Date.now() + 86400000),
                  notes: `Auto-propagated from the Enquiries portal. Original Lead Data:\n${bookingData.message || 'No additional details.'}`,
                  source: 'google' // Defaulting to digital acquisition
              }}
          />
      )}
    </>
  );
}
