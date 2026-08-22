'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GPKHLMNJ9L';

export default function GoogleTagManager() {
  const pathname = usePathname();

  // Fire pageview on every SPA navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag && GA_ID) {
      (window as any).gtag('config', GA_ID, { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
