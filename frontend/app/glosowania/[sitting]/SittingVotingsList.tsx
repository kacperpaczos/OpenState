"use client";

import { VotingSummary } from "@/lib/votings";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const PAGE_SIZE = 30;

export default function SittingVotingsList({
    votings,
    sitting,
}: {
    votings: VotingSummary[];
    sitting: string;
}) {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(votings.length / PAGE_SIZE);
    const visible = votings.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <>
            {/* Count + pagination info */}
            <p className="text-sm text-gray-500 mb-4">
                Głosowania {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, votings.length)} z {votings.length}
                {totalPages > 1 && ` · Strona ${page + 1} z ${totalPages}`}
            </p>

            {/* List */}
            <div className="space-y-3">
                {visible.map((v) => (
                    <Link
                        key={v.votingNumber}
                        href={`/glosowania/${sitting}/${v.votingNumber}`}
                        className="glass-card p-5 flex items-start gap-4 hover:bg-surface-hover transition-colors group block"
                    >
                        <div className="w-14 shrink-0 text-center">
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Nr</div>
                            <div className="text-2xl font-bold text-foreground leading-none">{v.votingNumber}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 mb-1">{v.date} · {v.kind}</div>
                            <h3 className="text-base font-semibold text-foreground mb-1 leading-snug group-hover:text-blue-400 transition-colors">{v.title}</h3>
                            {v.topic && <p className="text-gray-500 text-sm">{v.topic}</p>}
                        </div>
                        <div className="shrink-0 self-center text-gray-500 group-hover:text-blue-400 transition-colors">
                            <ArrowRight size={18} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                        onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={page === 0}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl border border-surface-border text-sm font-medium text-foreground disabled:opacity-30 hover:bg-surface-hover transition-colors"
                    >
                        <ChevronLeft size={16} /> Poprzednia
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            // Show pages around current
                            let p = i;
                            if (totalPages > 7) {
                                if (page < 4) p = i;
                                else if (page > totalPages - 5) p = totalPages - 7 + i;
                                else p = page - 3 + i;
                            }
                            return (
                                <button
                                    key={p}
                                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page
                                            ? 'bg-accent-blue text-white'
                                            : 'border border-surface-border text-foreground hover:bg-surface-hover'
                                        }`}
                                >
                                    {p + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => { setPage(p => Math.min(totalPages - 1, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={page === totalPages - 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl border border-surface-border text-sm font-medium text-foreground disabled:opacity-30 hover:bg-surface-hover transition-colors"
                    >
                        Następna <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </>
    );
}
