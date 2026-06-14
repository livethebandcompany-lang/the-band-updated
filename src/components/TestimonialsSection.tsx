"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

const testimonials = [
    {
        id: 1,
        name: "Siddharth Shah",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjWm1AOIC_2WIONlTSHs52cCU-62C9XLnPTqjYL_CdkyKGg1Q5RW=w90-h90-p-rp-mo-ba2-br100",
        rating: 5,
        text: "Last night’s performance by Tejas and Samad was nothing short of extraordinary. From the moment they stepped on stage, the energy in the room shifted—they didn’t just sing; they connected, captivated, and completely owned the night. It was lovely having them and my family also loved the set, next time also I am calling them and recommending my friends as well."
    },
    {
        id: 2,
        name: "Nidhi Kuvadia",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjUtVbMGq62zKGShMj5IDe5bRJjteJzOlSE-v4nxXPz-0qbo1tPU=w90-h90-p-rp-mo-br100",
        rating: 5,
        text: "Tejas voice is very melodious and the choice of songs added the stars to the party. Very cooperative and amazing singer"
    },
    {
        id: 3,
        name: "Kool Deep Shah",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjX4cgkUH8FfcG-jzCYXv4WePW5WEaT1sJFBEaX8vJsoMdzUNCnDyw=w90-h90-p-rp-mo-br100",
        rating: 5,
        text: "Extremely talented band. The singer has a great voice. Their choice of songs was on point. Kept everyone on their toes. They picked romantic, mid tempo and high tempo songs which kept the group engaged and dancing throughout the performance.They were on time and very professional. I would highly recommend this band!"
    },
    {
        id: 4,
        name: "Gaurav Lad",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjVKxnweylHEJOv9nSusOJyGYoYz-2v4nBvAX2PcmC_4APL1XnyU=w90-h90-p-rp-mo-br100",
        rating: 5,
        text: "Talented band! Great song collection! Made our night memorable! Highly recommend for your events!"
    },
    {
        id: 5,
        name: "Devika Gupta",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjWtsJJSEqdaHGSAZvQSNFk_Jd0uQh3tApQgNLUr2DgPPmlnKvQFQQ=w90-h90-p-rp-mo-br100",
        rating: 5,
        text: "Fabulous! They made my parents anniversary celebration a total hit. 10/10 recommend!"
    },
    {
        id: 6,
        name: "Nakul Pimpalwar",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjWzphkhyyriN7VZSHbhucEbgbTHu3BB3WDGQGwN0Mmt2b6WVoITFw=w90-h90-p-rp-mo-ba2-br100",
        rating: 5,
        text: "A special thanks to Neha, whose consistent follow-ups and highly professional approach made everything smooth right from the beginning.The team handled every challenge with great professionalism—whether it was adding a female singer to the lineup or incorporating Marathi, English, and other regional songs into the performance. They were extremely flexible and committed to delivering a show that matched our vision.The performance itself was powerful, energetic, and thoroughly enjoyable. Everything went off seamlessly, and we couldn't be happier with the outcome. We’re definitely looking forward to working with you again in the future!"
    },

];

export default function TestimonialsSection() {
    // The above "animate" approach is good but "drag" conflicts with it hard.
    // Switching to explicit frame loop for maximum control.

    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Measure content width once mounted
    useEffect(() => {
        if (containerRef.current) {
            setContentWidth(containerRef.current.scrollWidth / 3); // Divided by 3 because we triple the content
        }
    }, []);

    useAnimationFrame((t, delta) => {
        if (!contentWidth) return;

        let moveBy = 0;
        // Auto-scroll speed (pixels per second) -> adjust '30' for speed
        const speed = 30;

        // Only stop if dragging, continue even if hovered
        if (!isDragging) {
            moveBy = -(speed * (delta / 1000));
        }

        // Apply movement
        let newX = x.get() + moveBy;

        // Wrap logic (Infinite Loop)
        // If we've scrolled past half (the first set), jump back to 0
        // We use a small buffer or exact match depending on math.
        if (newX <= -contentWidth) {
            newX = 0;
            // Or strictly: newX = newX % contentWidth; but resets are safer to avoid drift
        }
        // Also handle dragging to the right (positive X)
        if (newX > 0) {
            newX = -contentWidth;
        }

        // Only set if we aren't dragging (Framer handles updates during drag)
        // actually, we WANT to update 'x' ourselves if not dragging.
        // If dragging, Framer updates 'x' via the drag gesture.
        if (!isDragging) {
            x.set(newX);
        }
    });

    return (
        <section className="py-24 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Radial Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_50%)]"></div>

                {/* Vibrant Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[6000ms]"></div>

                {/* Grid Pattern Overlay */}
                {/* Removed noise texture - file not found */}
            </div>

            <div className="container mx-auto relative z-10 overflow-hidden">
                {/* Stylish Header */}
                <div className="text-center mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-tight">
                            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">Stories</span>
                        </h2>
                        <div className="flex items-center justify-center gap-3 mb-4 opacity-60">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-500"></div>
                        </div>
                        <p className="text-zinc-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                            Real experiences from those we’ve had the honor of celebrating with.
                        </p>
                    </motion.div>
                </div>

                {/* Interactive Marquee Slider */}
                <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-20 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-20 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none"></div>

                    {/* Draggable Container */}
                    <motion.div
                        ref={containerRef}
                        className="flex gap-6 py-8 w-max"
                        style={{ x }}
                        drag="x"
                        dragConstraints={{ left: -10000, right: 10000 }} // Free drag
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => setIsDragging(false)}
                    >
                        {/* First Copy */}
                        {testimonials.map((review) => (
                            <TestimonialCard key={`first-${review.id}`} review={review} />
                        ))}
                        {/* Second Copy for Seamless Loop */}
                        {testimonials.map((review) => (
                            <TestimonialCard key={`second-${review.id}`} review={review} />
                        ))}
                        {/* Third Copy to ensure no gaps on wide screens during drag */}
                        {testimonials.map((review) => (
                            <TestimonialCard key={`third-${review.id}`} review={review} />
                        ))}
                    </motion.div>
                </div>

                {/* Call to Action - Minimal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8 px-4"
                >
                    <p className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors cursor-default">
                        Trusted by 2000+ happy clients. <Link href="/contact" className="text-yellow-600/80 hover:text-yellow-500 cursor-pointer underline underline-offset-2">Ready to Book Your Band?</Link>
                    </p>
                </motion.div>

            </div>
        </section >
    );
}

function TestimonialCard({ review }: { review: typeof testimonials[0] }) {
    return (
        <div
            className="w-[320px] md:w-[380px] flex-shrink-0 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6 transition-all duration-300 group select-none flex flex-col justify-between
            hover:bg-zinc-900 hover:border-yellow-500/50 hover:shadow-[0_4px_20px_-4px_rgba(234,179,8,0.15)] hover:-translate-y-1"
            onDragStart={(e) => e.preventDefault()} // Prevent native image drag
        >
            <div>
                {/* Author */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-700/50 bg-zinc-800">
                            <Image
                                src={review.image}
                                alt={review.name}
                                fill
                                className="object-cover"
                                draggable={false}
                            />
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-200 text-base">{review.name}</h4>
                            <div className="flex gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-800"}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Minimal Google Icon */}
                    <div className="opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84c.87-2.6 3.3-4.5 6.16-4.5z" fill="#EA4335" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="relative">
                    <p className="text-zinc-400 text-[15px] leading-relaxed line-clamp-5 group-hover:text-zinc-200 transition-colors font-medium">
                        "{review.text}"
                    </p>
                </div>
            </div>
        </div>
    );
}
