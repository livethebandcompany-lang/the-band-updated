"use client";

import React from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

const defaultDestinationsList = [
    { id: 1, name: "Lonavala", icon: LucideIcons.Mountain, slug: "best-live-music-band-lonavala-guide" },
    { id: 2, name: "Karjat", icon: LucideIcons.Sunrise, slug: "best-live-music-band-karjat" },
    { id: 3, name: "Alibaug", icon: LucideIcons.Palmtree, slug: "why-live-music-is-perfect-match-for-alibaug-beach-wedding" },
    { id: 4, name: "Mumbai", icon: LucideIcons.Building2, slug: "live-music-experiences-in-mumbai" },
    { id: 5, name: "Pune", icon: LucideIcons.Landmark, slug: "live-music-experiences-in-pune" },
    { id: 6, name: "Mahabaleshwar", icon: LucideIcons.CloudFog, slug: "live-music-experiences-in-mahabaleshwar" },
    { id: 7, name: "Goa", icon: LucideIcons.Sun, slug: "live-music-experiences-in-goa" },
    { id: 8, name: "Jaipur", icon: LucideIcons.Gem, slug: "how-live-music-creates-unforgettable-wedding-moments-in-jaipur" },
    { id: 9, name: "Bangalore", icon: LucideIcons.Cpu, slug: "live-music-in-bangalore-weddings-parties" },
    { id: 10, name: "Delhi NCR", icon: LucideIcons.Globe, slug: "how-live-music-is-redefining-weddings-events-in-delhi-ncr" },
    { id: 11, name: "Hyderabad", icon: LucideIcons.Building2, slug: "why-hyderabad-is-the-perfect-city-for-live-music-weddings-grand-events" },
    { id: 12, name: "Chennai", icon: LucideIcons.Anchor, slug: "experience-chennai-vibrant-wedding-culture-soulful-live-music" },
    { id: 13, name: "Kolkata", icon: LucideIcons.PenTool, slug: "from-royal-weddings-to-cultural-nights-live-music-trends-in-kolkata" },
    { id: 14, name: "Ahmedabad", icon: LucideIcons.Factory, slug: "best-live-music-band-in-ahmedabad-weddings-garba-luxury" },
    { id: 15, name: "Igatpuri", icon: LucideIcons.CloudFog, slug: "live-music-experiences-in-igatpuri" },
    { id: 16, name: "Nashik", icon: LucideIcons.Mountain, slug: "live-music-experiences-in-nashik" },
];


function DestinationCard({ city, index }: { city: any, index: number }) {
    const [isActive, setIsActive] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleInteraction = () => {
        setIsActive(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsActive(false);
        }, 5000);
    };

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Dynamically look up Lucide icon component or fall back to MapPin
    const IconComponent = typeof city.icon === 'string'
        ? ((LucideIcons as any)[city.icon] || LucideIcons.MapPin)
        : (city.icon || LucideIcons.MapPin);

    return (
        <motion.div
            key={city.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            onClick={handleInteraction}
            onTouchStart={handleInteraction}
            className={`w-full bg-zinc-900 rounded-xl border overflow-hidden group transition-all duration-300 cursor-pointer shadow-yellow-500/10 -translate-y-1 hover:border-zinc-800 hover:shadow-none hover:translate-y-0 ${isActive ? 'border-zinc-800 shadow-none translate-y-0' : 'border-yellow-500/30'}`}
        >
            <div className="h-28 flex items-center justify-center relative">
                {/* Yellow Stripe Accent - Hidden on Hover/Active */}
                <div className={`absolute bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:w-12 group-hover:h-3 group-hover:opacity-60 ${isActive ? 'w-12 h-3 opacity-60' : 'w-16 h-4 opacity-80'}`}></div>

                {/* Icon - Reverts stroke on hover/Active */}
                <IconComponent className={`w-10 h-10 text-white z-10 relative transition-all group-hover:stroke-1 ${isActive ? 'stroke-1' : 'stroke-[1.5]'}`} />
            </div>

            <div className={`py-3 text-center border-t border-zinc-800 transition-colors duration-300 group-hover:bg-zinc-900 ${isActive ? 'bg-zinc-900' : 'bg-yellow-500'}`}>
                <span className={`text-sm font-medium block truncate px-2 group-hover:text-zinc-300 ${isActive ? 'text-zinc-300' : 'text-black'}`}>
                    {city.name}
                </span>
            </div>
        </motion.div>
    );
}

export default function DestinationsSection({ destinations }: { destinations?: any[] }) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const rafRef   = React.useRef<number | null>(null);
    const displayDestinations = destinations && destinations.length > 0 ? destinations : defaultDestinationsList;

    // Smooth scroll with expo-out easing — same feel as Lenis
    const smoothScroll = (target: HTMLDivElement, delta: number, duration = 500) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        const start     = target.scrollLeft;
        const end       = Math.max(0, Math.min(start + delta, target.scrollWidth - target.clientWidth));
        const startTime = performance.now();

        const easeExpoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

        const step = (now: number) => {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            target.scrollLeft = start + (end - start) * easeExpoOut(progress);
            if (progress < 1) rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
    };

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        smoothScroll(scrollRef.current, dir === "right" ? 320 : -320);
    };

    React.useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

    return (
        <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-normal text-white mb-4">
                        Destinations We Elevate With Live Music
                    </h2>
                    <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full opacity-80"></div>
                </div>

                {/* Mobile view: Carousel with swipe and navigation arrows */}
                <div className="relative md:hidden">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll("left")}
                        aria-label="Scroll left"
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900/90 border border-yellow-500/40 text-yellow-500 shadow-lg backdrop-blur-sm hover:bg-black hover:scale-110 active:scale-95 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900/90 border border-yellow-500/40 text-yellow-500 shadow-lg backdrop-blur-sm hover:bg-black hover:scale-110 active:scale-95 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory gap-4 pb-8 px-10 relative"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {displayDestinations.map((city, index) => (
                            <Link
                                href={city.slug ? `/blog/${city.slug}` : '#'}
                                key={city.id || index}
                                className="no-underline block shrink-0 snap-start w-[160px]"
                            >
                                <DestinationCard city={city} index={index} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Laptop/Desktop view: Split in two rows, no scrolling */}
                <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-4">
                    {displayDestinations.map((city, index) => (
                        <Link
                            href={city.slug ? `/blog/${city.slug}` : '#'}
                            key={city.id || index}
                            className="no-underline block"
                        >
                            <DestinationCard city={city} index={index} />
                        </Link>
                    ))}
                </div>

                {/* Mobile hint text */}
                <div className="md:hidden text-center mt-3">
                    <p className="text-xs text-zinc-500">Swipe or use arrows to explore destinations</p>
                </div>
            </div>
        </section>
    );
}
