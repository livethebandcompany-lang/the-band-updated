'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.05),transparent_60%)]" />
      <div className="text-center relative z-10 space-y-6">
        <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Something went wrong</p>
        <h1 className="text-5xl font-black text-white tracking-tighter">Unexpected Error</h1>
        <p className="text-zinc-500 text-sm max-w-xs mx-auto">
          An error occurred on this page. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
