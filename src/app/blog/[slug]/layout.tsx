import { Metadata } from 'next';
import { blogPosts } from '@/data/blogData';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: 'Blog Not Found | The Band Company',
        };
    }

    return {
        title: `${post.title} | The Band Company Blog`,
        description: post.excerpt,
        keywords: [post.category.toLowerCase(), 'live band blog', 'wedding music tips'],
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.imageUrl],
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.imageUrl],
        }
    };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
