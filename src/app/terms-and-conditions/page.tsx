"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Instagram } from "lucide-react";

export default function TermsAndConditionsPage() {
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
                        Terms & Conditions
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
                            These Terms &amp; Conditions govern all bookings, performances, and interactions with The Band Company (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), a premium live music band collective.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            1. Nature of Service
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The Band Company is a curated band collective delivering live music performances.</li>
                            <li>We are not an artist management or booking agency.</li>
                            <li>All performances are executed under The Band Company brand with internal artist coordination.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            2. Booking &amp; Payment
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>100% advance payment is mandatory to confirm any booking.</li>
                            <li>No booking is considered confirmed without full payment.</li>
                            <li>Payments once made are non-refundable (as per Cancellation Policy).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            3. Performance Commitment
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We commit to delivering a high-quality live music experience as per agreed discussion.</li>
                            <li>Performance duration, setup, and flow will be aligned prior to the event.</li>
                            <li>Any additional time beyond agreed duration may incur extra charges.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            4. Client Obligations
                        </h2>
                        <p className="mb-2 font-bold">The client agrees to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Provide accurate event details</li>
                            <li>Ensure venue readiness (space, electricity, permissions)</li>
                            <li>Coordinate with venue/vendors for smooth execution</li>
                            <li>Maintain a safe and respectful environment for performers</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            5. Delays &amp; Time Management
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The band will arrive as per agreed reporting time.</li>
                            <li>Delays caused by client/venue may result in reduced performance duration.</li>
                            <li>Extension requests are subject to availability and additional charges.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            6. Travel &amp; Logistics
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Any outstation event will include additional costs (travel, stay, local transport).</li>
                            <li>These costs must be borne by the client unless explicitly included in the quote.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            7. Sound &amp; Technicals
                        </h2>
                        <p className="mb-2">Sound setup may be:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-2">
                            <li>Provided by The Band Company, or</li>
                            <li>Arranged by the client/vendor as per technical requirements shared</li>
                        </ul>
                        <p>Any compromise in sound quality due to external vendors will not be our responsibility.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            8. Artist Substitution
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The Band Company reserves the right to change artist lineup due to unavoidable circumstances.</li>
                            <li>Performance quality and standards will be maintained at all times.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            9. Intellectual Property
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Any photos/videos captured during the event may be used by The Band Company for promotional purposes.</li>
                            <li>Clients may request restrictions in writing prior to the event.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            10. Liability Limitation
                        </h2>
                        <p className="mb-2 font-bold">We are not responsible for:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-2">
                            <li>Venue-related issues</li>
                            <li>Technical failures outside our control</li>
                            <li>Delays caused by third-party vendors</li>
                        </ul>
                        <p>Our liability is limited to the amount paid for the booking.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            11. Force Majeure
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>In case of uncontrollable events (natural disasters, restrictions, emergencies), we will attempt rescheduling.</li>
                            <li>Refunds are not guaranteed.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            12. Policy Acceptance
                        </h2>
                        <p className="text-justify">
                            By proceeding with booking and payment, the client confirms acceptance of all Terms &amp; Conditions and associated policies.
                        </p>
                    </section>

                    <section className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            13. Contact Information
                        </h2>
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

                    <p className="text-center text-zinc-500 italic text-sm mt-8 border-t border-zinc-200 pt-8">
                        These Terms &amp; Conditions are designed to ensure clarity, professionalism, and a seamless premium live music experience for all clients.
                    </p>
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
