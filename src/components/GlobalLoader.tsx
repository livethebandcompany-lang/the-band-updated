"use client";

import { useEffect, useState } from "react";

export default function GlobalLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide after page load or max 700ms — whichever is first
    const hide = () => setShow(false);
    const timer = setTimeout(hide, 700);
    window.addEventListener("load", hide, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", hide);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950"
      style={{ animation: "loaderFadeOut 0.5s ease-in-out 0.6s forwards" }}
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning ring — pure CSS, no Framer */}
        <div className="absolute w-32 h-32 rounded-full border-t-2 border-r-2 border-yellow-500/50 animate-spin" style={{ animationDuration: "1.5s" }} />
        {/* Logo */}
        <div className="relative z-10 w-20 h-20 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png"
            alt="The Band Company"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <p className="mt-6 text-yellow-500 font-serif tracking-widest text-xs uppercase">
        The Band Company
      </p>
      <style>{`
        @keyframes loaderFadeOut {
          to { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  );
}
