"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";

const defaultArtists = [
    { id: 1, name: "Samad", role: "Founder", image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098359/samad_rafdsi.webp", type: "founder" },
    { id: 2, name: "Tejas", role: "Lead Singer, Guitarist", image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098366/Tejas_t7n8p4.webp", type: "performer" },
    { id: 3, name: "Neha", role: "CEO", image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772819911/Snapchat-35232342.jpg_cq5wmw.jpg", type: "hr" },
    { id: 4, name: "Taj ", role: "Operations Head", image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098363/Taj_sqrdnv.webp", type: "ops" },
];


function ArtistCard({ artist, isActive }: { artist: any; isActive: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={cardRef}
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="min-w-[200px] w-[200px] sm:min-w-[240px] sm:w-[240px] md:min-w-[280px] md:w-[280px] aspect-[3/4] rounded-2xl overflow-hidden group snap-start snap-center relative bg-black flex-shrink-0"
            data-artist-id={artist.id}
        >
            <Image
                src={artist.image}
                alt={artist.name}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, 280px"
                className={`object-cover transition-opacity duration-500 ${isActive
                    ? 'opacity-100 md:opacity-50 md:group-hover:opacity-100'
                    : 'opacity-50 group-hover:opacity-100'
                    }`}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

            {/* Text Overlay - Aligned Bottom Left */}
            <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full z-10">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">
                    {artist.name}
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 font-medium tracking-wide">
                    {artist.role}
                </p>
            </div>
        </motion.div>
    );
}

export default function ArtistSection({ artists }: { artists?: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const displayArtists = artists && artists.length > 0 ? artists : defaultArtists;

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            // Desktop stride: 280px (w) + 24px (gap-6) = 304px
            const scrollAmount = 304;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <section className="pt-24 md:pt-32 pb-24 bg-black relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900/50 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative">
                    <div className="w-full text-center md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-0">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-2 md:mb-3">Our <span className="text-yellow-500">Team</span></h2>
                        <p className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto">The People Behind Our Success</p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-2 ml-auto z-10">
                        <button
                            onClick={() => scroll("left")}
                            className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800 text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800 text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-4 md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayArtists.map((artist, index) => (
                        <ArtistCard
                            key={artist.id || index}
                            artist={artist}
                            isActive={true}
                        />
                    ))}
                </div>

                {/* Mobile Indicator */}
                <div className="md:hidden text-center mt-4">
                    <p className="text-xs text-zinc-600">Swipe to explore</p>
                </div>
            </div>
        </section>
    );
}
