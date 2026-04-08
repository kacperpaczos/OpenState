"use client";

import { VoteRecord } from "@/lib/votes";
import { CheckCircle, XCircle, MinusCircle, UserX, BarChart3, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

const VOTE_CONFIG: Record<string, { label: string; icon: React.ReactNode; badge: string }> = {
    YES: { label: "ZA", icon: <CheckCircle size={16} className="text-green-500" />, badge: "bg-green-500/10 text-green-400 border-green-500/20" },
    NO: { label: "PRZECIW", icon: <XCircle size={16} className="text-red-500" />, badge: "bg-red-500/10 text-red-400 border-red-500/20" },
    ABSTAIN: { label: "WSTRZYMAŁ", icon: <MinusCircle size={16} className="text-yellow-400" />, badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    ABSENT: { label: "NIEOBECNY", icon: <UserX size={16} className="text-gray-500" />, badge: "bg-surface-color text-text-secondary border-surface-border" },
};

function VoteRow({ vote }: { vote: VoteRecord }) {
    const cfg = VOTE_CONFIG[vote.vote] ?? VOTE_CONFIG.ABSENT;
    return (
        <Link
            href={`/glosowania/${vote.sitting}/${vote.votingNumber}`}
            className="flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors group border-b border-surface-border last:border-0"
        >
            <div className="pt-0.5 flex-shrink-0">{cfg.icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{vote.title}</p>
                {vote.topic && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{vote.topic}</p>}
            </div>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border flex-shrink-0 ${cfg.badge}`}>
                {cfg.label}
            </span>
        </Link>
    );
}

interface SittingGroup {
    sitting: number;
    date: string;
    votes: VoteRecord[];
}

function SittingSection({ group }: { group: SittingGroup }) {
    const [open, setOpen] = useState(false);
    const yes = group.votes.filter(v => v.vote === "YES").length;
    const no = group.votes.filter(v => v.vote === "NO").length;
    const absent = group.votes.filter(v => v.vote === "ABSENT").length;

    return (
        <div className="border-b border-surface-border last:border-0">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors text-left"
            >
                {open ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
                <div className="flex-1">
                    <span className="font-medium text-foreground text-sm">Posiedzenie {group.sitting}</span>
                    {group.date && <span className="text-gray-500 text-xs ml-2">{group.date}</span>}
                </div>
                <div className="flex items-center gap-2 text-xs">
                    {yes > 0 && <span className="text-green-400">✓ {yes}</span>}
                    {no > 0 && <span className="text-red-400">✗ {no}</span>}
                    {absent > 0 && <span className="text-gray-500">✗ {absent} nieob.</span>}
                    <span className="text-gray-600">({group.votes.length})</span>
                </div>
            </button>

            {open && (
                <div className="pl-4 bg-white/[0.02]">
                    {group.votes.map(v => (
                        <VoteRow key={`${v.sitting}-${v.votingNumber}`} vote={v} />
                    ))}
                </div>
            )}
        </div>
    );
}

type VoteFilter = "ALL" | "YES" | "NO" | "ABSTAIN" | "ABSENT";
const PAGE_SIZE = 50;

const FILTERS: { value: VoteFilter; label: string }[] = [
    { value: "ALL", label: "Wszystkie" },
    { value: "YES", label: "ZA" },
    { value: "NO", label: "PRZECIW" },
    { value: "ABSTAIN", label: "WSTRZ." },
    { value: "ABSENT", label: "NIEOB." },
];

export default function VotingHistory({ votes }: { votes: VoteRecord[] }) {
    const [filter, setFilter] = useState<VoteFilter>("ALL");
    const [limit, setLimit] = useState(PAGE_SIZE);

    if (!votes || votes.length === 0) {
        return (
            <div className="glass-card p-8 text-center opacity-70 mt-8">
                <h3 className="text-xl font-bold text-foreground mb-2">Historia Głosowań</h3>
                <p className="text-text-secondary">Brak danych o ostatnich głosowaniach.</p>
            </div>
        );
    }

    // Apply filter
    const filtered = useMemo(
        () => filter === "ALL" ? votes : votes.filter(v => v.vote === filter),
        [votes, filter]
    );

    // Apply limit (on filtered votes before grouping)
    const limitedVotes = filtered.slice(0, limit);
    const hasMore = filtered.length > limit;

    // Group by sitting, sorted newest first
    const grouped = limitedVotes.reduce<Record<number, SittingGroup>>((acc, vote) => {
        if (!acc[vote.sitting]) {
            acc[vote.sitting] = { sitting: vote.sitting, date: vote.date, votes: [] };
        }
        acc[vote.sitting].votes.push(vote);
        return acc;
    }, {});
    const groups = Object.values(grouped).sort((a, b) => b.sitting - a.sitting);

    return (
        <div className="glass-card overflow-hidden mt-8">
            {/* Header */}
            <div className="p-6 border-b border-surface-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <BarChart3 size={18} className="text-accent-blue" />
                        Historia Głosowań
                    </h3>
                    <span className="text-xs text-gray-500 bg-surface-color px-2 py-1 rounded">
                        {filtered.length} głosowań · {groups.length} posiedzeń
                    </span>
                </div>
                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            data-testid={`filter-${f.value}`}
                            onClick={() => { setFilter(f.value); setLimit(PAGE_SIZE); }}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === f.value
                                ? "bg-accent-blue text-white border-accent-blue"
                                : "border-surface-border text-gray-400 hover:border-gray-500"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grouped rows */}
            <div>
                {groups.length === 0 ? (
                    <p className="p-6 text-center text-gray-500 text-sm">Brak głosowań dla wybranego filtra.</p>
                ) : (
                    groups.map(g => <SittingSection key={g.sitting} group={g} />)
                )}
            </div>

            {/* Load more */}
            {hasMore && (
                <div className="p-4 border-t border-surface-border text-center">
                    <button
                        data-testid="load-more"
                        onClick={() => setLimit(l => l + PAGE_SIZE)}
                        className="text-sm text-accent-blue hover:underline"
                    >
                        Załaduj więcej ({filtered.length - limit} pozostałych)
                    </button>
                </div>
            )}
        </div>
    );
}
