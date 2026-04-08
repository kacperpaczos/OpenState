"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface Interpellation {
    num: number;
    title: string;
    receiptDate: string;
    from: string[];
    to?: string[];
    replies?: { key: string }[];
}

export default function InterpellationsPage() {
    const [interpellations, setInterpellations] = useState<Interpellation[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        fetch("/data/interpellations.json")
            .then(res => res.json())
            .then(data => setInterpellations(data))
            .catch(() => setInterpellations([]));
    }, []);

    const filtered = useMemo(() => {
        const sorted = [...interpellations].sort((a, b) => b.num - a.num);
        if (!search) return sorted;
        const lower = search.toLowerCase();
        return sorted.filter(i =>
            i.title.toLowerCase().includes(lower) ||
            i.from.some(f => f.toLowerCase().includes(lower))
        );
    }, [interpellations, search]);

    const paginated = useMemo(() => {
        return filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    // Reset pagination on search
    useEffect(() => {
        setPage(1);
    }, [search]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">
                Interpelacje <span className="text-gradient">Poselskie</span>
            </h1>

            <div className="glass-card mb-8 p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Szukaj w interpelacjach (tytuł, autor)..."
                        className="w-full pl-12 pr-4 py-3 bg-surface-color border border-surface-border rounded-xl text-foreground focus:ring-2 focus:ring-purple-500/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {paginated.map((i) => (
                    <div key={i.num} className="glass-card p-6 hover:bg-surface-color/50 transition-colors">
                        <div className="flex justify-between items-start mb-2 gap-4">
                            <span className="text-xs font-mono text-text-secondary shrink-0">Nr {i.num} • {i.receiptDate}</span>
                            {i.to && i.to.length > 0 && (
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {i.to.slice(0, 3).map((recipient, idx) => (
                                        <span key={idx} title={recipient} className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-300 text-right">
                                            {recipient.replace(/Minister|Ministrowie kompetentni:/g, 'Min.').substring(0, 60)}{recipient.length > 60 ? '...' : ''}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                            {i.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4">
                            Zgłaszający: {i.from.join(", ")}
                        </p>
                        <Link
                            href={`https://sejm.gov.pl/Sejm10.nsf/InterpelacjaTresc.xsp?key=${i.replies?.[0]?.key || i.num}`}
                            target="_blank"
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                            Zobacz na stronie Sejmu →
                        </Link>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pb-10">
                    <button
                        onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl bg-surface-color text-text-secondary disabled:opacity-50 border border-surface-border hover:bg-surface-color-heavy transition-colors"
                    >
                        Poprzednia
                    </button>
                    <span className="text-sm font-medium text-text-secondary">
                        Strona {page} z {totalPages}
                    </span>
                    <button
                        onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl bg-surface-color text-text-secondary disabled:opacity-50 border border-surface-border hover:bg-surface-color-heavy transition-colors"
                    >
                        Następna
                    </button>
                </div>
            )}
        </div>
    );
}

