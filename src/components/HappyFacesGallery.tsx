"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from "framer-motion";
import { Music, Camera, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample Happy Faces / Event Images
const defaultGalleryImages = [
    { id: 1, src: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122195/g2.eb2eade777cf3cbf8e50_aimtlz.jpg", title: "Joyful Rhythms", desc: "Capturing the beat of the night" },
    { id: 2, src: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122194/g1.b68ebd076287c3e59c12_u4yfbr.jpg", title: "Shared Laughter", desc: "Moments that echo forever" },
    { id: 3, src: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122195/g5.942e3dfb9d338dd6a8d6_o7b6ug.jpg", title: "Golden Hour", desc: "Friends under the lights" },
    { id: 4, src: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122196/g8.35e1a17d858945955662_on0f4c.jpg", title: "Party Selfie", desc: "Making memories together" },
    { id: 5, src: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122196/g7.a4e54c543f59f91383a8_ohhmw7.jpg", title: "Concert Highs", desc: "Lost in the music" },
    { id: 6, src: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122196/g9.815c1d691f3aac9a0a6c_khcvvk.jpg", title: "Vibes Only", desc: "Good times, great people" },
    { id: 7, src: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122196/g10.bab5a370fb1f88aca18c_n0gbus.jpg", title: "Band Spirit", desc: "Performing with soul" },
    { id: 8, src: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772122197/g11.b78e4e881e71fa1633e8_gwyre6.jpg", title: "Backstage Fun", desc: "The artists behind the art" },
];

export default function HappyFacesGallery({ galleryImages }: { galleryImages?: any[] }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const displayImages = galleryImages && galleryImages.length > 0 ? galleryImages : defaultGalleryImages;

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Smooth spring physics for heavy, cinematic feel
    const smoothProgress = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20, restDelta: 0.001 });

    // Map vertical scroll to horizontal transform
    const x = useTransform(smoothProgress, [0, 1], ["10%", "-90%"]); // Starts slightly shifted right to avoid left cut

    // Parallax opacity for engaging/disengaging
    const opacity = useTransform(smoothProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);
    const scale = useTransform(smoothProgress, [0, 0.02, 0.98, 1], [0.8, 1, 1, 0.8]);

    return (
        // Tall container to define scroll length (400vh)
        <section ref={targetRef} className="relative h-[400vh] bg-zinc-100 dark:bg-black">

            {/* Sticky Container - The Viewport */}
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-white dark:bg-black">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black opacity-50" />
                </div>

                {/* Cinematic Motion Container */}
                <motion.div
                    style={{ x, opacity, scale }}
                    className="flex gap-10 px-4 md:gap-20 md:px-20 will-change-transform" // Adjusted gaps and padding
                >

                    {/* Intro Title Card */}
                    <div className="relative h-[60vh] w-[80vw] md:w-[40vw] flex-shrink-0 flex flex-col justify-center items-start z-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-7xl md:text-9xl font-normal text-white tracking-tight mb-6 leading-[0.8]">
                                HAPPY <br />
                                <span className="text-yellow-500">FACES</span>
                            </h2>
                            <p className="text-xl text-neutral-400 max-w-md font-light tracking-wide border-l border-neutral-700 pl-6">
                                A curated collection of smiles, energy, and unforgettable moments from our journey.
                            </p>
                            <div className="mt-12 flex gap-4 text-neutral-500">
                                <Music size={24} />
                                <Camera size={24} />
                                <Heart size={24} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Gallery Cards */}
                    {displayImages.map((img, index) => (
                        <GalleryCard key={img.id || index} img={img} index={index} />
                    ))}

                    {/* Outro Card */}
                    <div className="relative h-[60vh] w-[40vw] flex-shrink-0 flex flex-col justify-center items-center z-20">
                        <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter text-center">
                            YOUR <br /> MOMENT <br /> AWAITS
                        </h3>
                        <Link href="/contact" className="mt-8 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform tracking-wider text-center inline-block">
                            BOOK NOW
                        </Link>
                    </div>

                </motion.div>
            </div>

            {/* Scroll Indicator (Optional, subtle) */}
            <motion.div
                style={{ opacity: useTransform(smoothProgress, [0, 0.1], [1, 0]) }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-sm tracking-[0.3em] font-light animate-pulse"
            >
                SCROLL TO EXPLORE
            </motion.div>
        </section>
    );
}

// Separate component for each card to handle its own viewport intersection

function GalleryCard({ img, index }: { img: any, index: number }) {
    const ref = useRef(null);
    // Use a narrow horizontal margin to detect when the card is in the CENTER of the screen.
    // "0px -45% 0px -45%" creates a vertical detection strip in the middle 10% of the viewport width.
    const isInView = useInView(ref, { margin: "0px -45% 0px -45%", amount: 0.1 });

    return (
        <div
            ref={ref}
            className={`group relative h-[60vh] w-[35vh] md:w-[45vh] flex-shrink-0 rounded-[2rem] overflow-hidden bg-neutral-900 shadow-2xl transition-all duration-700 ease-out ${isInView ? 'scale-110 z-10' : 'scale-95'}`}
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
            }}
        >
            {/* Image */}
            <div className="absolute inset-0">
                <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 35vh, 45vh"
                    className={`object-cover transition-all duration-1000 ease-out ${isInView ? 'scale-110 saturate-100' : 'scale-100 saturate-0'}`}
                />
                {/* Overlay - Lighter for visibility (opacity-30 instead of 40/80) */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-700 ${isInView ? 'opacity-70' : 'opacity-90'}`} />
            </div>


            {/* Content Overlay */}
            <div className={`absolute inset-0 flex flex-col justify-end p-8 transition-transform duration-700 ${isInView ? 'translate-y-0' : 'translate-y-8'}`}>
                <div className={`h-[1px] bg-yellow-400/70 mb-4 transition-all duration-700 ${isInView ? 'w-24' : 'w-0'}`} />
                <span className="text-xs font-bold tracking-[0.3em] text-yellow-400/80 mb-2 uppercase">
                    0{index + 1}
                </span>
                <h3 className={`text-3xl font-bold text-yellow-400 mb-2 tracking-tight drop-shadow-lg transition-transform duration-700 ${isInView ? 'translate-x-2' : 'translate-x-0'}`}>
                    {img.title}
                </h3>
                <p className={`text-sm text-white/90 font-light drop-shadow transition-opacity duration-700 delay-100 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
                    {img.desc}
                </p>
            </div>

            {/* Visual Highlight Ring for active state */}
            <div className={`absolute inset-0 border-2 rounded-[2rem] pointer-events-none transition-colors duration-700 ${isInView ? 'border-white/20' : 'border-transparent'}`} />
        </div>
    );
}
