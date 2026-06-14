import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg animate-in fade-in zoom-in duration-300">
      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Syncing...</span>
    </div>
  );
}
