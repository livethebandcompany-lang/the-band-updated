'use client';

import { useState } from 'react';
import { generateOfferEmail } from '@/lib/email-templates';
import { Monitor, Smartphone, Code, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmailPreviewPage() {
    const [subject, setSubject] = useState('Exclusive Spring Promotion');
    const [htmlMessage, setHtmlMessage] = useState(`Hi there,
<br><br>
We noticed you were interested in booking a band recently! 
To help make your event unforgettable, we are offering a <strong>complimentary lighting package</strong> (worth ₹15,000) for any premium bookings finalized this week.
<br><br>
<ul>
  <li>Professional Stage Wash</li>
  <li>Dynamic Dancefloor Lighting</li>
  <li>Dedicated Lighting Technician</li>
</ul>
<br>
We'd love to discuss the details for your event. Let us know if you'd like to schedule a quick call!`);
    
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop');

    const htmlContent = generateOfferEmail({
        subject,
        htmlMessage
    });

    return (
        <div className="font-sans pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div>
                    <Link href="/admin/enquiries" className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm font-bold mb-4 uppercase tracking-widest transition-colors"><ArrowLeft size={16}/> Back to CRM</Link>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                       Mass Email Design Lab
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                       Live Broadcast Previewer
                    </p>
                </div>

                <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                    <button 
                       onClick={() => setViewMode('desktop')} 
                       className={`px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <Monitor size={14}/> Desktop
                    </button>
                    <button 
                       onClick={() => setViewMode('mobile')} 
                       className={`px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <Smartphone size={14}/> Mobile
                    </button>
                    <button 
                       onClick={() => setViewMode('code')} 
                       className={`px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${viewMode === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <Code size={14}/> Raw HTML
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Panel */}
                <div className="col-span-1 border border-zinc-800 bg-zinc-900/50 rounded-3xl p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Subject Line</label>
                        <input 
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-black border border-zinc-800 text-white rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block flex justify-between">
                            <span>HTML Mail Body</span>
                        </label>
                        <textarea 
                            value={htmlMessage}
                            onChange={(e) => setHtmlMessage(e.target.value)}
                            className="w-full bg-black border border-zinc-800 text-zinc-300 rounded-xl p-4 text-sm font-mono h-[500px] focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="col-span-1 lg:col-span-2 flex justify-center bg-zinc-950 border border-zinc-800 rounded-3xl p-8 overflow-hidden relative min-h-[700px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />
                    
                    {viewMode === 'code' ? (
                        <div className="w-full h-full bg-black border border-zinc-800 rounded-2xl p-6 overflow-auto">
                            <pre className="text-xs text-blue-400 font-mono whitespace-pre-wrap">
                                {htmlContent}
                            </pre>
                        </div>
                    ) : (
                        <div className={`transition-all duration-500 ease-in-out bg-white overflow-hidden shadow-2xl shadow-blue-900/10 ${viewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[3rem] border-8 border-zinc-800' : 'w-full h-full rounded-2xl border border-zinc-800'}`}>
                            <iframe 
                                srcDoc={htmlContent} 
                                title="Email Preview"
                                className="w-full h-full border-0 bg-black"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
