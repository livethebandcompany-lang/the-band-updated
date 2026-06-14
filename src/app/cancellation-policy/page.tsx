"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Instagram } from "lucide-react";

export default function CancellationPolicyPage() {
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
                        Cancellation Policy
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
                            At The Band Company, we operate as a premium live music band collective delivering curated performances. Due to the nature of live event planning, musician blocking, rehearsals, and date exclusivity, the following booking and cancellation terms are strictly applicable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            1. Booking Confirmation
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>100% advance payment is required to confirm any booking.</li>
                            <li>A date is considered blocked only after full payment is received.</li>
                            <li>Once booked, the date is exclusively reserved for your event and cannot be allocated to any other client.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            2. Cancellation Policy (Strict – No Refund)
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li className="font-bold text-red-700 italic">All confirmed bookings are non-refundable under any circumstances.</li>
                            <li>In case of cancellation from the client&apos;s end, the entire amount paid will be retained.</li>
                            <li>This policy applies irrespective of the reason for cancellation, including but not limited to:
                                <ul className="list-[circle] pl-5 mt-2 space-y-1 text-zinc-600">
                                    <li>Change of plans</li>
                                    <li>Event cancellation/postponement</li>
                                    <li>Personal emergencies</li>
                                    <li>Weather conditions</li>
                                    <li>Venue issues</li>
                                </ul>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            3. Date Rescheduling (Subject to Availability)
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Clients may request a one-time date change.</li>
                            <li>Rescheduling is subject to:
                                <ul className="list-[circle] pl-5 mt-2 space-y-1 text-zinc-600">
                                    <li>Availability of the band on the new requested date</li>
                                    <li>Prior notice (minimum 7–14 days recommended)</li>
                                </ul>
                            </li>
                            <li>If the band is unavailable on the new date, the booking remains non-refundable and non-transferable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            4. Location &amp; City Policy
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The quotation provided is based on the specified event location (city/venue).</li>
                            <li>If the event location changes to a different city or distant venue:
                                <ul className="list-[circle] pl-5 mt-2 space-y-1 text-zinc-600">
                                    <li>Additional charges may apply (travel, logistics, accommodation, transport, etc.)</li>
                                    <li>Revised quotation will be shared accordingly</li>
                                </ul>
                            </li>
                            <li>Any change in venue must be communicated in advance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            5. Performance &amp; Setup Requirements
                        </h2>
                        <p className="mb-2 font-bold">Client must ensure:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-2">
                            <li>Proper stage/performance area</li>
                            <li>Basic sound and technical requirements (if not provided by us)</li>
                            <li>Timely access to venue for setup and soundcheck</li>
                        </ul>
                        <p className="text-justify">
                            Delays caused due to client-side issues may lead to reduced performance time without compensation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            6. Artist Lineup &amp; Creative Rights
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The Band Company functions as a band collective.</li>
                            <li>While we maintain performance quality, specific artist requests are subject to availability.</li>
                            <li>Final lineup decisions are managed internally to ensure quality delivery.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            7. Force Majeure
                        </h2>
                        <p className="mb-2 font-bold">In case of unavoidable circumstances beyond control (natural disasters, government restrictions, etc.):</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We will attempt to reschedule the performance</li>
                            <li>Refunds will not be guaranteed</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            8. Client Responsibility
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Any damage to equipment caused due to client/guest negligence will be chargeable.</li>
                            <li>Proper conduct and safety must be maintained at the venue.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            9. Agreement Acceptance
                        </h2>
                        <p className="text-justify">
                            By confirming the booking and making payment, the client agrees to all terms stated in this policy.
                        </p>
                    </section>

                    <section className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            10. Contact Details
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
                        This policy is designed to maintain professionalism, protect artist time, and ensure seamless execution of premium live music experiences.
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
