"use client";

import { Bill } from "@/lib/bills";
import { FileText, ArrowRight, Clock, Euro, ArrowUpDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

type ViewMode = "cards" | "compact" | "table";
type SortField = "id" | "title" | "date" | "stage";
type SortDirection = "asc" | "desc";

export default function BillsList({ initialProcesses }: { initialProcesses: Bill[] }) {
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState<ViewMode>("cards");
    const [headerHidden, setHeaderHidden] = useState(false);

    // Table sort state
    const [sortField, setSortField] = useState<SortField>("id");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    // Local filtering
    const filteredBills = useMemo(() => {
        let items = initialProcesses;
        if (statusFilter !== "all") {
             if (statusFilter === "UE") {
                 items = items.filter(b => b.isEU);
             } else {
                 items = items.filter(b => b.documentType === statusFilter);
             }
        }
        return items;
    }, [initialProcesses, statusFilter]);

    // Auto-hide header on scroll down
    useEffect(() => {
        let lastScroll = 0;
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 100 && currentScroll > lastScroll) {
                setHeaderHidden(true);
            } else if (currentScroll < lastScroll) {
                setHeaderHidden(false);
            }
            lastScroll = currentScroll;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const displayBills = useMemo(() => {
        if (viewMode !== "table") return filteredBills;
        
        let result = [...filteredBills];
        result.sort((a, b) => {
            let aVal: any, bVal: any;

            switch (sortField) {
                case "id":
                    aVal = parseInt(a.id) || 0;
                    bVal = parseInt(b.id) || 0;
                    break;
                case "title":
                    aVal = a.title;
                    bVal = b.title;
                    break;
                case "date":
                    aVal = a.date || "";
                    bVal = b.date || "";
                    break;
                case "stage":
                    aVal = a.kanbanStage || "";
                    bVal = b.kanbanStage || "";
                    break;
            }

            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
        return result;
    }, [filteredBills, viewMode, sortField, sortDirection]);

    const [visibleCount, setVisibleCount] = useState(50);

    // Reset pagination when filter changes
    useEffect(() => {
        setVisibleCount(50);
    }, [statusFilter]);

    return (
        <div className={`mx-auto fade-in h-full flex flex-col ${viewMode === 'table' ? 'max-w-[1600px] px-4' : viewMode === 'compact' ? 'max-w-[1400px] px-4' : 'max-w-7xl px-4'}`}>
            <header
                className={`mb-4 mt-6 transition-all duration-300 ${viewMode !== 'cards' ? 'sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-apple-gray-200 dark:border-white/10 pb-4' : ''}`}
                style={viewMode === 'cards' ? {
                    transform: headerHidden ? 'translateY(-150px)' : 'translateY(0)',
                    opacity: headerHidden ? 0 : 1
                } : {}}
            >
                <div className="flex items-center justify-between mb-2 gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className={`${viewMode === "cards" ? "text-title-large" : "text-xl font-bold"} text-foreground`}>
                            Śledzenie Ustaw
                        </h1>
                        {viewMode !== "cards" && (
                            <span className="text-sm font-semibold text-apple-gray-500">
                                ({displayBills.length} projektów)
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {/* View Filters directly beside switcher if simplified */}
                        {viewMode !== "cards" && (
                            <div className="hidden md:flex gap-1 mr-4 border-r border-apple-gray-200 dark:border-white/10 pr-4">
                               <MiniFilterButton active={statusFilter === "all"} onClick={() => setStatusFilter("all")} label="Wszystkie" />
                               <MiniFilterButton active={statusFilter === "Projekt ustawy"} onClick={() => setStatusFilter("Projekt ustawy")} label="Krajowe" />
                               <MiniFilterButton active={statusFilter === "UE"} onClick={() => setStatusFilter("UE")} label="UE" />
                            </div>
                        )}
                        
                        {(["cards", "compact", "table"] as ViewMode[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-colors capitalize ${
                                    viewMode === mode
                                        ? 'bg-apple-blue text-white'
                                        : 'bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
                {viewMode === "cards" && <p className="text-body-secondary">Projekty legislacyjne X kadencji Sejmu RP</p>}
            </header>

            {/* Standard Filters */}
            {viewMode === "cards" && (
                <div className="mb-6 space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <FilterButton active={statusFilter === "all"} onClick={() => setStatusFilter("all")} label="Wszystkie" />
                        <FilterButton active={statusFilter === "Projekt ustawy"} onClick={() => setStatusFilter("Projekt ustawy")} label="Projekty Ustaw" />
                        <FilterButton active={statusFilter === "Projekt uchwały"} onClick={() => setStatusFilter("Projekt uchwały")} label="Uchwały" />
                        <FilterButton active={statusFilter === "UE"} onClick={() => setStatusFilter("UE")} label="Tylko UE" />
                    </div>
                </div>
            )}

            {/* Content Display based on ViewMode */}
            <div className={`pb-20 ${viewMode !== 'cards' ? 'flex-1 overflow-auto custom-scrollbar' : ''}`}>
                {displayBills.length === 0 && (
                    <div className="col-span-full text-center py-16">
                        <FileText className="mx-auto mb-3 text-apple-gray-400" size={48} />
                        <p className="text-body-secondary">Nie znaleziono procesów legislacyjnych.</p>
                    </div>
                )}
                
                {viewMode === "cards" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {displayBills.slice(0, visibleCount).map((process) => <ProcessCard key={process.id} process={process} />)}
                    </div>
                )}

                {viewMode === "compact" && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                        {displayBills.slice(0, visibleCount).map((process) => <CompactBillCard key={process.id} process={process} />)}
                    </div>
                )}

                {viewMode === "table" && (
                     <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-apple-gray-50 dark:bg-apple-gray-900 border-b border-apple-gray-200 dark:border-white/10 z-10">
                            <tr>
                                <TableHeader field="id" label="#" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} width="w-20" />
                                <TableHeader field="title" label="Tytuł" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                <TableHeader field="stage" label="Etap" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} width="w-48" />
                                <TableHeader field="date" label="Data" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} width="w-32" />
                                <th className="px-3 py-2 text-left w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayBills.slice(0, visibleCount).map((process, idx) => (
                                <TableRow key={process.id} process={process} idx={idx} />
                            ))}
                        </tbody>
                    </table>
                )}

                {displayBills.length > visibleCount && (
                    <div className="text-center py-12">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 100)}
                            className="bg-apple-blue hover:bg-apple-blue/90 text-white px-8 py-3 rounded-button font-bold transition-all shadow-apple-lg hover:scale-[1.02] active:scale-95"
                        >
                            Załaduj więcej ({displayBills.length - visibleCount} pozostałych)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ======================= Subcomponents =======================

function MiniFilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
         <button
            onClick={onClick}
            className={`px-2.5 py-1 rounded-button text-xs font-semibold transition-all ${
                active ? 'bg-apple-blue text-white' : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-white/10'
            }`}
        >
            {label}
        </button>
    );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-button text-sm font-semibold transition-all whitespace-nowrap ${active
                ? 'bg-apple-blue text-white shadow-apple-lg'
                : 'bg-white/50 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 border border-apple-gray-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10'
                }`}
        >
            {label}
        </button>
    );
}

function StageBadge({ stage }: { stage: string }) {
    const getStageClass = (stageName: string) => {
        const n = stageName.toLowerCase();
        if (n.includes("inicjatywa")) return "stage-badge-inicijatywa";
        if (n.includes("sejm")) return "stage-badge-sejm bg-apple-blue/10 text-apple-blue";
        if (n.includes("senat")) return "stage-badge-senat bg-apple-purple/10 text-apple-purple";
        if (n.includes("prezydent")) return "stage-badge-prezydent bg-apple-orange/10 text-apple-orange";
        if (n.includes("publikacja") || n.includes("wejście")) return "stage-badge-publikacja bg-apple-green/10 text-apple-green";
        return "bg-apple-gray-200 text-apple-gray-700 dark:bg-white/10 dark:text-apple-gray-300"; 
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStageClass(stage)}`}>
            {stage}
        </span>
    );
}

