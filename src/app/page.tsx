export const dynamic = 'force-dynamic';

import nextDynamic from "next/dynamic";
import Link from "next/link";
import { Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import LaunchBanner from "@/components/LaunchBanner";

// Database imports
import connectDB from "@/lib/db";
import { seedIfEmpty } from "@/lib/dbSeed";
import TeamMember from "@/models/TeamMember";
import HappyFace from "@/models/HappyFace";
import TrendingMoment from "@/models/TrendingMoment";
import LineupItem from "@/models/LineupItem";
import Destination from "@/models/Destination";

// Below-fold sections — loaded lazily to reduce initial JS bundle
const CinematicVideoSlider = nextDynamic(() => import("@/components/CinematicVideoSlider"));
const DestinationsSection = nextDynamic(() => import("@/components/DestinationsSection"));
const IntroSection = nextDynamic(() => import("@/components/IntroSection"));
const HappyFacesGallery = nextDynamic(() => import("@/components/HappyFacesGallery"));
const TestimonialsSection = nextDynamic(() => import("@/components/TestimonialsSection"));
const ArtistSection = nextDynamic(() => import("@/components/ArtistSection"));
const FAQSection = nextDynamic(() => import("@/components/FAQSection"));
const Footer = nextDynamic(() => import("@/components/Footer"));

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Band Company | Live Music for Weddings & Events',
  description: 'Book the best live music band in Mumbai, Pune, and Maharashtra for weddings, corporate events, sangeet, haldi, and private villa parties.',
  keywords: ['live band', 'best wedding band in mumbai', 'live bands in pune', 'book a band for event'],
  openGraph: {
    title: 'The Band Company | Premium Live Music Experiences',
    description: 'Elevate your celebrations with India\'s most versatile live band.',
  }
};

export default async function Home() {
  await connectDB();
  await seedIfEmpty();

  const [team, happyFaces, trendingMoments, lineups, destinations] = await Promise.all([
    TeamMember.find().sort({ order: 1 }),
    HappyFace.find().sort({ order: 1 }),
    TrendingMoment.find().sort({ order: 1 }),
    LineupItem.find().sort({ order: 1 }),
    Destination.find().sort({ order: 1 })
  ]);

  // Map Mongoose documents to plain JS objects to avoid serialization issues
  const plainTeam = team.map(doc => ({
    id: doc._id.toString(),
    name: doc.name,
    role: doc.role,
    image: doc.image,
    type: doc.type
  }));

  const plainHappyFaces = happyFaces.map(doc => ({
    id: doc._id.toString(),
    src: doc.src,
    title: doc.title,
    desc: doc.desc
  }));

  const plainTrendingMoments = trendingMoments.map(doc => ({
    id: doc._id.toString(),
    instagramUrl: doc.instagramUrl || '',
    imageUrl: doc.imageUrl
  }));

  const plainLineups = lineups.map(doc => ({
    id: doc._id.toString(),
    name: doc.name,
    image: doc.image,
    description: doc.description
  }));

  const plainDestinations = destinations.map(doc => ({
    id: doc._id.toString(),
    name: doc.name,
    icon: doc.icon,
    slug: doc.slug
  }));

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 relative">
      <Navbar />

      <Hero />

      <IntroSection />

      <CategoryGrid categories={plainLineups} />


      <LaunchBanner />

      <CinematicVideoSlider reels={plainTrendingMoments} />
      <DestinationsSection destinations={plainDestinations} />



      <HappyFacesGallery galleryImages={plainHappyFaces} />

      {/* Reviews Section */}
      <TestimonialsSection />

      <ArtistSection artists={plainTeam} />


      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-zinc-950 px-4">
        <div className="container mx-auto max-w-5xl">
            <div className="p-10 md:p-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl text-center text-white">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4">
                    Planning a Celebration?
                    <span className="block">Bring It To Life With The Band Company</span>
                </h2>
                <p className="text-base md:text-lg mb-8 max-w-3xl mx-auto opacity-95 leading-relaxed">
                    From intimate gatherings to grand celebrations, we create live music experiences that get everyone singing, smiling, and making memories.
                    <span className="block mt-2 font-medium">Let's make your event unforgettable.</span>
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="tel:7779945379"
                        className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    >
                        <Phone className="w-5 h-5" />
                        Call 7779945379
                    </a>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-black font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

