"use client";

import { Star } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import InquiryBar from "@/components/InquiryBar";

const Counter = ({
  from,
  to,
  duration = 2.5,
}: {
  from: number;
  to: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1,
        );
        // easeOutExpo easing function
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(easeOut * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count}</span>;
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    // Defer heavy video buffering until after First Contentful Paint
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.warn("Autoplay deferred:", e));
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Transform scroll progress to opacity values (darkens as you scroll)
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.85]);

  return (
    <section ref={heroRef} className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden">
      {/* Background Video (Removed Parallax 'y' transform for massive performance boost) */}
      <motion.div className="absolute inset-0 z-0 h-full">

        {/* Heavy Video  */}
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          poster="https://images.unsplash.com/photo-1459749411177-2da37f7911fe?auto=format&fit=crop&q=50&w=800"
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
        >
          {mounted && (
            <source
              src="https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          )}
        </video>

        {/* Lighter gradient overlay for vibrant visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

        {/* Scroll-based darkening overlay */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none will-change-[opacity]"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Main Content Container - Flex Grow to push footer down */}
      <div className="relative z-10 container mx-auto px-4 flex-grow flex flex-col justify-center items-center pt-12 pb-4 md:pt-16 md:pb-6">
        <div className="text-center w-full space-y-4 animate-fade-in-up">
          {/* Logo (Static div instead of motion.div so it renders instantly on SSR for LCP calculation) */}
          <div className="mb-2 flex justify-center animate-fade-in-up">
            <NextImage
              src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png"
              alt="The Band Company Logo"
              width={320}
              height={320}
              priority
              fetchPriority="high"
              style={{ width: 'auto', height: 'auto' }}
              className="w-36 md:w-56 lg:w-72 h-auto object-contain drop-shadow-lg"
            />
          </div>

          {/* Decorative Line Above */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            <div className="h-0.5 w-32 md:w-48 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-60"></div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center justify-center font-serif font-semibold tracking-wide leading-snug drop-shadow-md text-center max-w-4xl mx-auto px-4"
          >
            <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl relative inline-block text-white pb-2 leading-snug">
              Curated Live Music for
              <br />
              Celebrations that deserve to be remembered.
            </span>
          </motion.h1>

          {/* Decorative Line Below */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center mt-4"
          >
            <div className="h-0.5 w-32 md:w-48 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-60"></div>
          </motion.div>
        </div>
      </div>

      {/* Inquiry Bar - Absolute positioned at bottom or relative below title */}


      {/* Statistics Footer - Normal Flow (Not Absolute) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-4">
        <div className="flex flex-row justify-between md:justify-center items-start gap-2 md:gap-16 text-center w-full">

          {/* Stat 1 */}
          <div className="flex flex-col items-center w-1/3 md:w-auto md:min-w-[250px]">
            {/* Fixed height container for top element to ensure separators align */}
            <div className="h-8 md:h-14 flex items-end mb-2 md:mb-3">
              <span className="text-2xl md:text-4xl font-serif font-bold text-white drop-shadow-sm leading-none">
                <Counter from={0} to={2000} duration={1.5} />+
              </span>
            </div>
            <div className="w-8 md:w-16 h-px bg-yellow-500 mb-2 md:mb-3 opacity-80"></div>
            <span className="text-[9px] md:text-[15px] font-bold text-yellow-500 uppercase tracking-wider md:tracking-widest leading-tight md:leading-relaxed">
              Shows
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center w-1/3 md:w-auto md:min-w-[250px]">
            <div className="h-8 md:h-14 flex items-end mb-2 md:mb-3">
              <span className="text-2xl md:text-4xl font-serif font-bold text-white drop-shadow-sm leading-none">
                <Counter from={0} to={8} duration={1.5} />+
              </span>
            </div>
            <div className="w-8 md:w-16 h-px bg-yellow-500 mb-2 md:mb-3 opacity-80"></div>
            <span className="text-[9px] md:text-[15px] font-bold text-yellow-500 uppercase tracking-wider md:tracking-widest leading-tight md:leading-relaxed max-w-[120px] md:max-w-none mx-auto">
              Years of Experience
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center w-1/3 md:w-auto md:min-w-[250px]">
            <div className="h-8 md:h-14 flex items-end mb-2 md:mb-3">
              <Star className="w-6 h-6 md:w-10 md:h-10 text-white fill-white drop-shadow-sm" />
            </div>
            <div className="w-8 md:w-16 h-px bg-yellow-500 mb-2 md:mb-3 opacity-80"></div>
            <span className="text-[9px] md:text-[15px] font-bold text-yellow-500 uppercase tracking-wider md:tracking-widest leading-tight md:leading-relaxed max-w-[120px] md:max-w-[280px] mx-auto">
              Guinness World Record Holder
            </span>
          </div>

        </div>
      </div>

      {/* Inquiry Bar - Absolute positioned at bottom or relative below title */}
      <div className="relative z-20 w-full px-4 mb-4 animate-fade-in-up">
        <InquiryBar source="Home Hero" dropdownDirection="up" />
      </div>
    </section>
  );
}