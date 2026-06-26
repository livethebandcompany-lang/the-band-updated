import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-gray-300 pt-12 pb-6 border-t border-zinc-300 dark:border-zinc-900">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10">
                    {/* Brand & Socials */}
                    <div className="md:col-span-12 lg:col-span-4 flex flex-col md:items-start text-left">
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png"
                                alt="The Band Company"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-20 md:h-24 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 leading-relaxed max-w-sm">
                            A premier live band offering curated live music performances for weddings, corporate events, and private celebrations.
                        </p>
                        <div className="flex gap-3 justify-start">
                            <a href="https://www.instagram.com/live.thebandcompany?igsh=enpibDA5bnQzc2Z5" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Instagram className="w-4 h-4" /></a>
                            <a href="https://www.facebook.com/share/1Df9d4yBCi/" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Facebook className="w-4 h-4" /></a>
                            <a href="https://www.linkedin.com/company/thebandcompany/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Linkedin className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Middle: 2 Columns for Links & Locations on Mobile */}
                    <div className="md:col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
                        {/* Quick Links */}
                        <div className="text-left">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Quick Links</h2>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/contact" className="hover:text-yellow-500 transition-colors">Contact Us</Link></li>
                                <li><Link href="/about" className="hover:text-yellow-500 transition-colors">About us</Link></li>
                                <li><Link href="/blog" className="hover:text-yellow-500 transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        {/* Locations */}
                        <div className="text-left flex flex-col items-start">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Locations</h2>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-500" /> Lonavala</li>
                                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-500" /> Karjat</li>
                                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-500" /> Alibaug</li>
                                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-500" /> Mumbai</li>
                                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-500" /> Pune</li>
                                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-500" /> Other +</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact & HQ */}
                    <div className="md:col-span-12 lg:col-span-4 text-left flex flex-col items-start mt-4 md:mt-0">
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Get in Touch</h2>
                        <ul className="space-y-4 text-sm w-full">
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-zinc-900 dark:text-white font-semibold text-xs">Phone</span>
                                    <span className="hover:text-yellow-500 transition-colors cursor-default">+91 7779945379</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-zinc-900 dark:text-white font-semibold text-xs">Email</span>
                                    <span className="hover:text-yellow-500 transition-colors cursor-default truncate">live.thebandcompany@gmail.com</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-zinc-900 dark:text-white font-semibold text-xs">Headquarters</span>
                                    <a href="https://maps.app.goo.gl/SGEaSzDMHeXj8Gsw9" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">
                                        Lonavala & Mumbai
                                    </a>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 w-full">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Operating Across India</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                Mumbai | Pune | Lonavala | Alibaug | Karjat | Destination Celebrations
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-8 pb-6">
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 mb-6">
                        <Link href="/terms-and-conditions" className="text-zinc-400 hover:text-yellow-500 transition-colors text-sm font-medium">
                            Terms & Conditions
                        </Link>
                        <span className="text-zinc-800 hidden md:inline">&bull;</span>
                        <Link href="/cancellation-policy" className="text-zinc-400 hover:text-yellow-500 transition-colors text-sm font-medium">
                            Cancellation Policy
                        </Link>
                        <span className="text-zinc-800 hidden md:inline">&bull;</span>
                        <Link href="/privacy-policy" className="text-zinc-400 hover:text-yellow-500 transition-colors text-sm font-medium">
                            Privacy Policy
                        </Link>
                        <span className="text-zinc-800 hidden md:inline">&bull;</span>
                        <Link href="/disclaimer" className="text-zinc-400 hover:text-yellow-500 transition-colors text-sm font-medium">
                            Disclaimer
                        </Link>
                    </div>
                    <p className="text-xs text-zinc-600 text-center">
                        &copy; {new Date().getFullYear()} The Band Company. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}