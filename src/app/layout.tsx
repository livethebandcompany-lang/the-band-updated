import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import GlobalLoader from "@/components/GlobalLoader";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import FacebookPixel from "@/components/FacebookPixel";
import GoogleTagManager from "@/components/GoogleTagManager";
import { ToastProvider } from "@/context/ToastContext";
import FloatingContactIcons from "@/components/FloatingContactIcons";
import Providers from "@/components/Providers";
import SmoothScrollerClient from "@/components/SmoothScrollerClient";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const merriweather = Merriweather({ subsets: ["latin"], variable: "--font-merriweather", weight: ["300", "400", "700", "900"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thebandcompany.in"),
  title: {
    default: "The Band Company | Best Live Music for Weddings & Events",
    template: "%s | The Band Company",
  },
  description:
    "Premium live music, bands, and singers for weddings, sangeet, haldi, corporate events, and private villa parties in Mumbai, Pune, Lonavala, and Alibaug.",
  keywords: [
    "live band mumbai", "wedding band pune", "sangeet live music",
    "corporate event band", "live singer lonavala", "alibaug wedding music",
    "destination wedding band",
  ],
  openGraph: {
    title: "The Band Company | Premium Live Music Experiences",
    description:
      "Elevate your celebrations with India's most versatile live band. Available for weddings, corporate events, and private villa parties.",
    url: "https://www.thebandcompany.in",
    siteName: "The Band Company",
    images: [
      {
        url: "https://res.cloudinary.com/dnr4pajkw/image/upload/b_black,c_pad,w_1200,h_630/v1772124790/the_band_company_logo_f5kq5p.png",
        width: 1200,
        height: 630,
        alt: "The Band Company Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Band Company | Live Music",
    description: "Premium live music for weddings, corporate events, and private celebrations.",
    images: ["https://res.cloudinary.com/dnr4pajkw/image/upload/b_black,c_pad,w_1200,h_630/v1772124790/the_band_company_logo_f5kq5p.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Speed: preconnect to Google Tag Manager & analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors`}
      >
        {/* Tracking — all afterInteractive, never block render */}
        <AnalyticsTracker />
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <Suspense fallback={null}>
          <GoogleTagManager />
        </Suspense>

        <GlobalLoader />

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <Providers>
            <ToastProvider>
              <SmoothScrollerClient>
                {children}
                <FloatingContactIcons />
              </SmoothScrollerClient>
            </ToastProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}