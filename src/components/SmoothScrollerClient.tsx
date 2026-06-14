"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Must live in a Client Component — ssr:false is not allowed in Server Components
const SmoothScroller = dynamic(() => import("@/components/SmoothScroller"), { ssr: false });

export default function SmoothScrollerClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lenis intercepts ALL scroll events — disable it on admin routes so
  // the panel's overflow-auto containers (sidebar, main content) work normally
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return <SmoothScroller>{children}</SmoothScroller>;
}
