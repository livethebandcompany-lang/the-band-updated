'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiChevronDown, BiCheck } from 'react-icons/bi';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1 relative w-full" ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-zinc-900/40 border rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between transition-all ${
          isOpen ? 'border-blue-400 dark:border-blue-500/50 ring-1 ring-blue-500/20' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
        } ${!selectedOption ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-900 dark:text-white'}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <BiChevronDown size={20} className="text-zinc-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
           <motion.div
             initial={{ opacity: 0, y: -4, scale: 0.98 }}
             animate={{ opacity: 1, y: 4, scale: 1 }}
             exit={{ opacity: 0, y: -4, scale: 0.98 }}
             transition={{ duration: 0.15, ease: 'easeOut' }}
             className="absolute z-[60] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden py-1.5"
           >
             <div className="max-h-60 overflow-y-auto scrollbar-hide">
               {options.map((option) => (
                 <button
                   key={option.value}
                   type="button"
                   onClick={() => {
                     onChange(option.value);
                     setIsOpen(false);
                   }}
                   className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between transition-colors ${
                     option.value === value 
                     ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium' 
                     : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50'
                   }`}
                 >
                   <span className="truncate">{option.label}</span>
                   {option.value === value && (
                     <motion.div 
                       initial={{ scale: 0 }} 
                       animate={{ scale: 1 }} 
                       transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                     >
                       <BiCheck size={18} />
                     </motion.div>
                   )}
                 </button>
               ))}
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
