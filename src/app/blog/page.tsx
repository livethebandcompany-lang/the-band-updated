"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { blogPosts } from "@/data/blogData";

const categories = ["Wedding Music", "Corporate Events", "Private Parties", "Wedding Planning", "Destination Weddings", "Booking Guides"];

// Map images to blog posts
// Blog Card Component
function BlogCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
                y: -12,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="group"
        >
            <Link href={`/blog/${post.slug}`}>
                <div className="relative bg-zinc-900 dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-zinc-800 dark:border-zinc-700 h-full">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Dark overlay for text legibility if needed, or just aesthetic */}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-60" />

                        {/* Shimmer effect on hover */}
                        <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            animate={{
                                background: [
                                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                                ],
                                x: ["-100%", "200%"],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 2,
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-gradient-to-b from-zinc-900/95 to-zinc-900">
                        {/* Category Badge */}
                        <motion.div
                            className="mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="inline-block px-4 py-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full backdrop-blur-sm">
                                {post.category}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
                            {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-zinc-400 mb-5 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-zinc-500 pt-4 border-t border-zinc-800">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 text-zinc-400">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </span>
                                <span className="flex items-center gap-1.5 text-zinc-400">
                                    <Clock className="w-4 h-4" />
                                    {post.readTime}
                                </span>
                            </div>
                            <motion.div
                                className="flex items-center gap-2 text-yellow-400 font-semibold"
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">Read</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent" />
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

export default function BlogPage() {
    const [blogsList, setBlogsList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/public/blogs')
            .then(res => res.json())
            .then(data => {
                if (data && data.blogs) {
                    setBlogsList(data.blogs);
                } else {
                    setBlogsList(blogPosts); // Fallback
                }
            })
            .catch(err => {
                console.error("Error fetching blogs:", err);
                setBlogsList(blogPosts); // Fallback
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Filter blogs based on search and category
    const filteredBlogs = useMemo(() => {
        return blogsList.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === "All" || post.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [blogsList, searchQuery, activeCategory]);

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950">
            <Navbar />

            {/* Hero Header with Background Image */}
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center">
                {/* Background Image */}
                <motion.div className="absolute inset-0" style={{ y: y1 }}>
                    <Image
                        src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772098347/blog_header_y9gvp7.jpg"
                        alt="Wedding and Event Music"
                        fill
                        sizes="100vw"
                        className="object-cover scale-110"
                        priority
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Wedding & Event Music{" "}
                        <span className="text-yellow-500 font-serif">Blogs</span>
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-zinc-200 max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Expert guides, live music ideas, and event entertainment inspiration
                    </motion.p>
                </div>
            </div>

            {/* Search & Filter Section */}
            <section className="bg-white dark:bg-zinc-950 py-12 px-4">
                <div className="container mx-auto max-w-7xl">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <SearchBar onSearch={setSearchQuery} placeholder="Search wedding music, event ideas..." />
                    </div>

                    {/* Category Filter */}
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 px-4 bg-white dark:bg-zinc-950">
                <div className="container mx-auto max-w-7xl">
                    {isLoading ? (
                        /* Skeleton loader grid */
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="animate-pulse bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden h-[450px]">
                                    <div className="h-64 bg-zinc-800" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 bg-zinc-800 rounded w-1/4" />
                                        <div className="h-8 bg-zinc-800 rounded w-3/4" />
                                        <div className="h-4 bg-zinc-800 rounded w-full" />
                                        <div className="h-4 bg-zinc-800 rounded w-5/6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-2xl text-zinc-500 dark:text-zinc-400">
                                No blogs found. Try adjusting your search or filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((post, index) => (
                                <BlogCard key={post.id || post.slug} post={post} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
