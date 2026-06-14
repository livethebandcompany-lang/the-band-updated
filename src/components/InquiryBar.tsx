"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useToast } from "@/context/ToastContext";

export default function InquiryBar({ className = "", source = "Inquiry Bar", dropdownDirection = "down" }: { className?: string; source?: string; dropdownDirection?: "up" | "down" }) {
    const [destination, setDestination] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [minDate, setMinDate] = useState("");

    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setMinDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    const { showToast } = useToast();

    const destinations = ["Lonavala ", "Karjat", "Alibaug", "Mumbai", "Pune", "Other+"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            email: formData.get("email"),
            mobile: formData.get("mobile"),
            destination,
            date,
            type: source,
        };

        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                showToast("Inquiry Submitted Successfully!", "success");
                // Reset form optionally
                setDestination("");
                setDate("");
                (e.target as HTMLFormElement).reset();
            } else {
                console.error("Server Error Details:", result);
                showToast(result.details || "Failed to submit inquiry. Please try again.", "error");
            }
        } catch (error) {
            console.error("Submission error:", error);
            showToast("An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };
    // ... rest of component

    return (
        <div className={`w-full max-w-5xl mx-auto ${className}`}>
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-4 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 items-center"
            >
                {/* Email */}
                <div className="relative w-full md:w-auto md:flex-1 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors">
                        <Mail className="w-4 h-4" />
                    </div>
                    <input
                        type="email"
                        name="email"
                        aria-label="Email Address"
                        placeholder="Email ID"
                        className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Phone */}
                <div className="relative w-full md:w-auto md:flex-1 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors">
                        <Phone className="w-4 h-4" />
                    </div>
                    <input
                        type="tel"
                        name="mobile"
                        aria-label="Phone Number"
                        placeholder="Phone Number"
                        className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Date */}
                <div className="relative w-full md:w-auto md:flex-1 min-w-0 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10 pointer-events-none">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <input
                        type="date"
                        aria-label="Event Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={minDate || undefined}
                        className="w-full min-w-0 appearance-none bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600 [color-scheme:dark] cursor-pointer"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Destination Dropdown */}
                <div className="relative w-full md:w-auto md:flex-1">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={loading}
                        className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-left text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all flex justify-between items-center group"
                    >
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <span className={destination ? "text-white" : "text-zinc-600"}>
                            {destination || "Destination"}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className={`absolute z-50 left-0 right-0 py-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden ${dropdownDirection === "up"
                                    ? "bottom-full mb-2"
                                    : "top-full mt-2"
                                    }`}
                            >
                                {destinations.map((city) => (
                                    <button
                                        key={city}
                                        type="button"
                                        onClick={() => {
                                            setDestination(city);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-yellow-500 transition-colors"
                                    >
                                        {city}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-900/20 text-sm tracking-wide uppercase whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Inquire Now"
                    )}
                </button>
            </form>
        </div>
    );
}
