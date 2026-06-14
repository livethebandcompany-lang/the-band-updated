"use client";

import { useState, useEffect } from "react";
import { Phone, MessageCircle, ChevronUp } from "lucide-react"; // Using MessageCircle as WhatsApp placeholder if needed, or just custom SVG
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingActions() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Contact Widget (Right Side) */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col"
                    >
                        <div className="bg-red-600 p-2 rounded-l-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] flex flex-col gap-3 text-white border-l border-white/20 backdrop-blur-sm">
                            <a
                                href="tel:+"
                                className="hover:scale-110 transition-transform drop-shadow-md"
                                aria-label="Call Us"
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/724/724664.png"
                                    alt="Phone"
                                    className="w-7 h-7"
                                />
                            </a>
                            <a
                                href="https://wa.me/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:scale-110 transition-transform drop-shadow-md"
                                aria-label="WhatsApp"
                            >
                                {/* Official WhatsApp Logo */}
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/3670/3670051.png"
                                    alt="WhatsApp"
                                    className="w-7 h-7"
                                />
                            </a>
                        </div>
                    </motion.div>

                    {/* Back to Top Button (Bottom Right) */}
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 p-3 bg-gray-900 text-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all border border-white/10"
                        aria-label="Scroll to top"
                    >
                        <ChevronUp className="w-6 h-6" />
                    </motion.button>
                </>
            )}
        </AnimatePresence>
    );
}
