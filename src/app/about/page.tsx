"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtistSection from "@/components/ArtistSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mic2, Disc, Sliders, Music, Star, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import InquiryBar from "@/components/InquiryBar";

// --- DATA ---
const milestones = [
    { year: 2017, title: "The Beginning", subtitle: "10 Shows", desc: "The Band Company was formed with a vision to create elevated, experience-driven live music." },
    { year: 2018, title: "Taking the Stage", subtitle: "50 Shows", desc: "We officially began performing live, building our sound and presence across private and curated events." },
    { year: 2019, title: "Building Our Identity", subtitle: "100 Shows", desc: "Crossing 100 shows helped us define our signature style and performance approach." },
    { year: 2020, title: "A Historic Milestone", subtitle: "200 Shows | Guinness World Record", desc: "We became participants in the Guinness Book of World Records as part of the Largest Band Ever Formed." },
    { year: 2021, title: "Creating Original Music", subtitle: "350 Shows", desc: "This year marked our shift from performers to creators with the introduction of original compositions." },
    { year: 2022, title: "Scaling New Heights", subtitle: "600 Shows", desc: "With growing demand, we expanded our formats and strengthened our live performance ecosystem." },
    { year: 2023, title: "A Landmark Year", subtitle: "1000 Shows", desc: "We crossed 1000 live performances and shared the stage with Mrunal Panchal, Varun Sood & Suryakumar Yadav." },
    { year: 2024, title: "Stronger Collaborations", subtitle: "1500 Shows", desc: "Our journey continued with high-impact performances and collaboration with Raj Shamani." },
    { year: 2025, title: "A Legacy in Motion", subtitle: "2000 Shows", desc: "We reached 2000 live performances and performed alongside Alakh Pandey, Seema Singh, Ayush Mehra & Anubhav Singh Bassi." },
];

const reasons = [
    { title: "Tailored Live Music Experiences", icon: Music, desc: "We craft every performance to match your event’s vibe, whether it’s an intimate gathering or a grand celebration. Every note, every song is chosen with your guests in mind." },
    { title: "Wide Musical Versatility", icon: Disc, desc: "From Bollywood hits to international chartbusters, we play what your audience loves—live, fresh, and full of energy." },
    { title: "Memorable Stage Presence", icon: Star, desc: "When we perform, it’s more than music—it’s an experience. Our energy, charisma, and interaction keep your guests hooked from the first beat to the last." },
    { title: "Hassle-Free Event Support", icon: CheckCircle2, desc: "We take care of setup, soundchecks, and timing so you don’t have to. You enjoy the party, we make sure the music flows seamlessly." },
    { title: "We Are Musicians", icon: Mic2, desc: "On stage, it’s not just a performance—it’s our passion. Every chord, every rhythm, every harmony comes from our heart, and we bring that vibe straight to your event." },
    { title: "Customized Guest Engagement", icon: Users, desc: "We love connecting with your guests—taking live requests, creating sing-alongs, and making everyone part of the musical journey." },
];

// --- COMPONENTS ---





