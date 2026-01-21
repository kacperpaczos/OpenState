"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, GitCompare, FileText } from "lucide-react";

interface DiffLine {
    type: "add" | "remove" | "unchanged";
    old_line_number: number | null;
    new_line_number: number | null;
    old_content: string | null;
    new_content: string | null;
}

interface DiffViewerProps {
    billId: string;
    fromVersion?: string;
    toVersion?: string;
}

export default function DiffViewer({ billId, fromVersion = "draft_rcl", toVersion = "sejm_v2_komisja" }: DiffViewerProps) {
    const [diffData, setDiffData] = useState<DiffLine[] | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"split" | "unified">("split");

    useEffect(() => {
        let mounted = true;

        fetch(`/data/bills_text/${billId}/diff_draft_to_komisja.json`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Diff not found: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (mounted) {
                    setDiffData(data.side_by_side || []);
                    setStats(data.summary?.stats || null);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (mounted) {
                    console.warn(`Diff not available for bill ${billId}`);
                    setDiffData([]);
                    setStats(null);
                    setLoading(false);
                }
            });

        return () => { mounted = false; };
    }, [billId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue"></div>
            </div>
        );
    }

    if (!diffData || diffData.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="mx-auto mb-3 text-apple-gray-400" size={48} />
                <p className="text-body-secondary">Brak dostępnych wersji do porównania.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Stats */}
            <div className="card-apple p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <GitCompare className="text-apple-blue" size={20} />
                    <div>
                        <h3 className="font-semibold text-foreground">Historia Zmian</h3>
                        {stats && (
                            <p className="text-xs text-apple-gray-500">
                                <span className="text-apple-green font-semibold">+{stats.additions}</span>
                                {" "}
                                <span className="text-apple-red font-semibold">-{stats.deletions}</span>
                                {" "}
                                ({stats.change_percentage?.toFixed(1)}% zmian)
                            </p>
                        )}
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("split")}
                        className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-all ${viewMode === "split"
                            ? "bg-apple-blue text-white"
                            : "bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300"
                            }`}
                    >
                        Side-by-Side
                    </button>
                    <button
                        onClick={() => setViewMode("unified")}
                        className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-all ${viewMode === "unified"
                            ? "bg-apple-blue text-white"
                            : "bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300"
                            }`}
                    >
                        Unified
                    </button>
                </div>
            </div>

            {/* Diff Content */}
            {viewMode === "split" ? (
                <SplitDiffView lines={diffData} />
            ) : (
                <UnifiedDiffView lines={diffData} />
            )}
        </div>
    );
}

function SplitDiffView({ lines }: { lines: DiffLine[] }) {
    return (
        <div className="card-apple p-0 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-apple-gray-200 dark:border-white/10 bg-apple-gray-50 dark:bg-white/5">
                <div className="px-4 py-2 border-r border-apple-gray-200 dark:border-white/10">
                    <p className="text-xs font-semibold text-apple-gray-700 dark:text-apple-gray-300">
                        Wersja Oryginalna
                    </p>
                </div>
                <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-apple-gray-700 dark:text-apple-gray-300">
                        Wersja Zmieniona
                    </p>
                </div>
            </div>

            {/* Lines */}
            <div className="max-h-96 overflow-y-auto">
                {lines.map((line, idx) => (
                    <div
                        key={idx}
                        className={`grid grid-cols-2 border-b border-apple-gray-100 dark:border-white/5 ${line.type === "add" ? "bg-apple-green/10" :
                            line.type === "remove" ? "bg-apple-red/10" : ""
                            }`}
                    >
                        {/* Old Side */}
                        <div className="px-4 py-1.5 border-r border-apple-gray-200 dark:border-white/10 font-mono text-xs">
                            {line.old_content !== null ? (
                                <span className={line.type === "remove" ? "text-apple-red" : "text-foreground"}>
                                    {line.old_content}
                                </span>
                            ) : (
                                <span className="text-apple-gray-300">—</span>
                            )}
                        </div>

                        {/* New Side */}
                        <div className="px-4 py-1.5 font-mono text-xs">
                            {line.new_content !== null ? (
                                <span className={line.type === "add" ? "text-apple-green" : "text-foreground"}>
                                    {line.new_content}
                                </span>
                            ) : (
                                <span className="text-apple-gray-300">—</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UnifiedDiffView({ lines }: { lines: DiffLine[] }) {
    return (
        <div className="card-apple p-4 space-y-1 max-h-96 overflow-y-auto font-mono text-xs">
            {lines.map((line, idx) => {
                if (line.type === "add") {
                    return (
                        <div key={idx} className="bg-apple-green/10 px-2 py-1 rounded">
                            <span className="text-apple-green font-semibold">+ </span>
                            <span className="text-foreground">{line.new_content}</span>
                        </div>
                    );
                } else if (line.type === "remove") {
                    return (
                        <div key={idx} className="bg-apple-red/10 px-2 py-1 rounded">
                            <span className="text-apple-red font-semibold">- </span>
                            <span className="text-foreground">{line.old_content}</span>
                        </div>
                    );
                } else {
                    return (
                        <div key={idx} className="px-2 py-1">
                            <span className="text-apple-gray-500">  </span>
                            <span className="text-apple-gray-600 dark:text-apple-gray-400">{line.old_content}</span>
                        </div>
                    );
                }
            })}
        </div>
    );
}
