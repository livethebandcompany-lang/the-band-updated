import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with The Band Company to book premium live music for your wedding, corporate event, or private party. Serving Mumbai, Pune, and Maharashtra.',
    keywords: ['hire a band mumbai', 'book live music punr', 'contact wedding band', 'live singer for event'],
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Contact Us | The Band Company',
        description: 'Book premium live music experiences for your event today.',
    }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