function StagePill({ stage }: { stage: string }) {
    const getColor = (s: string) => {
        const normalized = s.toLowerCase();
        if (normalized.includes("sejm")) return "bg-apple-blue/15 text-apple-blue";
        if (normalized.includes("senat")) return "bg-apple-purple/15 text-apple-purple";
        if (normalized.includes("prezydent")) return "bg-apple-orange/15 text-apple-orange";
        if (normalized.includes("publikacja")) return "bg-apple-green/15 text-apple-green";
        return "bg-apple-gray-200 dark:bg-white/10 text-apple-gray-700 dark:text-apple-gray-300";
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getColor(stage)}`}>
            {stage.split(' - ')[0]}
        </span>
    );
}

function ProcessCard({ process }: { process: Bill }) {
    const lastStage = process.stages.length > 0 ? process.stages[process.stages.length - 1] : null;
    const displayStage = process.kanbanStage || lastStage?.stageName || "Nieznany";

    return (
        <Link href={`/ustawy/${process.id}`} className="block group">
            <div className="card-apple p-6 h-full flex flex-col hover:shadow-apple-lg transition-all">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-apple-blue/10 text-apple-blue border border-apple-blue/20">
                        #{process.id}
                    </span>
                    {process.isEU && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-apple-blue/10 text-apple-blue border border-apple-blue/20 flex items-center gap-1">
                            <Euro size={12} /> UE
                        </span>
                    )}
                    <span className="text-xs text-apple-gray-500 uppercase tracking-wider">{process.documentType}</span>
                </div>
                <h3 className="text-headline font-semibold text-foreground mb-3 group-hover:text-apple-blue transition-colors line-clamp-2">
                    {process.title}
                </h3>
                <div className="flex-1" />
                <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-apple-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-4 text-sm">
                        <StageBadge stage={displayStage} />
                        <div className="flex items-center gap-1.5 text-apple-gray-500">
                            <Clock size={14} />
                            <span className="text-xs">{process.date || "—"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function CompactBillCard({ process }: { process: Bill }) {
    const stage = process.kanbanStage || "Nieznany";
    return (
        <Link href={`/ustawy/${process.id}`} className="block group">
            <div className="bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-apple-gray-200 dark:border-white/10 rounded-card p-3 transition-all hover:shadow-apple">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-apple-blue">#{process.id}</span>
                    <StagePill stage={stage} />
                </div>
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-apple-blue transition-colors leading-tight">
                    {process.title}
                </h3>
                <div className="text-xs text-apple-gray-500">{process.date || "Brak daty"}</div>
            </div>
        </Link>
    );
}

function TableHeader({ field, label, sortField, sortDirection, onSort, width }: { field: SortField, label: string, sortField: SortField, sortDirection: SortDirection, onSort: (field: SortField) => void, width?: string }) {
    const isActive = sortField === field;
    return (
        <th className={`px-3 py-2 text-left ${width || ""}`}>
            <button onClick={() => onSort(field)} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue transition-colors group">
                {label}
                <ArrowUpDown size={12} className={`transition-all ${isActive ? 'text-apple-blue' : 'opacity-0 group-hover:opacity-50'}`} />
            </button>
        </th>
    );
}

function TableRow({ process, idx }: { process: Bill; idx: number }) {
    const stage = process.kanbanStage || "Nieznany";
    return (
        <tr className={`border-b border-apple-gray-100 dark:border-white/5 hover:bg-apple-gray-50 dark:hover:bg-white/5 transition-colors group ${idx % 2 === 0 ? 'bg-white/50 dark:bg-transparent' : ''}`}>
            <td className="px-3 py-2.5">
                <span className="font-mono text-xs font-semibold text-apple-blue">#{process.id}</span>
            </td>
            <td className="px-3 py-2.5">
                <Link href={`/ustawy/${process.id}`} className="text-foreground hover:text-apple-blue transition-colors font-medium line-clamp-1">{process.title}</Link>
            </td>
            <td className="px-3 py-2.5">
                <StageBadge stage={stage} />
            </td>
            <td className="px-3 py-2.5 text-apple-gray-600 dark:text-apple-gray-400 text-xs">
                {process.date || "—"}
            </td>
            <td className="px-3 py-2.5">
                <Link href={`/ustawy/${process.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-apple-blue hover:text-apple-blue/80">
                    <ExternalLink size={14} />
                </Link>
            </td>
        </tr>
    );
}