function WhatWeDoSection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900/50 to-transparent pointer-events-none" />



            <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="pl-4 lg:pl-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                                What <span className="text-yellow-500">We Do</span>
                            </h2>
                            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-light">
                                From intimate acoustic setups to full-band performances, The Band Company offers flexible formats including:
                            </p>
                        </motion.div>

                        <div className="space-y-8">
                            {[
                                { title: "Solo, Duet & Trio Performances", icon: Mic2, desc: "Perfect for intimate gatherings and acoustic ambiance." },
                                { title: "Full Live Band Experiences", icon: Disc, desc: "High-energy performances that light up the stage." },
                                { title: "Custom Setlists", icon: Sliders, desc: "Curated specifically to your audience & occasion." },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-yellow-500/50 transition-colors shadow-lg">
                                        <item.icon className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-normal font-serif tracking-wide text-white mb-2 group-hover:text-yellow-500 transition-colors" style={{ fontFamily: 'var(--font-oswald)', fontWeight: 400, letterSpacing: '0.04em' }}>{item.title}</h3>
                                        <p className="text-zinc-500 text-sm">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-10 text-white/80 italic border-l-4 border-yellow-500 pl-6 py-2"
                        >
                            “Every performance is thoughtfully designed to blend seamlessly with the vibe of the event, the venue, and the people in the room.”
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[550px] w-full max-w-md mx-auto rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl group"
                    >
                        <Image
                            src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098358/full_band_nzgcch.jpg"
                            alt="Live Band Performance"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function WhyChooseUsSection() {
    return (
        <section className="pt-0 pb-24 bg-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900/50 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why <span className="text-yellow-500">Choose Us</span></h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Elevating events with passion, professionalism, and performance.
                    </p>
                </div>

                <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
                    {reasons.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-yellow-500/30 hover:bg-zinc-900 transition-all duration-300 group min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] md:min-w-0 md:w-auto shrink-0 snap-center"
                        >
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black text-yellow-500 transition-colors">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">{item.title}</h3>
                            <p className="text-zinc-500 leading-relaxed text-sm group-hover:text-zinc-400 transition-colors">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
                {/* Mobile Indicator */}
                <div className="md:hidden text-center mt-[-10px]">
                    <p className="text-xs text-zinc-500">Swipe to view more reasons</p>
                </div>
            </div>
        </section>
    );
}

import MilestoneSection from "@/components/MilestoneSection";

// ... [Keep other imports if any]

export default function AboutPage() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const [artists, setArtists] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/public/team')
            .then(res => res.json())
            .then(data => {
                if (data && data.team) {
                    setArtists(data.team);
                }
            })
            .catch(err => console.error("Error fetching team:", err));
    }, []);

    return (
        <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 selection:text-yellow-500">
            <Navbar />

            {/* HEADER / HERO SECTION */}
            <section className="relative min-h-[85vh] w-full overflow-hidden flex items-center justify-center">
                <motion.div style={{ y: y1 }} className="absolute inset-0 w-full h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop"
                        alt="About Us Header"
                        fill
                        priority
                        className="object-cover scale-110"
                    />
                </motion.div>

                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-10" />

                <div className="relative z-20 w-full px-4 py-32 md:py-40 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="max-w-7xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-7xl font-extrabold mb-6 text-white tracking-tighter">
                            About <span className="text-yellow-500">Us</span>
                        </h1>
                        <div className="w-24 h-1 bg-yellow-500 mx-auto mb-10" />
                    </motion.div>
                </div>
            </section>

            {/* Inquiry Bar Section */}
            <section className="relative z-30 -mt-16 px-4">
                <InquiryBar className="shadow-2xl shadow-yellow-500/10" source="About Page" />
            </section>

            {/* NEW DESCRIPTION SECTION */}
            <section className="py-24 bg-black">
                <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto space-y-12"
                    >
                        {/* Minimalist Heading */}
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-xl font-medium font-bold text-yellow-500 tracking-[0.3em] uppercase">Who We Are</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                Creating <span className="text-zinc-500">Experiences</span> <br /> Through Live Music.
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="space-y-8 text-lg font-light leading-relaxed text-zinc-400">
                            <p className="text-xl md:text-2xl text-white/90">
                                The Band Company is a live music collective built on one simple belief —
                                <span className="text-yellow-500 font-medium"> music is not just heard, it is experienced.</span>
                            </p>

                            <p>
                                Founded with the vision of bringing high-quality, curated live music to people&apos;s most special moments,
                                we specialise in creating bespoke musical experiences for weddings, private celebrations,
                                corporate gatherings, luxury stays, and destination events across Mumbai, Pune, and beyond.
                            </p>

                            <p>
                                We are not just performers on a stage. We are experience creators, storytellers,
                                and mood-setters who understand that every event has a different soul — and music should reflect that.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
            <WhatWeDoSection />

            {/* OUR TEAM */}
            <ArtistSection artists={artists} />

            {/* WHY CHOOSE US */}
            <WhyChooseUsSection />

            {/* MILESTONES */}
            <MilestoneSection />

            {/* CTA SECTION */}
            <section className="pt-4 pb-12 bg-white text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
                        Let’s Create Unforgettable <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Musical Moments Together.</span>
                    </h2>
                    <Link href="/contact" className="inline-block bg-black text-white hover:bg-zinc-800 font-bold py-5 px-12 rounded-full text-lg transition-all hover:scale-105 shadow-2xl">
                        Book The Band
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}