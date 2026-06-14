"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error";

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-8 right-4 md:right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 min-w-[300px] max-w-sm"
                    style={{
                        backgroundColor: type === "success" ? "rgba(20, 20, 20, 0.95)" : "rgba(30, 10, 10, 0.95)",
                        borderColor: type === "success" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                    }}
                >
                    {/* Icon */}
                    <div className={`flex-shrink-0 ${type === "success" ? "text-green-500" : "text-red-500"}`}>
                        {type === "success" ? (
                            <CheckCircle2 className="w-6 h-6" />
                        ) : (
                            <XCircle className="w-6 h-6" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h4 className={`text-sm font-bold uppercase tracking-wider mb-0.5 ${type === "success" ? "text-green-500" : "text-red-500"}`}>
                            {type === "success" ? "Success" : "Error"}
                        </h4>
                        <p className="text-zinc-300 text-sm font-medium leading-tight">
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Progress Bar (Optional Visual Flair) */}
                    <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: 5, ease: "linear" }}
                        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left ${type === "success" ? "bg-green-500/50" : "bg-red-500/50"
                            }`}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
