"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Calendar, MapPin, Mail, Phone, User, CheckCircle2, Music, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPackage: string | null;
    serviceType?: string; // e.g., "Band Package", "Custom Builder"
    prefilledData?: any; // To pass existing builder data if needed
}

export default function BookingModal({
    isOpen,
    onClose,
    selectedPackage,
    serviceType = "Service Inquiry",
    prefilledData = {}
}: BookingModalProps) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        date: "",
        eventType: "wedding",
        performanceType: "full_band",
        destination: "",
        venueName: "",
        message: ""
    });
    const [minDate, setMinDate] = useState("");

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, ...prefilledData }));
        }
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setMinDate(`${yyyy}-${mm}-${dd}`);
    }, [isOpen, prefilledData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            selectedPackage,
        };

        try {
            const response = await fetch("/api/public/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                showToast("Inquiry Sent Successfully! We'll contact you soon.", "success");
                onClose();
                setFormData({ name: "", email: "", mobile: "", date: "", eventType: "wedding", performanceType: "full_band", destination: "", venueName: "", message: "" });
            } else {
                showToast(result.error || "Failed to send inquiry.", "error");
            }
        } catch (error) {
            showToast("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="text-yellow-500">Book</span> {selectedPackage}
                                    </h3>
                                    <p className="text-zinc-400 text-sm">Provide your event details to generate a preliminary quote.</p>
                                </div>
                                <button onClick={onClose} aria-label="Close Modal" className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Info Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your Full Name" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Mobile</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <input required type="tel" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="+91 98765 43210" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com (Optional)" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" />
                                        </div>
                                    </div>

                                    {/* Event Details Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Event Type</label>
                                            <select value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 font-medium appearance-none">
                                                <option value="wedding">Wedding</option>
                                                <option value="sangeet">Sangeet</option>
                                                <option value="haldi">Haldi / Mehendi</option>
                                                <option value="birthday">Birthday / Anniversary</option>
                                                <option value="corporate">Corporate Event</option>
                                                <option value="private_party">Private Party / Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Performance Style</label>
                                            <select value={formData.performanceType} onChange={e => setFormData({ ...formData, performanceType: e.target.value })} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 font-medium appearance-none">
                                                <option value="solo">Solo Artist</option>
                                                <option value="duet">Acoustic Duet</option>
                                                <option value="trio">Trio Concept</option>
                                                <option value="4piece">4-Piece Band</option>
                                                <option value="full_band">Full Impact Band</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Location Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <input required type="date" min={minDate || undefined} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all [color-scheme:dark]" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">City</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <input required type="text" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} placeholder="e.g. Mumbai" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Venue</label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <input type="text" value={formData.venueName} onChange={e => setFormData({ ...formData, venueName: e.target.value })} placeholder="Resort/Hotel" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Special Requests (Optional)</label>
                                        <textarea rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us more about the vibe, specific songs, or special requests..." className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none" />
                                    </div>

                                    <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 mt-4">
                                        {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Transmitting...</>) : (<>Confirm Booking Request <CheckCircle2 className="w-5 h-5" /></>)}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
