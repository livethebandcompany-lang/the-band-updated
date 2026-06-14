"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Content copied from FAQSection.tsx, filtered for Services page relevance
const faqData = [
    {
        id: "cat1",
        category: "Services & Music Formats",
        questions: [
            { id: "q1", q: "What types of live music services does The Band Company offer?", a: "The Band Company is India's premier live band booking platform, simplifying the process of hiring top-tier talent for weddings, corporate events, and parties." },
            { id: "q2", q: "Can we choose the band size based on our event?", a: "Yes. You can select a performance format depending on your venue size, guest count, and event vibe — from intimate solo sets to full live band line-ups." },
            { id: "q3", q: "Do you customise the music as per the event type?", a: "Yes. Music selection and performance style are adapted based on the event flow, audience profile, and overall mood — whether it’s soft background music or a high-energy set." },
            { id: "q4", q: "What genres of music do you perform?", a: "Our repertoire includes Bollywood, retro classics, indie, pop, soft rock, fusion, acoustic sets, and party music, depending on the chosen format and event requirement." }
        ]
    },
    {
        id: "cat2",
        category: "Booking & Process",
        questions: [
            { id: "q17", q: "How early should we book a live band?", a: "For peak wedding and event seasons, booking well in advance is recommended to ensure availability of the preferred performance format." },
            { id: "q18", q: "What is the booking process?", a: "The booking process includes event requirement discussion, format finalisation, date confirmation, and advance payment to secure the slot." },
            { id: "q19", q: "What determines the cost of a live band booking?", a: "Pricing depends on factors such as band size, performance duration, location, travel requirements, and technical setup." },
            { id: "q20", q: "How do we get in touch or request a quote?", a: "You can contact us through the website enquiry form, phone, or email to share your event details and receive a customised response." },
            { id: "q6_old", q: "What's your cancellation policy?", a: "Cancellations made 60+ days before the event receive a 50% refund. Cancellations 30-59 days prior receive a 25% refund. Unfortunately, cancellations within 30 days are non-refundable. We can discuss rescheduling options if circumstances change." }
        ]
    },
    {
        id: "cat3",
        category: "Performance & Logistics",
        questions: [
            { id: "q21", q: "What are the technical requirements?", a: "We bring our own professional sound system and basic lighting. We need a covered performance area (6ft x 10ft minimum), access to power outlets (15A connection), and preparation time of 2-3 hours before the event. For outdoor venues, we may need additional weather protection." },
            { id: "q10", q: "Is sound equipment included in the package?", a: "Sound setup requirements depend on the venue size and band format. Technical details are discussed in advance to ensure smooth coordination with the venue." },
            { id: "q11", q: "How much space is required for a live band performance?", a: "Space requirements vary by format. Solo and duet acts need minimal space, while larger bands require more room for instruments and sound setup." },
            { id: "q5", q: "Which cities and locations do you perform in?", a: "We perform across Mumbai, Pune, Lonavala, Alibaug, Karjat, Mahabaleshwar, and other nearby destination locations. Travel arrangements are handled based on event requirements." },
            { id: "q6", q: "Do you perform for destination weddings and outstation events?", a: "Yes. We regularly perform at destination weddings and outstation events. Travel, accommodation, and technical requirements are discussed during the booking process." }
        ]
    }
];

export default function ServiceFAQ() {
    // State to track which Category is open - default first one open
    const [openCategory, setOpenCategory] = useState<string | null>("cat1");

    // State to track which Question is open
    const [openQuestion, setOpenQuestion] = useState<string | null>(null);

    const toggleCategory = (id: string) => {
        setOpenCategory(openCategory === id ? null : id);
    };

    const toggleQuestion = (id: string) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <section className="w-full py-10 md:py-20 relative">
            <div className="max-w-4xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
                        <HelpCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 text-sm font-medium uppercase tracking-wider">Got Questions?</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Everything you need to know about booking The Band Company
                    </p>
                </motion.div>

                {/* FAQ Content */}
                <div className="space-y-4">
                    {faqData.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="rounded-lg overflow-hidden bg-zinc-900/80 border border-zinc-800"
                        >
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-800 transition-colors"
                            >
                                <span className="text-lg font-medium text-white">{category.category}</span>
                                <motion.div
                                    animate={{ rotate: openCategory === category.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${openCategory === category.id ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
                                >
                                    {openCategory === category.id ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </motion.div>
                            </button>

                            {/* Category Content (Questions) */}
                            <AnimatePresence>
                                {openCategory === category.id && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        exit={{ height: 0 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="overflow-hidden bg-zinc-900 border-t border-zinc-800 will-change-[height]"
                                    >
                                        <div className="px-5 pb-5 pt-2">
                                            {category.questions.map((item, qIndex) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.15, delay: qIndex * 0.03 }}
                                                    className="border-b border-zinc-800 last:border-0"
                                                >
                                                    <button
                                                        onClick={() => toggleQuestion(item.id)}
                                                        className="w-full py-4 flex items-center justify-between text-left group"
                                                    >
                                                        <span className="text-zinc-300 group-hover:text-white transition-colors text-base md:text-lg">{item.q}</span>
                                                        <motion.div
                                                            animate={{ rotate: openQuestion === item.id ? 45 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex-shrink-0 ml-4"
                                                        >
                                                            <Plus className="w-4 h-4 text-zinc-500" />
                                                        </motion.div>
                                                    </button>

                                                    <AnimatePresence>
                                                        {openQuestion === item.id && (
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: "auto" }}
                                                                exit={{ height: 0 }}
                                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                                className="overflow-hidden text-zinc-400 text-sm pb-4 pr-8 leading-relaxed pl-2 will-change-[height]"
                                                            >
                                                                {item.a}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <p className="text-zinc-400 mb-4">Still have questions?</p>
                    <a
                        href="tel:7779945379"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full font-medium hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                    >
                        Call Us: 7779945379
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
