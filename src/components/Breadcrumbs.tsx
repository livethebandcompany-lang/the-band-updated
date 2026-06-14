"use client";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    {index === items.length - 1 ? (
                        <span className="text-zinc-900 dark:text-white font-medium">{item.label}</span>
                    ) : (
                        <Link href={item.href} className="hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
