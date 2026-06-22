import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog & Live Music Guides',
    description: 'Read the latest ideas, tips, and booking guides for hiring a live band for your wedding, corporate event, or private party in Mumbai and Pune.',
    keywords: ['wedding music ideas', 'live band booking guide', 'sangeet song ideas', 'corporate event entertainment'],
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: 'The Band Company Blog | Live Music Ideas',
        description: 'Expert tips on hiring wedding and corporate live bands in Mumbai, Pune, and Maharashtra.',
    }
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
