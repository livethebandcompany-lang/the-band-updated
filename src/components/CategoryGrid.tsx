"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Pixel Perfect Categories from Reference
const defaultCategories = [
    {
        name: "Solo Band",
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1778005840/IMG-20241005-WA0130.jpg_fp96un.jpg",
        description: "Vocal with Guitar"
    },
    {
        name: "Duet Band",
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122135/duet.02006e0312a91f8bbc23_moxnbh.jpg",
        description: "Vocal with Guitar + Clapbox"
    },
    {
        name: "3-Piece Band",
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122134/ban1.1529d36c5136ef033bad_f7gxgv.jpg",
        description: "Vocal with guitar + Clapbox + Keyboard"
    },
    {
        name: "4-Piece Band",
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098356/duet_band_nanobanan_bsf3zz.jpg",
        description: "Vocal with Guitar + Clapbox + Keyboard + Drums"
    },
    {
        name: "Full Band",
        image: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122135/fullfledged.0823d245f3ce65cecc4b_s5lk3i.jpg",
        description: "Vocal with Guitar + Lead Guitar + Bass Guitar + Keyboard + Drums"
    },
];

function CategoryCard({ cat, index }: { cat: any, index: number }) {
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

    return (
        <motion.div
            key={`${cat.name}-${index}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={handleInteraction}
            onTouchStart={handleInteraction}
            className={`w-full max-w-[240px] md:w-[220px] lg:w-[240px] bg-zinc-900 rounded-[30px] flex flex-col items-center relative overflow-hidden transition-all duration-500 flex-shrink-0 pb-8 border group h-[350px] cursor-pointer ${isActive
                ? 'shadow-[0_0_20px_rgba(234,179,8,0.15)] border-yellow-500/30'
                : 'shadow-sm border-zinc-800'
                } hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:border-yellow-500/30`}
        >
            {/* Hover Glow Effect Behind Content */}
            <div className={`absolute inset-0 bg-gradient-to-b from-yellow-500/0 via-yellow-500/5 to-yellow-500/10 transition-opacity duration-500 pointer-events-none z-0 ${isActive ? 'opacity-100' : 'opacity-0'
                } group-hover:opacity-100`}></div>

            {/* Circular Image Container */}
            <div className="mt-8 mb-4 relative z-10 shrink-0">
                <div className={`w-40 h-40 rounded-full overflow-hidden border-4 shadow-lg relative z-10 transition-colors duration-300 ${isActive ? 'border-yellow-500' : 'border-zinc-800'
                    } group-hover:border-yellow-500`}>
                    <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="160px"
                        className={`object-cover transition-transform duration-500 ${isActive ? 'scale-105' : ''
                            } group-hover:scale-105`}
                    />
                </div>
                {/* Decorative subtle ring behind */}
                <div className={`absolute inset-0 border rounded-full z-0 transition-all duration-500 ${isActive ? 'scale-125 border-yellow-500/30' : 'scale-110 border-zinc-700'
                    } group-hover:scale-125 group-hover:border-yellow-500/30`}></div>
            </div>

            {/* Category Name */}
            <h3 className={`text-lg font-bold uppercase tracking-widest text-center px-2 z-10 font-sans transition-colors drop-shadow-md mb-2 ${isActive ? 'text-yellow-500' : 'text-white'
                } group-hover:text-yellow-500`}>
                {cat.name}
            </h3>

            {/* Description */}
            <p className={`text-[11px] font-medium text-center px-4 leading-relaxed uppercase tracking-wider z-10 transition-colors ${isActive ? 'text-zinc-300' : 'text-zinc-400'
                } group-hover:text-zinc-300`}>
                {cat.description}
            </p>
        </motion.div>
    );
}

export default function CategoryGrid({ categories }: { categories?: any[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="pt-8 pb-20 bg-white dark:bg-zinc-950 relative">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header - Aligned to Reference */}
                <div className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-normal text-white mb-3 tracking-tight">
                        Our Line-up
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl font-normal max-w-2xl mx-auto">
                        Every event demands a different energy. Select the line-up that matches your
                        mood and scale.
                    </p>
                </div>

                {/* Main Content Area - Scrollable Grid with Buttons */}
                <div className="relative group/slider">
                    {/* Left Button */}
                    <button 
                        onClick={() => scroll("left")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 border border-zinc-700 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black hover:scale-110 md:flex hidden backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory pb-8 md:flex-wrap lg:flex-nowrap md:justify-center md:gap-4 md:w-full md:max-w-[1440px] md:mx-auto relative z-10"
                    >
                        {displayCategories.map((cat, index) => (
                            <div key={`${cat.name}-${index}`} className="w-full max-w-[240px] md:w-[220px] lg:w-[240px] shrink-0 snap-center first:ml-4 last:mr-4 md:first:ml-0 md:last:mr-0">
                                <CategoryCard cat={cat} index={index} />
                            </div>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button 
                        onClick={() => scroll("right")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 border border-zinc-700 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black hover:scale-110 md:flex hidden backdrop-blur-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Indicator */}
                <div className="md:hidden text-center mt-[-10px]">
                    <p className="text-xs text-zinc-500">Swipe to explore lineups</p>
                </div>

            </div>
        </section>
    );
}
