import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy of The Band Company detailing how your personal information is collected, used, and protected.',
    alternates: {
        canonical: '/privacy-policy',
    },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
