import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about The Band Company. With over 2000 live shows, we are the preferred choice for premium live music at weddings and corporate events across Maharashtra.',
    keywords: ['the band company history', 'live band experience', 'wedding singers mumbai'],
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'About Us | The Band Company',
        description: 'Discover the story behind India\'s most versatile live music band.',
    }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
