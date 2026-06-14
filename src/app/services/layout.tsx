import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Services',
    description: 'Explore the premium live music services offered by The Band Company. From full bands for sangeets to solo acoustic artists for private villa parties.',
    keywords: ['live music services', 'wedding band booking', 'corporate event music', 'book a singer'],
    openGraph: {
        title: 'Our Services | The Band Company',
        description: 'Explore our premium live music services for your next event.',
    }
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
