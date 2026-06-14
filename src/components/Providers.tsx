'use client';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
    </SessionProvider>
  );
}
