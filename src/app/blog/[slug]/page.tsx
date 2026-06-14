"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Mail, ArrowRight, Share2, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogSidebar from "@/components/BlogSidebar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { blogPosts } from "@/data/blogData";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

const HighlightText = ({ text }: { text: string }) => {
    if (!text) return null;
    const parts = text.split(/(The Band Company)/g);
    return (
        <>
            {parts.map((part, i) =>
                part === "The Band Company" ? (
                    <span key={i} className="text-zinc-900 dark:text-white font-bold whitespace-nowrap">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; title: string; level: number }>>([]);
    const [shareSuccess, setShareSuccess] = useState(false);
    
    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allBlogs, setAllBlogs] = useState<any[]>([]);

    useEffect(() => {
        if (!slug) return;
        setIsLoading(true);
        fetch(`/api/public/blogs/${slug}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.blog) {
                    setPost(data.blog);
                } else {
                    const staticPost = blogPosts.find(p => p.slug === slug);
                    setPost(staticPost || null);
                }
            })
            .catch(err => {
                console.error("Error fetching blog:", err);
                const staticPost = blogPosts.find(p => p.slug === slug);
                setPost(staticPost || null);
            })
            .finally(() => setIsLoading(false));
    }, [slug]);

    useEffect(() => {
        fetch('/api/public/blogs')
            .then(res => res.json())
            .then(data => {
                if (data && data.blogs) {
                    setAllBlogs(data.blogs);
                }
            })
            .catch(err => console.error("Error fetching related blogs:", err));
    }, []);

    // Share handler with production URL
    const handleShare = async () => {
        const blogUrl = `${siteConfig.url}/blog/${slug}`;
        const shareData = {
            title: post?.title || "The Band Company Blog",
            text: post?.excerpt || "",
            url: blogUrl
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(blogUrl);
                setShareSuccess(true);
                setTimeout(() => setShareSuccess(false), 2000);
            }
        } catch (error) {
            console.log("Error sharing:", error);
        }
    };

    // Generate table of contents from H2 headings
    useEffect(() => {
        if (!post) return;

        const toc = post.content.sections
            .filter((section: any) => section.heading)
            .map((section: any, index: number) => ({
                id: `section-${index}`,
                title: section.heading,
                level: 2
            }));

        setTableOfContents(toc);
    }, [post]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white dark:bg-zinc-950">
                <Navbar />
                <div className="container mx-auto max-w-4xl px-4 py-32 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="w-12 h-12 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
                    <p className="text-zinc-500 font-semibold uppercase tracking-widest text-sm">Loading Premium Experience...</p>
                </div>
                <Footer />
            </main>
        );
    }

    if (!post) {
        return (
            <main className="min-h-screen bg-white dark:bg-zinc-950">
                <Navbar />
                <div className="container mx-auto max-w-4xl px-4 py-32 text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Blog Post Not Found</h1>
                    <Link href="/blog" className="text-yellow-600 dark:text-yellow-500 hover:underline">
                        ← Back to Blog
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    // Get related posts
    const displayAllBlogs = allBlogs.length > 0 ? allBlogs : blogPosts;
    const relatedPosts = displayAllBlogs
        .filter(p => p.slug !== post.slug && p.category === post.category)
        .slice(0, 3);

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950">
            <Navbar />

            <article className="pt-32 pb-12">
                <div className="container mx-auto max-w-7xl px-4">
                    {/* Breadcrumbs */}
                    <Breadcrumbs items={[
                        { label: "Blogs", href: "/blog" },
                        { label: post.title, href: `/blog/${post.slug}` }
                    ]} />

                    <div className="grid lg:grid-cols-[1fr_320px] gap-12">
                        {/* Main Content */}
                        <div>
                            {/* Category Tag */}
                            <div className="mb-4">
                                <span className="inline-block px-4 py-1.5 bg-yellow-500 text-black text-sm font-bold uppercase tracking-wide rounded-full">
                                    {post.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                                {post.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center justify-between gap-6 text-zinc-600 dark:text-zinc-400 mb-8 pb-8 border-b-2 border-zinc-200 dark:border-zinc-800">
                                <div className="flex flex-wrap items-center gap-6">
                                    <span className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">{post.author}</span>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {post.date}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime} read
                                    </span>
                                </div>

                                {/* Share Button */}
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 font-semibold rounded-full border-2 border-yellow-500/30 hover:border-yellow-500 transition-all group relative"
                                >
                                    {shareSuccess ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Featured Image */}
                            <div className="relative h-96 mb-12 rounded-xl overflow-hidden shadow-2xl">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1280px) 100vw, 1280px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                            </div>


                            {/* Intro */}
                            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                                <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                                    <HighlightText text={post.content.intro} />
                                </p>
                            </div>

                            {/* Sections */}
                            <div className="space-y-10 mb-12">
                                {post.content.sections.map((section: any, index: number) => (
                                    <motion.section
                                        key={index}
                                        id={`section-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="scroll-mt-32"
                                    >
                                        {section.heading && (
                                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4 scroll-mt-32">
                                                {section.heading}
                                            </h2>
                                        )}
                                        {section.content && (
                                            <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
                                                <HighlightText text={section.content} />
                                            </p>
                                        )}
                                        {section.list && (
                                            <ul className="space-y-3 ml-6 mb-4">
                                                {section.list.map((item: string, i: number) => (
                                                    <li key={i} className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 list-disc marker:text-yellow-600">
                                                        <HighlightText text={item} />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.section>
                                ))}
                            </div>

                            {/* Mid-Article CTA */}
                            <motion.div
                                className="my-16 p-8 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/20 dark:to-amber-950/20 border-2 border-yellow-500/30 rounded-xl text-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-2xl md:text-3xl font-bold font-serif text-zinc-900 dark:text-white mb-3">
                                    Get Live Music Quote in 30 Seconds
                                </h3>
                                <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">
                                    Planning your event? Let's make it unforgettable with live music!
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <a
                                        href="tel:7779945379"
                                        className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call Now
                                    </a>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold px-8 py-3 rounded-full border-2 border-zinc-200 dark:border-zinc-700 transition-all hover:scale-105"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Get Quote
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Conclusion */}
                            <div className="p-8 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl mb-12">
                                <p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium">
                                    <HighlightText text={post.content.conclusion} />
                                </p>
                            </div>

                        </div>

                        {/* Sidebar */}
                        <BlogSidebar tableOfContents={tableOfContents} />
                    </div>

                    {/* Related Blogs */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-20 pt-12 border-t-2 border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
                                Related Articles
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/blog/${relatedPost.slug}`}
                                        className="group block bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-500 hover:shadow-xl transition-all"
                                    >
                                        <div className="h-40 relative">
                                            <Image
                                                src={relatedPost.imageUrl}
                                                alt={relatedPost.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                        </div>
                                        <div className="p-5">
                                            <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-500 uppercase">
                                                {relatedPost.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-2 mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors line-clamp-2">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                                                {relatedPost.excerpt}
                                            </p>
                                            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 font-semibold text-sm">
                                                Read Article
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Booking CTA Banner */}
                    <div className="mt-16 p-10 md:p-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl text-center text-white">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4">
                            Planning a Celebration?
                            <span className="block">Bring It To Life With The Band Company</span>
                        </h2>
                        <p className="text-base md:text-lg mb-8 max-w-3xl mx-auto opacity-95 leading-relaxed">
                            From intimate gatherings to grand celebrations, we create live music experiences that get everyone singing, smiling, and making memories.
                            <span className="block mt-2 font-medium">Let's make your event unforgettable.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="tel:7779945379"
                                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <Phone className="w-5 h-5" />
                                Call 7779945379
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-black font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
