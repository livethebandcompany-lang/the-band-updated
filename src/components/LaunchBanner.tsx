"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
    {
        id: 1,
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098369/villa_party_0_otgjam.webp",
        title: "Private Villa Parties",
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098370/villa_party_1_bosegd.webp",
        title: "House Parties"
    },
    {
        id: 3,
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098373/villa_party_2_nkzgrq.webp",
        title: "Wedding Celebrations"
    },
    {
        id: 4,
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098374/villa_party_3_cqwrcj.webp",
        title: "Cocktail Parties"
    },
    {
        id: 5,
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098376/villa_party_4_tm3lkm.webp",
        title: "Corporate Soirées"
    },
];


export default function LaunchBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <section className="w-full h-[300px] md:h-[400px] relative overflow-hidden bg-zinc-100 dark:bg-zinc-950 group">

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[currentIndex].image}
                        alt={slides[currentIndex].title}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover opacity-80"
                    />
                    {/* Dark Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>
            </AnimatePresence>

            {/* Central Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-16 md:px-4">
                <AnimatePresence mode="wait">
                    <motion.h3
                        key={`text-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-white text-2xl md:text-5xl font-bold uppercase tracking-wider mb-4 drop-shadow-md font-serif"
                    >
                        {slides[currentIndex].title}
                    </motion.h3>
                </AnimatePresence>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100px" }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="h-1 bg-yellow-500 mb-4"
                />
                <p className="text-gray-200 text-xs md:text-lg tracking-[0.3em] uppercase">
                    Live Music
                </p>
            </div>

            {/* Navigation Arrows - Fixed Visibility */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                }}
                className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 w-6 h-6 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-md transition-all z-30 cursor-pointer"
                aria-label="Previous Slide"
                type="button"
            >
                <ChevronLeft className="w-3.5 h-3.5 md:w-8 md:h-8 font-bold" />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                }}
                className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 w-6 h-6 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-md transition-all z-30 cursor-pointer"
                aria-label="Next Slide"
                type="button"
            >
                <ChevronRight className="w-3.5 h-3.5 md:w-8 md:h-8 font-bold" />
            </button>

        </section>
    );
}
