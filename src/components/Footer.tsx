import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative bg-[#0a0a08] text-gray-300 pt-14 pb-6 overflow-hidden">

            {/* ── Music instruments watermark background ── */}
            <div className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden="true">
                <Image
                    src="/footer-music-bg.png"
                    alt=""
                    fill
                    className="object-cover object-center mix-blend-screen opacity-[0.18]"
                    style={{ filter: "invert(1)" }}
                    priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a08]/60 via-transparent to-[#0a0a08]/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a08]/70 via-transparent to-[#0a0a08]/70" />
            </div>

            {/* ── Top gold accent line ── */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />

            <div className="relative z-10 mx-auto px-5 sm:px-8 max-w-6xl">

                {/* ── Main grid: 1 col mobile → 2 col tablet → 4 col desktop ── */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">

                    {/* ── Col 1: Brand (full width on mobile) ── */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start">
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png"
                                alt="The Band Company"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-20 sm:h-24 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-[#9a8a6a] text-sm mb-5 leading-relaxed max-w-xs text-center lg:text-left">
                            A premier live band offering curated live music performances for weddings, corporate events, and private celebrations.
                        </p>
                        {/* Social icons */}
                        <div className="flex flex-wrap gap-2.5">
                            {[
                                { href: "https://www.instagram.com/live.thebandcompany?igsh=enpibDA5bnQzc2Z5", label: "Instagram", Icon: Instagram },
                                { href: "https://www.facebook.com/share/1Df9d4yBCi/", label: "Facebook", Icon: Facebook },
                                { href: "https://www.linkedin.com/company/thebandcompany/", label: "LinkedIn", Icon: Linkedin },
                                { href: "https://youtube.com/@thebandcompany", label: "YouTube", Icon: Youtube },
                            ].map(({ href, label, Icon }) => (
                                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Col 2: Quick Links ── */}
                    <div className="col-span-1 flex flex-col">
                        <h2 className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-4">Quick Links</h2>
                        <ul className="space-y-2.5 text-sm">
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

                    {/* ── Col 3: Locations ── */}
                    <div className="col-span-1 flex flex-col">
                        <h2 className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-4">Locations</h2>
                        <ul className="space-y-2.5 text-sm text-[#9a8a6a]">
                            {["Mumbai", "Pune", "Lonavala", "Alibaug", "Karjat", "Destinations +"].map((city) => (
                                <li key={city} className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-[#C9A84C] shrink-0" />
                                    {city}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Col 4: Get In Touch (full width on mobile) ── */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-1 flex flex-col">
                        <h2 className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-4">Get In Touch</h2>
                        <ul className="space-y-4 text-sm mb-5">
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-xs font-semibold mb-0.5">Phone</p>
                                    <span className="text-[#9a8a6a]">+91 7779945379</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-xs font-semibold mb-0.5">Email</p>
                                    <span className="text-[#9a8a6a] break-all">live.thebandcompany@gmail.com</span>
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

                        <div className="pt-4 border-t border-[#C9A84C]/20">
                            <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-2">Operating Across India</h3>
                            <p className="text-[#9a8a6a] text-sm leading-relaxed">
                                Mumbai | Pune | Lonavala | Alibaug | Karjat | Destination Celebrations
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent mb-6" />

                {/* ── Bottom bar ── */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2">
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
                    <p className="text-[#6a5a3a] text-xs text-center sm:text-right shrink-0">
                        &copy; {new Date().getFullYear()}{" "}
                        <span className="text-[#C9A84C]">The Band Company</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}