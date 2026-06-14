"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Instagram } from "lucide-react";

export default function DisclaimerPage() {
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
                        Disclaimer
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
                            The information provided by The Band Company (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) on our website, social media platforms, and during client interactions is for general informational and service-related purposes only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            1. Service Representation
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We strive to accurately represent our performances through videos, images, and descriptions.</li>
                            <li>However, live performances may vary based on event conditions, audience, venue setup, and other external factors.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            2. No Guarantees
                        </h2>
                        <p className="mb-2">While we aim to deliver a premium experience, we do not guarantee:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Specific audience reactions</li>
                            <li>Identical replication of past performances</li>
                            <li>Uninterrupted performance in case of external disruptions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            3. Third-Party Dependencies
                        </h2>
                        <p className="mb-2">Our performance quality may depend on third-party arrangements such as:</p>
                        <ul className="list-[circle] pl-5 space-y-1 mb-2 text-zinc-600">
                            <li>Sound vendors</li>
                            <li>Event planners</li>
                            <li>Venue management</li>
                        </ul>
                        <p>We are not liable for any shortcomings caused by third-party services.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            4. Technical Limitations
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Factors such as power failure, weather conditions, or technical issues beyond our control may impact the performance.</li>
                            <li>In such cases, we will make reasonable efforts to continue or adjust the performance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            5. Content Usage
                        </h2>
                        <p className="text-justify">
                            Any media shared by us is for representation purposes only and should not be misinterpreted as a guaranteed outcome for every event.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            6. Limitation of Liability
                        </h2>
                        <p className="text-justify">
                            The Band Company shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our services or information provided.
                        </p>
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
