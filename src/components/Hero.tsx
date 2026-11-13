"use client";

import { Star } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import InquiryBar from "@/components/InquiryBar";

type LocationKey = "pune" | "lonavala" | "destination";

const LOCATION_CONFIG: Record<
  LocationKey,
  { src: string; label: string; alt: string; inquiryCity: string }
> = {
  pune: {
    src: "/images/Pune.png",
    label: "Pune",
    alt: "The Band Company live band performing in Pune",
    inquiryCity: "Pune",
  },
  lonavala: {
    src: "/images/Lonavala.png",
    label: "Lonavala",
    alt: "The Band Company live band performing in Lonavala",
    inquiryCity: "Lonavala ",
  },
  destination: {
    src: "/images/Destinations.png",
    label: "Other Destinations",
    alt: "The Band Company live band for destination weddings and events",
    inquiryCity: "",
  },
};

// Haversine formula to compute distance in km between two lat/lon pairs
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
  const [location, setLocation] = useState<LocationKey>("destination");

  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Transform scroll progress to opacity values (darkens as you scroll)
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.85]);

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocation("destination");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Check distance to Lonavala and Pune
        // Lonavala center: 18.7557, 73.4091 (radius ~25km)
        const distToLonavala = getDistanceFromLatLonInKm(latitude, longitude, 18.7557, 73.4091);
        // Pune center: 18.5204, 73.8567 (radius ~45km)
        const distToPune = getDistanceFromLatLonInKm(latitude, longitude, 18.5204, 73.8567);

        let resolved: LocationKey = "destination";

        if (distToLonavala <= 25) {
          resolved = "lonavala";
        } else if (distToPune <= 45) {
          resolved = "pune";
        } else {
          // Attempt reverse geocoding fallback
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
              { signal: AbortSignal.timeout(2500) }
            );
            if (res.ok) {
              const data = await res.json();
              const addr = JSON.stringify(data.address || {}).toLowerCase();
              if (addr.includes("lonavala") || addr.includes("lonavla")) {
                resolved = "lonavala";
              } else if (addr.includes("pune") || addr.includes("poona")) {
                resolved = "pune";
              }
            }
          } catch {
            // Reverse geocode failed or timed out; stick with distance result
          }
        }

        setLocation(resolved);

        try {
          localStorage.setItem("tbc_hero_location", resolved);
        } catch {
          // ignore localStorage error
        }
      },
      (error) => {
        console.warn("Geolocation permission error:", error.message);
        setLocation("destination");
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      }
    );
  }, []);

  useEffect(() => {
    // Check saved preference first
    try {
      const saved = localStorage.getItem("tbc_hero_location") as LocationKey | null;
      if (saved && ["pune", "lonavala", "destination"].includes(saved)) {
        setLocation(saved);
        return;
      }
    } catch {
      // ignore
    }

    // Automatically ask for location via browser prompt
    requestLocation();
  }, [requestLocation]);

  const currentConfig = LOCATION_CONFIG[location] || LOCATION_CONFIG.destination;

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] flex flex-col justify-between bg-zinc-950 text-white overflow-hidden"
    >
      {/* Edge-to-Edge Hero Background Image */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentConfig.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Top offset for navbar clearance - shifted up ~30px so characters are fully visible */}
            <div className="absolute top-8 md:top-12 inset-x-0 bottom-0">
              <NextImage
                src={currentConfig.src}
                alt={currentConfig.alt}
                fill
                priority
                sizes="100vw"
                quality={95}
                className="object-cover object-[center_top]"
              />
            </div>

            {/* Subtle top gradient for navbar contrast */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

            {/* Subtle bottom gradient to blend the stage into the statistics and inquiry bar */}
            <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent pointer-events-none z-10" />

            {/* Scroll-based darkening overlay */}
            <motion.div
              className="absolute inset-0 bg-black pointer-events-none z-10 will-change-[opacity]"
              style={{ opacity: overlayOpacity }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Accessible Title */}
      <h1 className="sr-only">
        The Band Company - Curated Live Music for Celebrations that deserve to be remembered.
      </h1>

      {/* Spacer to push footer down while keeping hero visual unobstructed */}
      <div className="relative z-10 flex-grow w-full min-h-[260px] md:min-h-[340px]" />

      {/* Statistics Footer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-3">
        <div className="flex flex-row justify-between md:justify-center items-start gap-2 md:gap-16 text-center w-full">
          {/* Stat 1 */}
          <div className="flex flex-col items-center w-1/3 md:w-auto md:min-w-[250px]">
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

      {/* Inquiry Bar */}
      <div className="relative z-20 w-full px-4 mb-4 animate-fade-in-up">
        <InquiryBar
          source="Home Hero"
          dropdownDirection="up"
          selectedDestination={currentConfig.inquiryCity}
        />
      </div>
    </section>
  );
}