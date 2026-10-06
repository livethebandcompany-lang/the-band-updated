import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cancellation & Refund Policy',
    description: 'Understand the cancellation, rescheduling, and refund terms for event bookings with The Band Company.',
    alternates: {
        canonical: '/cancellation-policy',
    },
};

export default function CancellationPolicyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
