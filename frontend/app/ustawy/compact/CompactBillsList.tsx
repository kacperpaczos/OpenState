"use client";

import { Bill } from "@/lib/bills";
import { Search, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

export default function CompactBillsList({ initialProcesses }: { initialProcesses: Bill[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [headerCompact, setHeaderCompact] = useState(false);

    // Auto-hiding header on scroll
    useEffect(() => {
        let lastScroll = 0;
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 80 && currentScroll > lastScroll) {
                setHeaderCompact(true);
            } else if (currentScroll < lastScroll) {
                setHeaderCompact(false);
            }
            lastScroll = currentScroll;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredBills = useMemo(() => {
        return initialProcesses.filter(process => {
            const matchesSearch = process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (process.id && process.id.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!matchesSearch) return false;
            if (statusFilter === "all") return true;
            if (statusFilter === "UE") return process.isEU;
            return process.documentType && process.documentType.includes(statusFilter);
        });
    }, [initialProcesses, searchTerm, statusFilter]);

    return (
        <div className="max-w-[1400px] mx-auto pb-20 fade-in h-screen flex flex-col px-4">
            {/* Auto-hiding Compact Header */}
            <header
                className={`sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-apple-gray-200 dark:border-white/10 transition-all duration-300 -mx-4 px-4 ${headerCompact ? 'py-2' : 'py-4'
                    }`}
            >
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Title (hides when compact) */}
                    <div className={`transition-all duration-300 ${headerCompact ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'}`}>
                        <h1 className="text-2xl font-bold text-foreground whitespace-nowrap">Projekty Legislacyjne</h1>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Szukaj..."
                                className={`w-full pl-10 pr-4 bg-apple-gray-50 dark:bg-white/5 border border-apple-gray-200 dark:border-white/10 text-foreground placeholder:text-apple-gray-500 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 transition-all rounded-button ${headerCompact ? 'py-1.5 text-sm' : 'py-2.5'
                                    }`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right: Filters & View Switcher */}
                    <div className="flex items-center gap-2">
                        <FilterChips
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            compact={headerCompact}
                        />
                        <Link
                            href="/ustawy"
                            className="px-3 py-1.5 text-xs text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue transition-colors"
                        >
                            ← Cards
                        </Link>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="py-3 text-sm text-apple-gray-600 dark:text-apple-gray-400 border-b border-apple-gray-100 dark:border-white/5">
                <span className="font-semibold text-foreground">{filteredBills.length}</span> projektów
            </div>

            {/* Bills Grid - 3 columns */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredBills.map((process) => (
                        <CompactBillCard key={process.id} process={process} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function FilterChips({ statusFilter, setStatusFilter, compact }: { statusFilter: string; setStatusFilter: (v: string) => void; compact: boolean }) {
    const filters = [
        { id: "all", label: "All" },
        { id: "Projekt ustawy", label: "Ustawy" },
        { id: "UE", label: "UE" }
    ];

    if (compact) {
        return (
            <div className="relative group">
                <button className="p-1.5 rounded-button hover:bg-apple-gray-100 dark:hover:bg-white/10">
                    <Filter size={16} className="text-apple-gray-600" />
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white dark:bg-apple-gray-800 rounded-card shadow-apple-lg border border-apple-gray-200 dark:border-white/10 py-1 min-w-32">
                    {filters.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setStatusFilter(f.id)}
                            className={`block w-full text-left px-3 py-1.5 text-xs ${statusFilter === f.id ? 'text-apple-blue font-semibold' : 'text-foreground hover:bg-apple-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-1">
            {filters.map(f => (
                <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-2.5 py-1 rounded-button text-xs font-semibold transition-all ${statusFilter === f.id
                        ? 'bg-apple-blue text-white'
                        : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-white/10'
                        }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
}

function CompactBillCard({ process }: { process: Bill }) {
    const stage = process.kanbanStage || "Nieznany";

    return (
        <Link href={`/ustawy/${process.id}`} className="block group">
            <div className="bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-apple-gray-200 dark:border-white/10 rounded-card p-3 transition-all hover:shadow-apple">
                {/* Top Row: ID + Stage */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-apple-blue">#{process.id}</span>
                    <StagePill stage={stage} />
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-apple-blue transition-colors leading-tight">
                    {process.title}
                </h3>

                {/* Footer: Date */}
                <div className="text-xs text-apple-gray-500">
                    {process.date || "Brak daty"}
                </div>
            </div>
        </Link>
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
