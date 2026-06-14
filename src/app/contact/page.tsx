"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, Instagram, Facebook, Linkedin, Headset, ChevronDown, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
    const [destination, setDestination] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [otherLocation, setOtherLocation] = useState("");
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

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 150]);

    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get("name"),
            mobile: formData.get("mobile"),
            email: formData.get("email"),
            destination: destination === "Other+" ? `Other: ${otherLocation}` : destination,
            date,
            type: "Contact Page",
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
                // Reset form
                (e.target as HTMLFormElement).reset();
                setDestination("");
                setOtherLocation("");
                setDate("");
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

    return (
        <main className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            {/* Main Content Split Section */}
            <section className="pt-24 pb-12 px-4 md:px-8 lg:px-16 container mx-auto max-w-6xl">
                <div className="bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800 flex flex-col lg:flex-row min-h-[550px]">

                    {/* Left Column: Visual Card */}
                    <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-full overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div className="w-full h-full absolute inset-0" style={{ y: y1, scale: 1.1 }}>
                                <video
                                    src="https://res.cloudinary.com/dnr4pajkw/video/upload/q_auto,f_auto/v1772098122/contact_ybvywa.mp4"
                                    poster="https://res.cloudinary.com/dnr4pajkw/video/upload/q_auto,f_auto,so_0/v1772098122/contact_ybvywa.jpg"
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    playsInline
                                    preload="metadata"
                                />
                            </motion.div>
                            {/* Cinematic Overlay */}
                            {/* Cinematic Overlay - Reduced opacity for better video visibility since text is removed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-30" />
                            <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay" />
                        </div>


                        <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                            </motion.div>

                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:w-1/2 p-6 md:p-10 bg-white dark:bg-zinc-950 flex flex-col justify-center rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4 max-w-lg mx-auto w-full"
                            onSubmit={handleSubmit}
                        >
                            {/* Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600"
                                    placeholder="Enter Name Here"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Mobile & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="mobile" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600"
                                        placeholder="Enter Mobile Number"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email ID</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600"
                                        placeholder="Enter Email Here"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Destination - Custom Dropdown */}
                            <div className="space-y-2 relative">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">What's Your Preferred Event Destination?</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        disabled={loading}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm md:text-base text-left text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all flex justify-between items-center group"
                                    >
                                        <span className={destination ? "text-white" : "text-zinc-400"}>
                                            {destination || "Select Destination"}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-zinc-500 group-hover:text-yellow-500 transition-all duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                key="dropdown"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute z-50 top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden"
                                            >
                                                {["Lonavala", "Karjat", "Alibaug", "Mumbai", "Pune", "Other+"].map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => {
                                                            setDestination(option);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-500 transition-colors border-b border-zinc-800/50 last:border-0"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Conditional Location Name */}
                            {destination === "Other+" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-2"
                                >
                                    <label htmlFor="location" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Location Name</label>
                                    <input
                                        type="text"
                                        id="location"
                                        value={otherLocation}
                                        onChange={(e) => setOtherLocation(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm md:text-base text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600"
                                        placeholder="Enter Location Name"
                                        disabled={loading}
                                    />
                                </motion.div>
                            )}

                            {/* Date */}
                            <div className="space-y-2 relative">
                                <label htmlFor="date" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">What Date Are You Planning Your Event?</label>
                                <div className="relative group">
                                    <input
                                        type="date"
                                        id="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={minDate || undefined}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-4 pr-10 py-2.5 text-sm md:text-base text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600 [color-scheme:dark] appearance-none"
                                        disabled={loading}
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-yellow-500 transition-all duration-300 pointer-events-none" />
                                </div>
                            </div>

                            <button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2.5 px-8 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-900/20 text-sm tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </section>

            {/* Get In Touch Strip */}
            <section className="pb-12 px-4 md:px-8 lg:px-16 container mx-auto max-w-6xl">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6">
                    <h2 className="text-xl font-bold text-center mb-6">Get In Touch</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Artist Helpline */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center mb-2 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                <Headset className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-base font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Contact Number</span>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-lg md:text-xl font-serif text-white group-hover:text-yellow-500 transition-colors cursor-default">+91 7779945379</span>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center mb-2 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                <Mail className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-base font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Email</span>
                            <span className="text-base md:text-xl font-serif group-hover:text-yellow-500 transition-colors cursor-default break-all sm:break-normal">live.thebandcompany@gmail.com</span>
                        </div>

                        {/* Follow Us */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center mb-2">
                                <span className="text-base font-bold">Socials</span>
                            </div>
                            <span className="text-base font-bold text-zinc-500 uppercase tracking-wider mb-2">Follow Us</span>
                            <div className="flex gap-3">
                                <a href="https://www.instagram.com/live.thebandcompany?igsh=enpibDA5bnQzc2Z5" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-md"><Instagram className="w-4 h-4" /></a>
                                <a href="https://www.facebook.com/share/1Df9d4yBCi/" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-md"><Facebook className="w-4 h-4" /></a>
                                <a href="https://www.linkedin.com/company/thebandcompany/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-md"><Linkedin className="w-4 h-4" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Make a Booking Section */}
            <section className="pb-16 px-4 md:px-8 lg:px-16 container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* Left Text */}
                    <div className="lg:w-1/2 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Do you want to <br />
                            <span className="text-yellow-500">make a booking?</span>
                        </h2>
                        <p className="text-zinc-400 text-base max-w-md leading-relaxed">
                            Fill out the form, and we&apos;ll get back to you as soon as possible. Our team will help you to find the best live artist for your event or occasion.
                        </p>
                    </div>

                    {/* Right Action Cards */}
                    <div className="lg:w-1/2 w-full space-y-3">
                        {/* Call Card */}
                        <a href="tel:+917779945379" className="group flex items-center bg-zinc-900 overflow-hidden rounded-xl border border-zinc-800 hover:border-yellow-500/50 transition-all hover:scale-[1.01]">
                            <div className="w-20 h-20 relative flex-shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                                    alt="Call"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <div className="flex-grow px-5">
                                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Call</h3>
                            </div>
                            <div className="pr-5">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all">
                                    <Phone className="w-4 h-4" />
                                </div>
                            </div>
                        </a>

                        {/* WhatsApp Card */}
                        <a href="https://wa.me/917779945379" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="group flex items-center bg-zinc-900 overflow-hidden rounded-xl border border-zinc-800 hover:border-green-500/50 transition-all hover:scale-[1.01]">
                            <div className="w-20 h-20 relative flex-shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop"
                                    alt="WhatsApp"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <div className="flex-grow px-5">
                                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">WhatsApp</h3>
                            </div>
                            <div className="pr-5">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-green-500 group-hover:text-black transition-all">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                </div>
                            </div>
                        </a>

                        {/* Enquiry Form Card (Scroll to form) */}
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full group flex items-center bg-zinc-900 overflow-hidden rounded-xl border border-zinc-800 hover:border-blue-500/50 transition-all hover:scale-[1.01] text-left">
                            <div className="w-20 h-20 relative flex-shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
                                    alt="Enquiry"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <div className="flex-grow px-5">
                                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Enquiry Form</h3>
                            </div>
                            <div className="pr-5">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-black transition-all">
                                    <Mail className="w-4 h-4" />
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </section>


            <Footer />
        </main >
    );
}
