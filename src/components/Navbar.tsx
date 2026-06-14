"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, User, Phone, ChevronDown, X, MessageCircle } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const getDesktopLinkClass = (path: string) => {
        const isActive = pathname === path || (path !== "/" && pathname?.startsWith(path));
        return `text-sm font-medium uppercase tracking-wider transition-colors pb-1 border-b-2 ${isActive
            ? "text-yellow-500 border-yellow-500"
            : "text-zinc-700 dark:text-zinc-300 border-transparent hover:text-yellow-500 hover:border-yellow-500/50"
            }`;
    };

    const getMobileLinkClass = (path: string) => {
        const isActive = pathname === path || (path !== "/" && pathname?.startsWith(path));
        return `text-lg font-medium transition-colors ${isActive ? "text-yellow-500" : "text-white hover:text-yellow-500"
            }`;
    };

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrolled]);

    return (
        <nav
            className={`fixed top-0 z-[100] w-full transition-all duration-300 ${scrolled
                ? "bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className={`container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png"
                            alt="The Band Company"
                            width={80}
                            height={80}
                            priority
                            style={{ width: 'auto' }}
                            className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-14" : "h-20"}`}
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 pt-1">
                    <Link href="/" className={getDesktopLinkClass("/")}>
                        Home
                    </Link>

                    <Link href="/about" className={getDesktopLinkClass("/about")}>
                        About Us
                    </Link>

                    <Link href="/services" className={getDesktopLinkClass("/services")}>
                        Services
                    </Link>

                    <Link href="/blog" className={getDesktopLinkClass("/blog")}>
                        Blog
                    </Link>

                    <Link href="/contact" className={getDesktopLinkClass("/contact")}>
                        Contact Us
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* WhatsApp - Hover Animation */}
                    <motion.a
                        href="https://wa.me/7779945379?text=Hi!%20I'm%20interested%20in%20booking%20The%20Band%20Company%20for%20my%20event."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex"
                        title="Chat on WhatsApp"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="w-10 h-10 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center transition-colors duration-300">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-6 h-6 fill-white"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>
                    </motion.a>

                    {/* Call - Hover Animation */}
                    <motion.a
                        href="tel:7779945379"
                        className="hidden sm:inline-flex"
                        title="Call Us"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="w-10 h-10 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors duration-300">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                    </motion.a>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white hover:text-yellow-500 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-white/10 p-4 shadow-xl"
                    >
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className={getMobileLinkClass("/")}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>

                            <Link
                                href="/about"
                                className={getMobileLinkClass("/about")}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About Us
                            </Link>

                            <Link
                                href="/services"
                                className={getMobileLinkClass("/services")}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Services
                            </Link>

                            <Link
                                href="/blog"
                                className={getMobileLinkClass("/blog")}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Blog
                            </Link>

                            <Link
                                href="/contact"
                                className={getMobileLinkClass("/contact")}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact Us
                            </Link>

                            <div className="flex gap-4 pt-4 border-t border-white/10 justify-center">
                                <a
                                    href="https://wa.me/7779945379?text=Hi!%20I'm%20interested%20in%20booking%20The%20Band%20Company%20for%20my%20event."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    <span>WhatsApp</span>
                                </a>
                                <a
                                    href="tel:7779945379"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>Call Us</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
