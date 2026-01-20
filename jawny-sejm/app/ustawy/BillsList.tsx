"use client";

import { LegislativeProcess } from "@/lib/processes";
import { FileText, ArrowRight, Activity, Clock, Euro } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function BillsList({ initialProcesses }: { initialProcesses: LegislativeProcess[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Filtering Logic
    const filteredBills = useMemo(() => {
        return initialProcesses.filter(process => {
            const matchesSearch = process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (process.id && process.id.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!matchesSearch) return false;

            if (statusFilter === "all") return true;
            if (statusFilter === "UE") return process.isEU;

            // Loose matching for document type
            return process.documentType && process.documentType.includes(statusFilter);
        });
    }, [initialProcesses, searchTerm]);

    return (
        <div className="max-w-7xl mx-auto pb-20 fade-in h-screen flex flex-col">
            <header className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Śledź Ustawę</h1>
                    <p className="text-gray-400">Projekty legislacyjne X kadencji</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                    <div className="flex bg-surface-color border border-surface-border rounded-xl p-1 shrink-0 overflow-x-auto max-w-full">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${statusFilter === 'all' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-500 hover:text-foreground'}`}
                        >
                            Wszystkie
                        </button>
                        <button
                            onClick={() => setStatusFilter("Projekt ustawy")}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${statusFilter === 'Projekt ustawy' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-500 hover:text-foreground'}`}
                        >
                            Projekty Ustaw
                        </button>
                        <button
                            onClick={() => setStatusFilter("Projekt uchwały")}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${statusFilter === 'Projekt uchwały' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-500 hover:text-foreground'}`}
                        >
                            Uchwały
                        </button>
                        <button
                            onClick={() => setStatusFilter("UE")}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${statusFilter === 'UE' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-500 hover:text-foreground'}`}
                        >
                            Tylko UE
                        </button>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Szukaj po tytule lub numerze druku..."
                            className="pl-4 pr-4 py-2 rounded-xl bg-surface-color/50 border border-surface-border text-foreground focus:ring-2 focus:ring-accent-blue/50 w-full md:w-80 backdrop-blur-md transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                    {filteredBills.map((process) => (
                        <ProcessCard key={process.id} process={process} />
                    ))}
                    {filteredBills.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Nie znaleziono procesów legislacyjnych.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProcessCard({ process }: { process: LegislativeProcess }) {
    const lastStage = process.stages.length > 0 ? process.stages[process.stages.length - 1] : null;

    return (
        <Link href={`/ustawy/${process.id}`} className="block">
            <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer group border border-surface-border/50">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">
                                Druk {process.id}
                            </span>
                            {process.isEU && (
                                <span className="text-xs font-bold text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20" title="Projekt UE">
                                    <Euro size={12} /> UE
                                </span>
                            )}
                            <span className="text-xs text-text-secondary uppercase tracking-wider">
                                {process.documentType}
                            </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-lg leading-tight mb-3 group-hover:text-accent-blue transition-colors">
                            {process.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                            {lastStage && (
                                <div className="flex items-center gap-1.5">
                                    <Activity size={14} className="text-green-500" />
                                    <span>Etap: <span className="text-foreground">{lastStage.stageName}</span></span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} className="text-gray-500" />
                                <span>{process.date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-surface-color border border-surface-border group-hover:bg-accent-blue group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
