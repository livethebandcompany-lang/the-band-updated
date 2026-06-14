import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.06),transparent_60%)]" />
      <div className="text-center relative z-10 space-y-6">
        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">404 — Not Found</p>
        <h1 className="text-7xl font-black text-white tracking-tighter">Lost the Beat</h1>
        <p className="text-zinc-500 text-sm max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
