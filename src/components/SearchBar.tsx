"use client";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search blogs..." }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <motion.div
            className="relative w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`relative flex items-center transition-all duration-300 ${isFocused ? "shadow-lg" : "shadow-md"
                }`}>
                <Search className={`absolute left-4 w-5 h-5 transition-colors ${isFocused ? "text-yellow-600" : "text-zinc-400"
                    }`} />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleClear}
                            className="absolute right-4 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4 text-zinc-400" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Search indicator */}
            {query && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center"
                >
                    Searching for "{query}"...
                </motion.p>
            )}
        </motion.div>
    );
}
