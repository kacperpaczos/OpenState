"use client";

import { useState, useMemo } from "react";
import { Search, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import Link from "next/link";
import { VotingSummary } from "@/lib/votings";

const PAGE = 50;

function VoteResultBadge({ title }: { title: string }) {
    const t = title.toLowerCase();
    if (t.includes("przyjęt") || t.includes("uchwalon") || t.includes("ratyfikac")) {
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-green-500/10 text-green-400 border-green-500/20">Przyjęto</span>;
    }
    if (t.includes("odrzucon") || t.includes("odrzut")) {
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/20">Odrzucono</span>;
    }
    return null;
}

export default function VotingsList({ votings }: { votings: VotingSummary[] }) {
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(PAGE);

    const filtered = useMemo(() => {
        if (!search.trim()) return votings;
        const lo = search.toLowerCase();
        return votings.filter(v =>
            v.title.toLowerCase().includes(lo) ||
            v.topic?.toLowerCase().includes(lo)
        );
    }, [votings, search]);

    const visible = filtered.slice(0, limit);
    const hasMore = filtered.length > limit;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
            <header className="mb-8">
                <span className="text-blue-400 font-mono text-sm mb-2 block">X Kadencja Sejmu</span>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                    Przegl<span className="text-gradient">ądarka Głosowań</span>
                </h1>
                <p className="text-gray-400 mt-2">{votings.length} głosowań z {new Set(votings.map(v => v.sitting)).size} posiedzeń</p>
            </header>

            {/* Search */}
            <div className="glass-card p-4 mb-6 flex items-center gap-3">
                <Search size={18} className="text-gray-500 shrink-0" />
                <input
                    type="text"
                    placeholder="Szukaj głosowania (tytuł, temat)..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setLimit(PAGE); }}
                    className="flex-1 bg-transparent text-foreground placeholder-gray-500 outline-none text-sm"
                    data-testid="voting-search"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="text-gray-500 hover:text-foreground text-xs">✕</button>
                )}
            </div>

            {/* Count */}
            <p className="text-xs text-gray-500 mb-4">
                Wyświetlam {visible.length} z {filtered.length} głosowań
                {search && ` · wyniki dla "${search}"`}
            </p>

            {/* List */}
            <div className="glass-card overflow-hidden">
                {visible.length === 0 ? (
                    <p className="p-8 text-center text-gray-500 text-sm">Brak wyników dla podanej frazy.</p>
                ) : (
                    <div className="divide-y divide-white/5">
                        {visible.map(v => (
                            <Link
                                key={`${v.sitting}-${v.votingNumber}`}
                                href={`/glosowania/${v.sitting}/${v.votingNumber}`}
                                className="flex items-start gap-4 px-5 py-4 hover:bg-white/5 transition-colors group"
                            >
                                <div className="w-10 shrink-0 text-center pt-0.5">
                                    <div className="text-[10px] text-gray-600 uppercase font-mono">pos.</div>
                                    <div className="text-lg font-bold text-gray-400 leading-none">{v.sitting}</div>
                                    <div className="text-[10px] text-gray-600">/{v.votingNumber}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-blue-300 transition-colors">{v.title}</p>
                                    {v.topic && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{v.topic}</p>}
                                    <p className="text-[10px] text-gray-600 mt-1">{v.date} · {v.kind}</p>
                                </div>
                                <div className="shrink-0 pt-0.5">
                                    <VoteResultBadge title={v.title} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {hasMore && (
                <div className="text-center mt-6">
                    <button
                        data-testid="load-more-votings"
                        onClick={() => setLimit(l => l + PAGE)}
                        className="px-6 py-2.5 bg-accent-blue text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Załaduj więcej ({filtered.length - limit} pozostałych)
                    </button>
                </div>
            )}
        </div>
    );
}
