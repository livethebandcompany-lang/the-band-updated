"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const TESTIMONIALS = [
    {
        id: 1,
        name: "Priya & Rahul",
        event: "Wedding Reception",
        location: "Lonavala",
        rating: 5,
        quote: "The Band Company made our wedding reception absolutely magical! Their energy and versatility kept everyone dancing all night. They perfectly adapted to our mix of Bollywood and retro requests.",
        image: null
    },
    {
        id: 2,
        name: "Vikram Mehta",
        event: "Corporate Event",
        location: "Mumbai",
        rating: 5,
        quote: "Hired them for our company's annual gala. Professional, punctual, and phenomenal performers. The Sufi fusion set was the highlight of the evening. Highly recommended!",
        image: null
    },
    {
        id: 3,
        name: "Ananya Sharma",
        event: "Birthday Party",
        location: "Pune",
        rating: 5,
        quote: "Best decision for my husband's 40th birthday bash! They created such a vibrant atmosphere with their acoustic setup. Guests are still talking about it weeks later!",
        image: null
    },
    {
        id: 4,
        name: "Rohan & Ishita",
        event: "Sangeet Night",
        location: "Alibaug",
        rating: 5,
        quote: "Our sangeet was a dream come true! The Band Company understood our vision perfectly and delivered beyond expectations. The custom arrangements were absolutely beautiful.",
        image: null
    }
];

export default function ServiceTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 4000); // Changed to 4 seconds for smoother experience

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        setIsAutoPlaying(false);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
        setIsAutoPlaying(false);
    };

    const currentTestimonial = TESTIMONIALS[currentIndex];

    return (
        <section className="w-full py-16 md:py-24 relative">
            <div className="max-w-5xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1.5 mb-4">
                        <Star className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-yellow-500 text-xs font-medium uppercase tracking-wider">Client Stories</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        What Our Clients Say
                    </h2>
                    <p className="text-zinc-400 text-base max-w-2xl mx-auto">
                        Real experiences from real events
                    </p>
                </motion.div>

                {/* Testimonial Card */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 border border-zinc-700 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Decorative Quote Icon */}
                            <div className="absolute top-8 right-8 opacity-10">
                                <Quote className="w-32 h-32 text-yellow-500" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-6 relative z-10">
                                {[...Array(currentTestimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-xl md:text-2xl text-white font-light leading-relaxed mb-8 relative z-10">
                                "{currentTestimonial.quote}"
                            </blockquote>

                            {/* Client Info */}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-bold text-xl">
                                    {currentTestimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-lg">{currentTestimonial.name}</p>
                                    <p className="text-zinc-400 text-sm">
                                        {currentTestimonial.event} • {currentTestimonial.location}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-black transition-all group"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex gap-2">
                            {TESTIMONIALS.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentIndex(index);
                                        setIsAutoPlaying(false);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "w-8 bg-yellow-500"
                                        : "w-2 bg-zinc-700 hover:bg-zinc-600"
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-black transition-all group"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
