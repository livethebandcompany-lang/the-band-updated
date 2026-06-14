"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Instagram } from "lucide-react";

export default function TermsPage() {
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
                    <h1 className="text-3xl font-bold text-center tracking-tight text-black">
                        TERMS & CONDITIONS
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-sans font-bold">
                        The Band Company
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-10 leading-relaxed text-zinc-800 text-sm md:text-base">

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            1. INTRODUCTION
                        </h2>
                        <p className="text-justify">
                            Welcome to The Band Company. By engaging our services, you agree to comply with and be bound by the following Terms & Conditions. These terms govern all bookings, performances, and services provided by The Band Company.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            2. BOOKING & CONFIRMATION
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>A booking is confirmed only upon receipt of 100% advance payment.</li>
                            <li>The Band Company reserves the right to decline or release any tentative booking without prior notice if payment is not received.</li>
                            <li>Once confirmed, the date and time slot are exclusively reserved for the client.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            3. PAYMENT TERMS
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Full payment (100%) is required in advance to confirm the booking.</li>
                            <li>No performance will be conducted without prior full payment.</li>
                            <li>All payments must be made via approved payment methods (Bank Transfer / UPI / etc.).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            4. CANCELLATION & REFUND POLICY
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li className="font-bold text-red-700 italic">All payments made are strictly non-refundable.</li>
                            <li>In case of cancellation by the client, no refund will be issued.</li>
                            <li>Rescheduling requests may be considered subject to availability and must be communicated in advance.</li>
                            <li>The Band Company reserves the right to cancel or reschedule in case of unforeseen circumstances, in which case an alternative solution will be offered.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            5. PERFORMANCE DETAILS
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Performance duration, artist lineup, and setup will be as agreed at the time of booking.</li>
                            <li>Any additional performance time requested during the event will be charged separately.</li>
                            <li>The Band Company reserves the right to make necessary changes to the artist lineup due to unavoidable circumstances while maintaining performance quality.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            6. CLIENT RESPONSIBILITIES
                        </h2>
                        <p className="mb-2 font-bold">The client agrees to provide:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Adequate and uninterrupted power supply</li>
                            <li>Safe and sufficient performance space</li>
                            <li>Necessary permissions/licenses for the event (if required)</li>
                            <li>Basic hospitality for artists (if agreed upon)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            7. TRAVEL & ACCOMMODATION
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>For outstation events, travel and accommodation must be arranged or covered by the client unless otherwise agreed.</li>
                            <li>Any additional logistics will be communicated in advance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            8. EQUIPMENT & DAMAGES
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The Band Company will provide agreed equipment and setup.</li>
                            <li>The client is responsible for ensuring equipment safety during the event.</li>
                            <li>Any damage caused due to negligence, mishandling, or external factors will be charged to the client.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            9. DELAYS & EXTENSIONS
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Delays caused by the client or event management may impact performance duration.</li>
                            <li>Extensions beyond agreed time will be charged additionally and are subject to artist availability.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            10. FORCE MAJEURE
                        </h2>
                        <p className="mb-2 font-bold">The Band Company shall not be held liable for failure to perform due to circumstances beyond control, including but not limited to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Natural disasters</li>
                            <li>Government restrictions</li>
                            <li>Technical failures</li>
                            <li>Health emergencies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            11. MEDIA & PROMOTION
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The Band Company reserves the right to capture photos/videos during performances for promotional use.</li>
                            <li>If the client requires restrictions, the same must be communicated in writing prior to the event.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            12. LIMITATION OF LIABILITY
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The Band Company’s liability is limited to the amount paid by the client.</li>
                            <li>We are not responsible for indirect losses, damages, or disruptions beyond our control.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            13. GOVERNING LAW
                        </h2>
                        <p className="text-justify">
                            These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to jurisdiction in Mumbai, Maharashtra.
                        </p>
                    </section>

                    <section className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-wide border-l-4 border-yellow-500 pl-4">
                            14. CONTACT INFORMATION
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

        </main >
    );
}
