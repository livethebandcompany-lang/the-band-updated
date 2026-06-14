"use client";
import { motion } from "framer-motion";

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <button
                onClick={() => onCategoryChange("All")}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${activeCategory === "All"
                        ? "bg-yellow-500 text-black shadow-lg scale-105"
                        : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-2 border-zinc-200 dark:border-zinc-800 hover:border-yellow-500 hover:scale-105"
                    }`}
            >
                All
            </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${activeCategory === category
                            ? "bg-yellow-500 text-black shadow-lg scale-105"
                            : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-2 border-zinc-200 dark:border-zinc-800 hover:border-yellow-500 hover:scale-105"
                        }`}
                >
                    {category}
                </button>
            ))}
        </motion.div>
    );
}
