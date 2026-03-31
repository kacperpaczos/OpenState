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

    useEffect(() => {
        fetch("/data/interpellations.json")
            .then(res => res.json())
            .then(data => setInterpellations(data))
            .catch(() => setInterpellations([]));
    }, []);

    const filtered = useMemo(() => {
        const sorted = [...interpellations].sort((a, b) => b.num - a.num);
        if (!search) return sorted.slice(0, 50);
        const lower = search.toLowerCase();
        return sorted.filter(i =>
            i.title.toLowerCase().includes(lower) ||
            i.from.some(f => f.toLowerCase().includes(lower))
        ).slice(0, 50);
    }, [interpellations, search]);

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
                {filtered.map((i) => (
                    <div key={i.num} className="glass-card p-6 hover:bg-surface-color/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono text-gray-400">Nr {i.num} • {i.receiptDate}</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300">
                                {i.to && i.to[0]}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                            {i.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
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
        </div>
    );
}

