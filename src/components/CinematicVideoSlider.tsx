"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";

// Default reels data - images paired with URLs
const defaultReels = [
    { instagramUrl: "https://www.instagram.com/reel/DSW5iwnDInn/", imageUrl: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122195/g2.eb2eade777cf3cbf8e50_aimtlz.jpg" },
    { instagramUrl: "https://www.instagram.com/reel/DSR5cSkjM2l/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", imageUrl: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122194/g1.b68ebd076287c3e59c12_u4yfbr.jpg" },
    { instagramUrl: "https://www.instagram.com/reel/DR9sxfcCHY8/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", imageUrl: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122195/g5.942e3dfb9d338dd6a8d6_o7b6ug.jpg" },
    { instagramUrl: "https://www.instagram.com/reel/DR4rmwrjPr4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", imageUrl: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122196/g8.35e1a17d858945955662_on0f4c.jpg" },
    { instagramUrl: "https://www.instagram.com/reel/DRecG1qDB2A/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", imageUrl: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122196/g7.a4e54c543f59f91383a8_ohhmw7.jpg" }
];

export default function CinematicVideoSlider({ reels }: { reels?: any[] }) {
    const isExplicitlyEmpty = reels !== undefined && reels.length === 0;
    const displayReels = reels && reels.length > 0 ? reels : (isExplicitlyEmpty ? [] : defaultReels);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Reset activeIndex to middle if displayReels changes
    useEffect(() => {
        if (displayReels.length > 0) {
            setActiveIndex(Math.floor(displayReels.length / 2));
        }
    }, [displayReels.length]);

    // Calculate circular index
    const getCircularIndex = (index: number, length: number) => {
        if (length === 0) return 0;
        return (index + length) % length;
    };

    const nextSlide = useCallback(() => {
        if (displayReels.length === 0) return;
        setActiveIndex((prev) => getCircularIndex(prev + 1, displayReels.length));
    }, [displayReels.length]);

    const prevSlide = useCallback(() => {
        if (displayReels.length === 0) return;
        setActiveIndex((prev) => getCircularIndex(prev - 1, displayReels.length));
    }, [displayReels.length]);

    // Auto-slide logic
    useEffect(() => {
        if (isPaused || displayReels.length === 0) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, activeIndex, nextSlide, displayReels.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "ArrowRight") nextSlide();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextSlide, prevSlide]);

    // Calculate styles for each card based on position relative to active index
    const getCardStyle = (index: number) => {
        const total = displayReels.length;
        if (total === 0) return {};
        let diff = (index - activeIndex + total) % total;
        if (diff > total / 2) diff -= total;

        const isActive = diff === 0;
        const absDiff = Math.abs(diff);
        const isRight = diff > 0;

        let transform = "";
        let zIndex = 0;
        let opacity = 0;
        let pointerEvents = "none";
        let filter = "brightness(0.5)"; // Darken inactive cards

        if (isActive) {
            transform = "translateX(0) translateZ(0) rotateY(0deg) scale(1)";
            zIndex = 20;
            opacity = 1;
            pointerEvents = "auto";
            filter = "brightness(1)";
        } else if (absDiff === 1) {
            // Immediate neighbors
            const xOffset = isRight ? "75%" : "-75%";
            const rotate = isRight ? "-25deg" : "25deg";
            transform = `translateX(${xOffset}) translateZ(-200px) rotateY(${rotate}) scale(0.9)`;
            zIndex = 10;
            opacity = 1;
            filter = "brightness(0.8)";
        } else if (absDiff === 2) {
            // Farther neighbors
            const xOffset = isRight ? "140%" : "-140%";
            const rotate = isRight ? "-50deg" : "50deg";
            transform = `translateX(${xOffset}) translateZ(-400px) rotateY(${rotate}) scale(0.8)`;
            zIndex = 5;
            opacity = 0.8;
            filter = "brightness(0.6)";
        } else {
            // Hidden
            transform = "translateX(0) translateZ(-600px) rotateY(0deg) scale(0)";
            zIndex = 0;
            opacity = 0;
        }

        return { transform, zIndex, opacity, pointerEvents, filter };
    };

    return (
        <section
            className="py-20 md:py-32 bg-black relative overflow-hidden perspective-[1200px] group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Header */}
            <div className="container mx-auto px-4 relative z-10 mb-12 text-center">
                <h2 className="text-4xl md:text-6xl font-normal text-gray-200 tracking-wide drop-shadow-2xl">
                    Trending Moments
                </h2>
                <p className="text-xl md:text-xl text-gray-400 font-normal tracking-wide drop-shadow-xl mt-2">
                    Some Happy Moments
                </p>
            </div>

            {isExplicitlyEmpty ? (
                /* Fallback Banner */
                <div className="container mx-auto px-4 max-w-4xl text-center py-16 relative z-20">
                    <div className="bg-gradient-to-tr from-purple-600/10 via-pink-600/10 to-yellow-500/10 border border-white/10 rounded-3xl p-12 md:p-16 relative overflow-hidden backdrop-blur-sm shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.05),transparent_70%)] pointer-events-none" />
                        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 mb-8 hover:scale-105 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-normal text-white mb-4 tracking-wide font-sans">
                            Catch Our Latest Vibes on Instagram
                        </h3>
                        <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                            Follow us to watch our performances, backstage fun, and beautiful client stories live from the stage.
                        </p>
                        <a 
                            href="https://www.instagram.com/thebandcompany" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 text-white font-bold rounded-full transition-all shadow-lg shadow-pink-500/20 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/30"
                        >
                            Follow @thebandcompany
                        </a>
                    </div>
                </div>
            ) : (
                /* 3D Carousel Container */
                <div className="relative h-[500px] md:h-[600px] w-full max-w-[1600px] mx-auto flex justify-center items-center preserve-3d">
                    {displayReels.map((reel, index) => {
                        const style = getCardStyle(index);
                        const isMain = index === activeIndex;

                        return (
                            <div
                                key={index}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] md:w-[320px] aspect-[9/16] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                                style={{
                                    transform: style.transform,
                                    zIndex: style.zIndex,
                                    opacity: style.opacity,
                                    pointerEvents: style.pointerEvents as any,
                                    filter: style.filter
                                }}
                                onClick={() => setActiveIndex(index)}
                            >
                                {/* Card Content */}
                                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5 group/card">
                                    {/* Image with overlay */}
                                    <div className="absolute inset-0 bg-black">
                                        <Image
                                            src={reel.imageUrl || reel.image}
                                            alt={`Instagram Moment ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                                            sizes="320px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
                                        
                                        {/* Play / Action overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                            {isMain ? (
                                                <a
                                                    href={reel.instagramUrl || reel.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-16 h-16 rounded-full bg-white/10 hover:bg-yellow-500 backdrop-blur-md text-white hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-black/40 group/btn"
                                                    title="Watch on Instagram"
                                                >
                                                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                                                </a>
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-black/40 text-white/70 flex items-center justify-center">
                                                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Instagram Brand tag */}
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 text-white/80">
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                                </svg>
                                                <span className="text-xs font-semibold tracking-wider font-sans uppercase">TBC Instagram</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {displayReels.length > 1 && (
                        <>
                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center text-white/50 hover:text-white transition-all z-50 hover:bg-white/10 rounded-full hover:scale-110 active:scale-95"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-10 h-10" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center text-white/50 hover:text-white transition-all z-50 hover:bg-white/10 rounded-full hover:scale-110 active:scale-95"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-10 h-10" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </section>
    );
}

