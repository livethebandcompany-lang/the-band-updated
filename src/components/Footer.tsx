import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative bg-[#0a0a08] text-gray-300 pt-16 pb-6 overflow-hidden">

            {/* ── Music instruments watermark background ── */}
            <div
                className="pointer-events-none absolute inset-0 w-full h-full"
                aria-hidden="true"
            >
                <Image
                    src="/footer-music-bg.png"
                    alt=""
                    fill
                    className="object-cover object-center mix-blend-screen opacity-[0.18]"
                    style={{ filter: "invert(1)" }}
                    priority={false}
                />
                {/* Golden vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a08]/60 via-transparent to-[#0a0a08]/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a08]/70 via-transparent to-[#0a0a08]/70" />
            </div>

            {/* ── Top gold accent line ── */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />

            <div className="relative z-10 container mx-auto px-6 max-w-6xl">

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12">

                    {/* Brand col */}
                    <div className="md:col-span-12 lg:col-span-4 flex flex-col items-start">
                        <Link href="/" className="inline-block mb-5">
                            <Image
                                src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png"
                                alt="The Band Company"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-24 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-[#9a8a6a] text-sm mb-6 leading-relaxed max-w-xs tracking-wide">
                            A premier live band offering curated live music performances for weddings, corporate events, and private celebrations.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3">
                            <a href="https://www.instagram.com/live.thebandcompany?igsh=enpibDA5bnQzc2Z5"
                                aria-label="Instagram" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://www.facebook.com/share/1Df9d4yBCi/"
                                aria-label="Facebook" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="https://www.linkedin.com/company/thebandcompany/"
                                aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://youtube.com/@thebandcompany"
                                aria-label="YouTube" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all">
                                <Youtube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links + Locations */}
                    <div className="md:col-span-12 lg:col-span-4 grid grid-cols-2 gap-6">
                        {/* Quick Links */}
                        <div>
                            <h2 className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-5">Quick Links</h2>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { label: "Home", href: "/" },
                                    { label: "About Us", href: "/about" },
                                    { label: "Services", href: "/services" },
                                    { label: "Blog", href: "/blog" },
                                    { label: "Contact Us", href: "/contact" },
                                ].map(({ label, href }) => (
                                    <li key={href}>
                                        <Link href={href} className="text-[#9a8a6a] hover:text-[#C9A84C] transition-colors">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Locations */}
                        <div>
                            <h2 className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-5">Locations</h2>
                            <ul className="space-y-3 text-sm text-[#9a8a6a]">
                                {["Mumbai", "Pune", "Lonavala", "Alibaug", "Karjat", "Destinations +"].map((city) => (
                                    <li key={city} className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-[#C9A84C] shrink-0" />
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact col */}
                    <div className="md:col-span-12 lg:col-span-4 flex flex-col">
                        <h2 className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-5">Get In Touch</h2>
                        <ul className="space-y-5 text-sm mb-6">
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-xs font-semibold mb-0.5">Phone</p>
                                    <span className="text-[#9a8a6a] hover:text-[#C9A84C] transition-colors cursor-default">+91 7779945379</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-xs font-semibold mb-0.5">Email</p>
                                    <span className="text-[#9a8a6a] hover:text-[#C9A84C] transition-colors cursor-default break-all">live.thebandcompany@gmail.com</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-xs font-semibold mb-0.5">Headquarters</p>
                                    <a href="https://maps.app.goo.gl/SGEaSzDMHeXj8Gsw9"
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-[#9a8a6a] hover:text-[#C9A84C] transition-colors">
                                        Lonavala &amp; Mumbai
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <div className="pt-5 border-t border-[#C9A84C]/20">
                            <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-3">Operating Across India</h3>
                            <p className="text-[#9a8a6a] text-sm leading-relaxed">
                                Mumbai | Pune | Lonavala | Alibaug | Karjat | Destination Celebrations
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent mb-8" />

                {/* ── Bottom bar ── */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                        {[
                            { label: "Terms & Conditions", href: "/terms-and-conditions" },
                            { label: "Cancellation Policy", href: "/cancellation-policy" },
                            { label: "Privacy Policy", href: "/privacy-policy" },
                            { label: "Disclaimer", href: "/disclaimer" },
                        ].map(({ label, href }) => (
                            <Link key={href} href={href}
                                className="text-[#6a5a3a] hover:text-[#C9A84C] transition-colors text-xs">
                                {label}
                            </Link>
                        ))}
                    </div>
                    <p className="text-[#6a5a3a] text-xs text-center">
                        &copy; {new Date().getFullYear()}{" "}
                        <span className="text-[#C9A84C]">The Band Company</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}