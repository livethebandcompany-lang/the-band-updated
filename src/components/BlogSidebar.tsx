"use client";
import { useEffect, useState } from "react";
import { Phone, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TableOfContentsItem {
    id: string;
    title: string;
    level: number;
}

interface BlogSidebarProps {
    tableOfContents: TableOfContentsItem[];
}

export default function BlogSidebar({ tableOfContents }: BlogSidebarProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -66%" }
        );

        tableOfContents.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [tableOfContents]);

    return (
        <aside className="hidden lg:block sticky top-32 h-fit space-y-6">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                        Table of Contents
                    </h3>
                    <nav>
                        <ul className="space-y-2">
                            {tableOfContents.map(({ id, title, level }) => (
                                <li key={id} style={{ paddingLeft: `${(level - 2) * 12}px` }}>
                                    <a
                                        href={`#${id}`}
                                        className={`block text-sm py-1.5 px-3 rounded transition-all duration-200 ${activeId === id
                                                ? "bg-yellow-500 text-black font-semibold"
                                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(id)?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                            });
                                        }}
                                    >
                                        {title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}

            {/* Book The Band CTA Card */}
            <motion.div
                className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-500/30 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                    Book The Band Now
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
                    Ready to make your event unforgettable? Get in touch with us today!
                </p>
                <div className="space-y-3">
                    <a
                        href="tel:7779945379"
                        className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        Call 7779945379
                    </a>
                    <Link
                        href="/contact"
                        className="flex items-center justify-center gap-2 w-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold py-3 px-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Us
                    </Link>
                </div>
            </motion.div>
        </aside>
    );
}
