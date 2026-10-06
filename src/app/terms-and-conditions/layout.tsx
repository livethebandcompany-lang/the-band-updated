import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'Read the terms and conditions for booking live entertainment and musical performances with The Band Company.',
    alternates: {
        canonical: '/terms-and-conditions',
    },
};

export default function TermsAndConditionsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
