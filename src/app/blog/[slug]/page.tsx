import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, BlogPost } from "@/data/blogData";
import BlogPostClient from "./BlogPostClient";
import connectDB from "@/lib/db";
import BlogPostModel from "@/models/BlogPost";

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
    // 1. Check static blog data first (fastest & reliable)
    const staticPost = blogPosts.find((p) => p.slug === slug);
    if (staticPost) {
        return staticPost;
    }

    // 2. Fallback to MongoDB if dynamic post created via CMS
    try {
        await connectDB();
        const dbPost = await BlogPostModel.findOne({ slug }).lean();
        if (dbPost) {
            return JSON.parse(JSON.stringify(dbPost)) as BlogPost;
        }
    } catch {
        // Fallback silently if DB unavailable
    }

    return null;
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const title = post.title;
    const description = post.excerpt;
    const canonicalUrl = `https://www.thebandcompany.in/blog/${post.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "article",
            publishedTime: post.date,
            authors: [post.author || "The Band Company"],
            images: post.imageUrl
                ? [
                      {
                          url: post.imageUrl,
                          width: 1200,
                          height: 630,
                          alt: post.title,
                      },
                  ]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: post.imageUrl ? [post.imageUrl] : undefined,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const canonicalUrl = `https://www.thebandcompany.in/blog/${post.slug}`;

    // Schema.org structured data for SEO rich snippets
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl ? [post.imageUrl] : undefined,
        datePublished: post.date,
        author: {
            "@type": "Organization",
            name: post.author || "The Band Company",
            url: "https://www.thebandcompany.in",
        },
        publisher: {
            "@type": "Organization",
            name: "The Band Company",
            logo: {
                "@type": "ImageObject",
                url: "https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPostClient post={post} allBlogs={blogPosts} />
        </>
    );
}
