"use client";

import { motion } from "framer-motion";

export default function IntroSection() {
    return (
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    {/* Top Decorative Line */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <motion.div
                            className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-yellow-500 to-yellow-600"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        ></motion.div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <motion.div
                            className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-yellow-500 to-yellow-600"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        ></motion.div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-zinc-900 dark:text-zinc-50 leading-tight mb-4 drop-shadow-sm tracking-tight">
                            Live Music Experiences,
                            <br />
                            <span className="text-yellow-500">
                                Curated for Celebrations
                            </span>
                        </h2>
                    </motion.div>

                    {/* Bottom Decorative Line */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                        className="flex items-center justify-center gap-3 mt-6"
                    >
                        <motion.div
                            className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-yellow-500 to-yellow-600"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        ></motion.div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <motion.div
                            className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-yellow-500 to-yellow-600"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        ></motion.div>
                    </motion.div>

                    {/* Paragraphs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                    >
                        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                            <p className="text-lg md:text-xl text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
                                The Band Company delivers <span className="text-yellow-600 dark:text-yellow-400">premium live music experiences</span> across <span className="text-yellow-600 dark:text-yellow-400">Mumbai, Pune, Lonavala, Alibaug, Karjat, and Mahabaleshwar</span> for weddings, destination weddings, corporate events, villa parties, birthdays, anniversaries, and private celebrations. From <span className="text-yellow-600 dark:text-yellow-400">solo singers and duets to 3-piece, 4-piece, and full live band performances</span>, every set is tailored to your audience, venue, and event flow.
                            </p>

                            <p className="text-lg md:text-xl text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
                                Whether you&apos;re looking for a <span className="text-yellow-600 dark:text-yellow-400">live band in Mumbai</span>, <span className="text-yellow-600 dark:text-yellow-400">live music in Pune</span>, a <span className="text-yellow-600 dark:text-yellow-400">wedding band in Lonavala</span>, a <span className="text-yellow-600 dark:text-yellow-400">villa party band in Karjat</span>, or <span className="text-yellow-600 dark:text-yellow-400">destination wedding entertainment in Alibaug and Mahabaleshwar</span>, our musicians create engaging performances that seamlessly blend crowd interaction, singalongs, and curated setlists to match the energy of your celebration.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
