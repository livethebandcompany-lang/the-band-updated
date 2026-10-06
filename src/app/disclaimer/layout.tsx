import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Disclaimer',
    description: 'Disclaimer and legal notice regarding information, performance terms, and services provided by The Band Company.',
    alternates: {
        canonical: '/disclaimer',
    },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
