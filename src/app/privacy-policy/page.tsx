"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Instagram } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-neutral-100 py-12 px-4 md:px-8 print:bg-white print:p-0">
            {/* Back Button (Screen only) */}
            <div className="max-w-[210mm] mx-auto mb-6 print:hidden">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-600 hover:text-black transition-colors font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            {/* Document Container (A4-like) */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-12 md:p-16 relative text-zinc-900 border border-zinc-200 print:shadow-none print:border-none print:w-full font-['Times_New_Roman',_'Times',_serif]">

                {/* Header with Logo */}
                <div className="flex flex-col items-center justify-center mb-16 border-b border-zinc-100 pb-8">
                    <div className="mb-6 relative w-28 h-28 bg-zinc-950 rounded-full flex items-center justify-center p-1 shadow-sm">
                        <div className="relative w-full h-full">
                            <Image
                                src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png"
                                alt="The Band Company"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-center tracking-tight text-black uppercase">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-sans font-bold">
                        The Band Company
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-10 leading-relaxed text-zinc-800 text-sm md:text-base">
                    <section>
                        <p className="mb-4 font-bold">Effective Date: 1 January 2026</p>
                        <p className="text-justify">
                            The Band Company (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is a professional live music band collective offering curated live performances for events including weddings, corporate events, private parties, and social gatherings. This Privacy Policy explains how we collect, use, disclose, and protect your information when you interact with us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            1. Information We Collect
                        </h2>
                        <p className="mb-2">We may collect the following types of information:</p>
                        
                        <h3 className="font-bold mt-4 mb-2">a) Personal Information</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Name</li>
                            <li>Phone number</li>
                            <li>Email address</li>
                            <li>Event details (date, location, occasion, preferences)</li>
                        </ul>

                        <h3 className="font-bold mt-4 mb-2">b) Usage Information</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Messages, inquiries, and communication records</li>
                            <li>Interaction with our social media platforms and advertisements</li>
                        </ul>

                        <h3 className="font-bold mt-4 mb-2">c) Payment Information</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>If applicable, limited payment details required to confirm bookings (handled securely through third-party platforms)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="mb-2">We use your information to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Respond to inquiries and provide quotations</li>
                            <li>Confirm and manage bookings</li>
                            <li>Customize live music experiences for your event</li>
                            <li>Communicate updates, schedules, and requirements</li>
                            <li>Improve our services and client experience</li>
                            <li>Send promotional offers or updates (only if consent is given)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            3. Sharing of Information
                        </h2>
                        <p className="mb-2">We do not sell or rent your personal data. We may share information only in the following cases:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>With our internal band members and team involved in your event execution</li>
                            <li>With trusted vendors or partners strictly for event fulfillment (sound, venue coordination, etc.)</li>
                            <li>When required by law or legal processes</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            4. Data Security
                        </h2>
                        <p className="text-justify">
                            We take reasonable measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no digital system is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            5. Data Retention
                        </h2>
                        <p className="text-justify">
                            We retain your information only as long as necessary to fulfill your booking, maintain records, and comply with legal obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            6. Your Rights
                        </h2>
                        <p className="mb-2">You have the right to:</p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Request access to your personal data</li>
                            <li>Request correction or deletion of your data</li>
                            <li>Opt out of promotional communications</li>
                        </ul>
                        <p>To exercise these rights, contact us using the details below.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            7. Third-Party Links
                        </h2>
                        <p className="text-justify">
                            Our website or social media may contain links to third-party platforms. We are not responsible for their privacy practices.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            8. Updates to This Policy
                        </h2>
                        <p className="text-justify">
                            We may update this Privacy Policy from time to time. Changes will be reflected with an updated effective date.
                        </p>
                    </section>

                    <section className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            9. Contact Us
                        </h2>
                        <p className="mb-4 text-zinc-600">If you have any questions regarding this Privacy Policy, you may contact us:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                            <div className="flex items-center gap-3 text-zinc-600">
                                <Phone className="w-5 h-5 text-yellow-500" />
                                <span>7779945379</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600">
                                <Mail className="w-5 h-5 text-yellow-500" />
                                <span>live.thebandcompany@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600">
                                <Instagram className="w-5 h-5 text-yellow-500" />
                                <span>@live.thebandcompany</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Violet Stamp */}
                <div className="absolute bottom-32 right-8 md:right-16 opacity-70 pointer-events-none transform -rotate-12 mix-blend-multiply select-none">
                    <div className="border-[3px] border-violet-600 rounded-full p-2 w-32 h-32 flex items-center justify-center">
                        <div className="w-full h-full border border-violet-600 rounded-full border-dashed flex flex-col items-center justify-center bg-violet-50/10">
                            <p className="text-violet-700 font-serif font-bold text-lg uppercase tracking-wider leading-none text-center">Original</p>
                            <p className="text-violet-600 font-sans font-bold text-[10px] uppercase tracking-widest mt-1">Verified</p>
                        </div>
                    </div>
                </div>

                {/* Footer of Document */}
                <div className="mt-24 pt-8 border-t border-zinc-100 text-center text-xs text-zinc-400 flex flex-col items-center font-sans tracking-widest font-bold">
                    <p className="mb-2 italic uppercase">The Band Company &bull; Platinum Standard Entertainment</p>
                    <p>WWW.THEBANDCOMPANY.IN</p>
                </div>

            </div>

            {/* Print Note */}
            <div className="text-center mt-8 text-zinc-400 text-sm print:hidden">
                &copy; {new Date().getFullYear()} The Band Company. All rights reserved.
            </div>

        </main>
    );
}
