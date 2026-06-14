'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, FileText, Users, Calendar, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  type: 'booking' | 'invoice' | 'client';
  title: string;
  subtitle: string;
  meta?: string;
  href: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Debounced search
  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && selected >= 0) {
      handleSelect(results[selected]);
    }
  };

  const typeIcon = (type: string) => {
    if (type === 'booking') return <Calendar size={13} className="text-blue-400 shrink-0" />;
    if (type === 'invoice') return <FileText size={13} className="text-amber-400 shrink-0" />;
    return <Users size={13} className="text-emerald-400 shrink-0" />;
  };

  const typeLabel = (type: string) => {
    if (type === 'booking') return <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">Booking</span>;
    if (type === 'invoice') return <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Invoice</span>;
    return <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Client</span>;
  };

  const showDropdown = isOpen && query.length >= 2;

  return (
    <div className="relative flex-1 max-w-sm">
      {/* Search Input */}
      <div
        className={`flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900/50 border rounded-lg px-3 py-1.5 w-full transition-all ${
          isOpen
            ? 'border-blue-500/50 ring-1 ring-blue-500/30 dark:ring-blue-500/20'
            : 'border-zinc-200 dark:border-zinc-800/50'
        }`}
      >
        {isLoading ? (
          <Loader2 size={16} className="text-zinc-400 animate-spin shrink-0" />
        ) : (
          <Search size={16} className="text-zinc-400 shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search bookings, clients, invoices..."
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); setSelected(-1); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none w-full placeholder:text-zinc-500"
        />
        {query ? (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        ) : (
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
            <span className="text-[9px]">⌘</span> K
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden min-w-[380px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-3 px-4 py-4 text-sm text-zinc-500">
              <Loader2 size={16} className="animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-zinc-400">No results for <span className="text-zinc-600 dark:text-zinc-300">"{query}"</span></p>
              <p className="text-xs text-zinc-500 mt-1">Try searching by client name, phone, or invoice number</p>
            </div>
          ) : (
            <div>
              <div className="px-4 pt-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{results.length} result{results.length !== 1 ? 's' : ''}</p>
              </div>
              <ul className="pb-2 max-h-[360px] overflow-y-auto">
                {results.map((result, i) => (
                  <li key={result.id}>
                    <button
                      onClick={() => handleSelect(result)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        selected === i
                          ? 'bg-zinc-100 dark:bg-zinc-800'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        {typeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{result.title}</p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{result.subtitle}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {typeLabel(result.type)}
                        {result.meta && <span className="text-[10px] text-zinc-400">{result.meta}</span>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-2 flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50">
                <span className="text-[10px] text-zinc-400">↑↓ Navigate</span>
                <span className="text-[10px] text-zinc-400">↵ Open</span>
                <span className="text-[10px] text-zinc-400">Esc Close</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
