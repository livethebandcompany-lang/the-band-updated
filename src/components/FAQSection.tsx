"use client";

import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
    {
        id: "cat1",
        category: "1. Services & Music Formats",
        questions: [
            { id: "q0", q: "Why do elite families choose The Band Company?", a: "The Band Company delivers more than live music—we create refined, personalized experiences. Our professional team, premium presentation, and ability to match the mood of every celebration make us a trusted choice for luxury weddings, private parties, and destination events." },
            { id: "q1", q: "What types of live music services does The Band Company offer?", a: "The Band Company is India's premier live band booking platform, simplifying the process of hiring top-tier talent for weddings, corporate events, and parties." },
            { id: "q2", q: "Can we choose the band size based on our event?", a: "Yes. You can select a performance format depending on your venue size, guest count, and event vibe — from intimate solo sets to full live band line-ups." },
            { id: "q3", q: "Do you customise the music as per the event type?", a: "Yes. Music selection and performance style are adapted based on the event flow, audience profile, and overall mood — whether it’s soft background music or a high-energy set." },
            { id: "q4", q: "What genres of music do you perform?", a: "Our repertoire includes Bollywood, retro classics, indie, pop, soft rock, fusion, acoustic sets, and party music, depending on the chosen format and event requirement." }
        ]
    },
    {
        id: "cat2",
        category: "2. Locations & Travel",
        questions: [
            { id: "q5", q: "Which cities and locations do you perform in?", a: "We perform across Mumbai, Pune, Lonavala, Alibaug, Karjat, Mahabaleshwar, and other nearby destination locations. Travel arrangements are handled based on event requirements." },
            { id: "q6", q: "Do you perform for destination weddings and outstation events?", a: "Yes. We regularly perform at destination weddings and outstation events. Travel, accommodation, and technical requirements are discussed during the booking process." }
        ]
    },
    {
        id: "cat3",
        category: "3. Events & Occasions",
        questions: [
            { id: "q7", q: "What kinds of events do you perform at?", a: "Our performances are designed for weddings, corporate events, private parties, destination celebrations, venue gigs, sangeet, mehendi, cocktail nights, and social gatherings." },
            { id: "q8", q: "Are your performances suitable for corporate and formal events?", a: "Yes. We regularly perform at corporate events, brand activations, conferences, and private corporate gatherings, with music curated to suit formal audiences." },
            { id: "q9", q: "Do you offer multiple performances for multi-day events?", a: "Yes. For multi-day weddings or events, different formats and music styles can be planned for each function." }
        ]
    },
    {
        id: "cat4",
        category: "4. Performance Setup & Technical",
        questions: [
            { id: "q10", q: "Is sound equipment included in the package?", a: "Sound setup requirements depend on the venue size and band format. Technical details are discussed in advance to ensure smooth coordination with the venue." },
            { id: "q11", q: "How much space is required for a live band performance?", a: "Space requirements vary by format. Solo and duet acts need minimal space, while larger bands require more room for instruments and sound setup." },
            { id: "q12", q: "Do you perform at indoor and outdoor venues?", a: "Yes. We perform at banquet halls, hotels, resorts, private villas, lawns, rooftops, and outdoor venues, with setup adjusted accordingly." },
            { id: "q13", q: "Can the music volume be controlled for venues with restrictions?", a: "Yes. Volume levels are adjusted as per venue rules, timing restrictions, and audience comfort." },
            { id: "q14", q: "Do you coordinate with event planners and venues?", a: "Yes. We coordinate with event planners, venue teams, and technical staff to ensure smooth setup and performance flow." }
        ]
    },
    {
        id: "cat5",
        category: "5. Performance Details",
        questions: [
            { id: "q15", q: "How long is a typical live performance?", a: "Performance duration is 2 hour 30 minutes and planned according to the event schedule. Most events include multiple sets spread across the evening." },
            { id: "q16", q: "Can the band perform specific songs or requests?", a: "Yes. You can share song preferences or special requests in advance so they can be incorporated smoothly into the performance." }
        ]
    },
    {
        id: "cat6",
        category: "6. Booking & Process",
        questions: [
            { id: "q17", q: "How early should we book a live band?", a: "For peak wedding and event seasons, booking well in advance is recommended to ensure availability of the preferred performance format." },
            { id: "q18", q: "What is the booking process?", a: "The booking process includes event requirement discussion, format finalisation, date confirmation, and advance payment to secure the slot." },
            { id: "q19", q: "What determines the cost of a live band booking?", a: "Pricing depends on factors such as band size, performance duration, location, travel requirements, and technical setup." },
            { id: "q20", q: "How do we get in touch or request a quote?", a: "You can contact us through the website enquiry form, phone, or email to share your event details and receive a customised response." }
        ]
    }
];

export default function FAQSection() {
    // State to track which Category is open
    const [openCategory, setOpenCategory] = useState<string | null>("cat1");

    // State to track which Question is open (optional, if we want sub-accordion)
    const [openQuestion, setOpenQuestion] = useState<string | null>(null);

    const toggleCategory = (id: string) => {
        setOpenCategory(openCategory === id ? null : id);
    };

    const toggleQuestion = (id: string) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <section className="relative py-20 bg-white dark:bg-zinc-950">
            {/* Gradient transition from previous section */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-white mb-12 text-left"
                >
                    FAQ
                </motion.h2>

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
                                                        <span className="text-zinc-300 group-hover:text-white transition-colors">{item.q}</span>
                                                        <motion.div
                                                            animate={{ rotate: openQuestion === item.id ? 45 : 0 }}
                                                            transition={{ duration: 0.2 }}
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
            </div>
        </section>
    );
}
