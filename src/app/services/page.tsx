"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import BandBuilder from "@/components/BandBuilder";

import ServiceFAQ from "@/components/ServiceFAQ";
import Footer from "@/components/Footer";

import { useState } from "react";
import BookingModal from "@/components/BookingModal";
import Navbar from "@/components/Navbar";

export default function ServicesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [serviceType, setServiceType] = useState("Service Inquiry");
    const [prefilledData, setPrefilledData] = useState<any>({});

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);



    const handleCustomBuilderQuote = (data: any) => {
        setSelectedPackage("Custom Band Configuration");
        setServiceType("Custom Band Builder");

        // Format the complex object into a readable message string for the email body
        // and also pass specific fields to prefill the form if possible
        let messageDetails = `Event Type: ${data.eventType}\n`;
        messageDetails += `Band Size: ${data.bandSize}\n`;
        messageDetails += `Music Styles: ${data.musicStyles.join(", ")}\n`;
        messageDetails += `Event Details: ${data.eventDetails.date} in ${data.eventDetails.city} (${data.eventDetails.venueType})\n`;

        if (data.eventDetails.duration) {
            messageDetails += `Duration: ${data.eventDetails.duration}\n`;
        }

        // Add vibe configs
        if (Object.keys(data.vibeConfigs).length > 0) {
            messageDetails += `\nDetailed Configuration:\n`;
            Object.keys(data.vibeConfigs).forEach((vibeId: string) => {
                const config = data.vibeConfigs[vibeId];
                messageDetails += `- ${vibeId}: Vocals [${config.vocals.join(", ")}], Instruments [${config.instruments.join(", ")}]\n`;
            });
        }

        setPrefilledData({
            date: data.eventDetails.date,
            destination: data.eventDetails.city,
            message: messageDetails
        });

        setIsModalOpen(true);
    };

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-start relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-600/5 rounded-full blur-[120px]"></div>
                {/* Removed noise texture - file not found */}
            </div>

            {/* Navigation */}
            <Navbar />

            {/* Header Section with Image */}
            <motion.div
                className="w-full h-[65vh] relative flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Background Image */}
                <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://media.istockphoto.com/id/502088147/photo/nothing-beats-live-music.webp?a=1&b=1&s=612x612&w=0&k=20&c=4Mjyi5W7cpw6q12qfnyDwK2dvvJqRUfARtTuazEbcdE=')",
                        y: y1,
                        scale: 1.1
                    }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-zinc-950"></div>
                </motion.div>

                {/* Services Heading */}
                <motion.h1
                    className="relative z-10 text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight mb-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)"
                    }}
                >
                    Services
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    className="relative z-10 text-yellow-500 text-lg md:text-xl lg:text-2xl font-light tracking-wide"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Create your own custom band?
                </motion.p>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2 cursor-pointer"
                        onClick={() => window.scrollTo({ top: window.innerHeight * 0.65, behavior: 'smooth' })}
                    >
                        <span className="text-white/60 text-sm uppercase tracking-widest">Scroll to explore</span>
                        <ChevronDown className="w-6 h-6 text-yellow-500" />
                    </motion.div>
                </motion.div>
            </motion.div>





            {/* Custom Band Builder Section */}
            <section id="band-builder" className="w-full relative z-10 py-8 md:py-12">
                <div className="max-w-4xl mx-auto px-4 text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
                            <span className="text-yellow-500 text-sm font-medium uppercase tracking-wider">Custom Builder</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Build Your Dream Band
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Every event is unique. Use our interactive builder to customize every aspect of your band.
                        </p>
                    </motion.div>
                </div>
                <BandBuilder onRequestQuote={handleCustomBuilderQuote} />
            </section>

            {/* FAQ Section */}
            <div className="w-full relative z-10">
                <ServiceFAQ />
            </div>

            {/* Footer */}
            <div className="w-full relative z-10">
                <Footer />
            </div>
            {/* Booking Modal */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPackage={selectedPackage}
                serviceType={serviceType}
                prefilledData={prefilledData}
            />
        </main>
    );
}
