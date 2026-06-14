"use client";

import { motion } from "framer-motion";
import { Check, Star, Sparkles, Crown, Music } from "lucide-react";
import { useState } from "react";

const PRICING_TIERS = [
    {
        id: "essential",
        name: "Essential",
        tagline: "Perfect for intimate gatherings",
        price: "Starting at ₹35,000",
        icon: Music,
        features: [
            "2-3 Piece Band",
            "2.5 Hours Performance",
            "Acoustic Setup",
            "1 Music Style",
            "Basic Sound System",
            "Vocalist + 2 Instruments"
        ],
        color: "zinc",
        popular: false
    },
    {
        id: "premium",
        name: "Premium",
        tagline: "Our most popular choice",
        price: "Starting at ₹65,000",
        icon: Star,
        features: [
            "4-5 Piece Band",
            "3.5 Hours Performance",
            "Professional Setup",
            "2-3 Music Styles",
            "Premium Sound & Lighting",
            "Multiple Vocalists",
            "Dedicated Sound Engineer",
            "Rehearsal Session Included"
        ],
        color: "yellow",
        popular: true
    },
    {
        id: "ultimate",
        name: "Ultimate",
        tagline: "The complete luxury experience",
        price: "Starting at ₹1,20,000",
        icon: Crown,
        features: [
            "Full 6+ Piece Band",
            "4.5+ Hours Performance",
            "Luxury Production",
            "Unlimited Music Styles",
            "Premium Sound, Lighting & Stage",
            "Multiple Vocalists & Artists",
            "Dedicated Production Team",
            "Multiple Rehearsals",
            "Custom Arrangements",
            "Video Recording Support"
        ],
        color: "purple",
        popular: false
    }
];

interface PricingTiersProps {
    onSelectPackage?: (packageName: string) => void;
}

export default function PricingTiers({ onSelectPackage }: PricingTiersProps) {
    const [hoveredTier, setHoveredTier] = useState<string | null>(null);
    const [expandedTier, setExpandedTier] = useState<string | null>(null);

    const toggleExpanded = (tierId: string) => {
        setExpandedTier(expandedTier === tierId ? null : tierId);
    };

    return (
        <section className="w-full py-16 md:py-24 relative">
            {/* ... keep existing header ... */}
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1.5 mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-yellow-500 text-xs font-medium uppercase tracking-wider">Pricing Packages</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        Choose Your Experience
                    </h2>
                    <p className="text-zinc-400 text-base max-w-2xl mx-auto">
                        Select a package that fits your event, or customize your own band below
                    </p>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                    {PRICING_TIERS.map((tier, index) => {
                        const Icon = tier.icon;
                        const isHovered = hoveredTier === tier.id;
                        const isExpanded = expandedTier === tier.id;
                        const showReadMore = tier.features.length > 5;
                        const displayFeatures = isExpanded ? tier.features : tier.features.slice(0, 5);

                        return (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onHoverStart={() => setHoveredTier(tier.id)}
                                onHoverEnd={() => setHoveredTier(null)}
                                className={`relative rounded-xl border backdrop-blur-sm transition-all duration-300 ${tier.popular
                                    ? "md:scale-105 border-yellow-500 bg-gradient-to-b from-yellow-500/5 to-zinc-900/50 shadow-2xl shadow-yellow-500/20"
                                    : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                                    } ${isHovered && !tier.popular ? "scale-105 shadow-xl" : ""}`}
                            >
                                {/* Popular Badge */}
                                {tier.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                        <div className="bg-yellow-500 text-black px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="p-5 flex flex-col h-full">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${tier.popular
                                        ? "bg-yellow-500/20 text-yellow-500"
                                        : "bg-zinc-800 text-zinc-400"
                                        }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Tier Name */}
                                    <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                                    <p className="text-zinc-400 text-xs mb-4">{tier.tagline}</p>

                                    {/* Price */}
                                    <div className="mb-5">
                                        <p className={`text-2xl font-bold ${tier.popular ? "text-yellow-500" : "text-white"
                                            }`}>
                                            {tier.price}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-2.5 mb-4 flex-grow">
                                        {displayFeatures.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs">
                                                <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.popular ? "text-yellow-500" : "text-zinc-600"
                                                    }`} />
                                                <span className="text-zinc-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Read More Button */}
                                    {showReadMore && (
                                        <button
                                            onClick={() => toggleExpanded(tier.id)}
                                            className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors mb-4 flex items-center gap-1 self-start"
                                        >
                                            {isExpanded ? "Show less" : `+${tier.features.length - 5} more features`}
                                        </button>
                                    )}

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => onSelectPackage?.(tier.name)}
                                        className={`w-full py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${tier.popular
                                            ? "bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                                            : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                                            }`}
                                    >
                                        Select Package
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Custom Option CTA (preserved) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-3xl mx-auto px-4 mt-12 text-center"
            >
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8">
                    <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Don't see what you need?</h3>
                    <p className="text-zinc-400 mb-6">
                        Build your own custom band with our interactive builder below
                    </p>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            const builder = document.getElementById('band-builder');
                            if (builder) {
                                const yOffset = -80;
                                const y = builder.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-yellow-500 text-yellow-500 rounded-full font-medium hover:bg-yellow-500 hover:text-black transition-all duration-300"
                    >
                        Customize Your Band
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
