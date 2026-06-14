"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const milestones = [
    {
        year: "2017",
        title: "The Beginning",
        desc: "The Band Company was formed with a vision to create elevated, experience-driven live music. 10 Shows.",
    },
    {
        year: "2018",
        title: "Taking the Stage",
        desc: "We officially began performing live, building our sound and presence across private and curated events. 50 Shows.",
    },
    {
        year: "2019",
        title: "Building Our Identity",
        desc: "Crossing 100 shows helped us define our signature style and performance approach. 100 Shows.",
    },
    {
        year: "2020",
        title: "A Historic Milestone",
        desc: "We became participants in the Guinness Book of World Records as part of the Largest Band Ever Formed. 200 Shows.",
    },
    {
        year: "2021",
        title: "Creating Original Music",
        desc: "This year marked our shift from performers to creators with the introduction of original compositions. 350 Shows.",
    },
    {
        year: "2022",
        title: "Scaling New Heights",
        desc: "With growing demand, we expanded our formats and strengthened our live performance ecosystem. 600 Shows.",
    },
    {
        year: "2023",
        title: "A Landmark Year",
        desc: "We crossed 1000 live performances and shared the stage with Mrunal Panchal, Varun Sood & Suryakumar Yadav. 1000 Shows.",
    },
    {
        year: "2024",
        title: "Stronger Collaborations",
        desc: "Our journey continued with high-impact performances and collaboration with Raj Shamani. 1500 Shows.",
    },
    {
        year: "2025",
        title: "A Legacy in Motion",
        desc: "We reached 2000 live performances and performed alongside Alakh Pandey, Seema Singh, Ayush Mehra & Anubhav Singh Bassi. 2000 Shows.",
    },
];

function MilestoneItem({ milestone, index }: { milestone: typeof milestones[0]; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[340px] group"
        >
            <div className="relative pt-8 pl-4">
                {/* Timeline Dot */}
                <div className="absolute top-0 left-4 w-3 h-3 bg-yellow-500 rounded-full ring-4 ring-white shadow-sm group-hover:scale-125 group-hover:bg-yellow-600 transition-all duration-300" />

                {/* Horizontal Line */}
                {index < milestones.length - 1 && (
                    <div className="absolute top-[5px] left-7 w-[calc(100%+32px)] md:w-[calc(100%+48px)] h-px bg-zinc-200" />
                )}

                {/* Content */}
                <div className="space-y-2 pt-4">
                    <span className="inline-block text-sm font-semibold text-yellow-600 tracking-wide">
                        {milestone.year}
                    </span>
                    <h3 className="text-lg md:text-xl font-semibold text-zinc-900 group-hover:text-yellow-600 transition-colors">
                        {milestone.title}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        {milestone.desc}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function MilestoneSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 350;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="py-10 md:py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
                {/* Header */}
                <div className="mb-8 md:mb-12 max-w-2xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mb-2 md:mb-3"
                    >
                        Our <span className="text-yellow-600">Milestones</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-sm md:text-base text-zinc-600"
                    >
                        A journey of growth, dedication, and memorable achievements.
                    </motion.p>
                </div>

                {/* Timeline Container with Navigation */}
                <div className="relative px-4 sm:px-6 md:px-12">
                    {/* Left Navigation Button */}
                    <button
                        onClick={() => scroll("left")}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white border-2 border-zinc-200 rounded-full shadow-lg hover:bg-yellow-50 hover:border-yellow-500 hover:shadow-xl transition-all active:scale-95"
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Navigation Button */}
                    <button
                        onClick={() => scroll("right")}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white border-2 border-zinc-200 rounded-full shadow-lg hover:bg-yellow-50 hover:border-yellow-500 hover:shadow-xl transition-all active:scale-95"
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Horizontal Timeline */}
                    <div
                        ref={scrollRef}
                        className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {milestones.map((milestone, index) => (
                            <MilestoneItem key={milestone.year} milestone={milestone} index={index} />
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 flex items-center gap-2 text-sm text-zinc-400"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="hidden md:inline">Use arrow buttons to navigate</span>
                    <span className="md:hidden">Swipe to explore</span>
                </motion.div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
