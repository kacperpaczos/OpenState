"use client";

import { Bill } from "@/lib/bills";
import { FileText, ArrowRight, Activity, Clock, Euro, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

export default function BillsList({ initialProcesses }: { initialProcesses: Bill[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [headerHidden, setHeaderHidden] = useState(false);

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
        <div className="max-w-7xl mx-auto fade-in px-4">
            {/* Header - auto-hides on scroll */}
            <header
                className="mb-8 mt-6 transition-all duration-300"
                style={{
                    transform: headerHidden ? 'translateY(-150px)' : 'translateY(0)',
                    opacity: headerHidden ? 0 : 1
                }}
            >
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-title-large text-foreground">Śledzenie Ustaw</h1>

                    {/* View Switcher */}
                    <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-blue text-white">
                            Cards
                        </span>
                        <Link href="/ustawy/compact" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Compact
                        </Link>
                        <Link href="/ustawy/table" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Table
                        </Link>
                    </div>
                </div>
                <p className="text-body-secondary">Projekty legislacyjne X kadencji Sejmu RP</p>
            </header>

            {/* Filters & Search */}
            <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Szukaj po tytule lub numerze druku..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-input bg-white/70 dark:bg-white/5 border border-apple-gray-200 dark:border-white/15 text-foreground placeholder:text-apple-gray-500 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue transition-all backdrop-blur-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <FilterButton
                        active={statusFilter === "all"}
                        onClick={() => setStatusFilter("all")}
                        label="Wszystkie"
                    />
                    <FilterButton
                        active={statusFilter === "Projekt ustawy"}
                        onClick={() => setStatusFilter("Projekt ustawy")}
                        label="Projekty Ustaw"
                    />
                    <FilterButton
                        active={statusFilter === "Projekt uchwały"}
                        onClick={() => setStatusFilter("Projekt uchwały")}
                        label="Uchwały"
                    />
                    <FilterButton
                        active={statusFilter === "UE"}
                        onClick={() => setStatusFilter("UE")}
                        label="Tylko UE"
                    />
                </div>
            </div>

            {/* Bills Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20">
                {filteredBills.map((process) => (
                    <ProcessCard key={process.id} process={process} />
                ))}
                {filteredBills.length === 0 && (
                    <div className="col-span-full text-center py-16">
                        <FileText className="mx-auto mb-3 text-apple-gray-400" size={48} />
                        <p className="text-body-secondary">Nie znaleziono procesów legislacyjnych.</p>
                    </div>
                )}
            </div>
        </div>
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

function ProcessCard({ process }: { process: Bill }) {
    const lastStage = process.stages.length > 0 ? process.stages[process.stages.length - 1] : null;
    const displayStage = process.kanbanStage || lastStage?.stageName || "Nieznany";

    return (
        <Link href={`/ustawy/${process.id}`} className="block group">
            <div className="card-apple p-6 h-full flex flex-col">
                {/* Metadata Row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-apple-blue/10 text-apple-blue border border-apple-blue/20">
                        Druk {process.id}
                    </span>
                    {process.isEU && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-apple-blue/10 text-apple-blue border border-apple-blue/20 flex items-center gap-1">
                            <Euro size={12} /> UE
                        </span>
                    )}
                    <span className="text-xs text-apple-gray-500 uppercase tracking-wider">
                        {process.documentType}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-headline font-semibold text-foreground mb-3 group-hover:text-apple-blue transition-colors line-clamp-2">
                    {process.title}
                </h3>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-apple-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-4 text-sm">
                        <StageBadge stage={displayStage} />
                        <div className="flex items-center gap-1.5 text-apple-gray-500">
                            <Clock size={14} />
                            <span className="text-xs">{process.date || "Brak daty"}</span>
                        </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-apple-blue/10 group-hover:bg-apple-blue flex items-center justify-center transition-all">
                        <ArrowRight size={16} className="text-apple-blue group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

function StageBadge({ stage }: { stage: string }) {
    const getStageClass = (stageName: string): string => {
        const normalized = stageName.toLowerCase();

        if (normalized.includes("inicjatywa")) return "stage-badge-inicijatywa";
        if (normalized.includes("sejm")) return "stage-badge-sejm";
        if (normalized.includes("senat")) return "stage-badge-senat";
        if (normalized.includes("prezydent")) return "stage-badge-prezydent";
        if (normalized.includes("publikacja") || normalized.includes("wejście")) return "stage-badge-publikacja";

        return "stage-badge-inicijatywa"; // default
    };

    return (
        <span className={`stage-badge ${getStageClass(stage)}`}>
            {stage}
        </span>
    );
}
