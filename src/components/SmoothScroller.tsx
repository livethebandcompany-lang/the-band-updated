"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,          // scroll animation duration in seconds
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out easing
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Removed the window.dispatchEvent("scroll") to prevent infinite loop on mobile devices.
        // Framer Motion automatically reads native window scroll positions, so this manual dispatch is unnecessary and dangerous.

        let rafId: number;

        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
