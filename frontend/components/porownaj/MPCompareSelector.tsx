"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MP } from "@/lib/mps";
import { Search, X, User, ArrowRightLeft } from "lucide-react";

interface MPCompareSelectorProps {
    mps: MP[];
    prefilledA?: string | null;
    prefilledB?: string | null;
}

function MPOption({ mp, onClick }: { mp: MP, onClick: (mp: MP) => void }) {
    return (
        <button
            onClick={() => onClick(mp)}
            className="w-full flex items-center gap-3 p-3 hover:bg-surface-hover text-left transition-colors"
        >
            <div className="w-10 h-10 rounded-full bg-surface-color border border-surface-border overflow-hidden shrink-0 flex items-center justify-center">
                {mp.photoUrl ? (
                    <img src={mp.photoUrl} alt={mp.name} className="w-full h-full object-cover" />
                ) : (
                    <User size={16} className="text-gray-500" />
                )}
            </div>
            <div>
                <div className="font-semibold text-foreground text-sm">{mp.name}</div>
                <div className="text-xs text-text-secondary">{mp.club}</div>
            </div>
        </button>
    );
}

export default function MPCompareSelector({ mps, prefilledA, prefilledB }: MPCompareSelectorProps) {
    const router = useRouter();
    
    // Sort MPs alphabetically for better default display
    const sortedMps = useMemo(() => {
        return [...mps].sort((a, b) => a.firstLastName.localeCompare(b.firstLastName));
    }, [mps]);

    const findMp = (id?: string | null) => sortedMps.find(m => m.id === id) || null;

    const [selA, setSelA] = useState<MP | null>(findMp(prefilledA));
    const [selB, setSelB] = useState<MP | null>(findMp(prefilledB));

    const [searchA, setSearchA] = useState("");
    const [searchB, setSearchB] = useState("");

    const [openA, setOpenA] = useState(false);
    const [openB, setOpenB] = useState(false);

    const refA = useRef<HTMLDivElement>(null);
    const refB = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (refA.current && !refA.current.contains(e.target as Node)) setOpenA(false);
            if (refB.current && !refB.current.contains(e.target as Node)) setOpenB(false);
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // Navigate when both are selected — called directly in select handlers
    const navigate = useCallback((a: MP, b: MP) => {
        router.push(`/porownaj?a=${a.id}&b=${b.id}`);
    }, [router]);

    const handleSelectA = useCallback((m: MP) => {
        setSelA(m);
        setOpenA(false);
        setSearchA("");
        // If B is already selected, navigate immediately
        if (selB) navigate(m, selB);
    }, [selB, navigate]);

    const handleSelectB = useCallback((m: MP) => {
        setSelB(m);
        setOpenB(false);
        setSearchB("");
        // If A is already selected, navigate immediately
        if (selA) navigate(selA, m);
    }, [selA, navigate]);

    const filterMps = (query: string) => {
        if (!query) return sortedMps.slice(0, 10);
        const q = query.toLowerCase();
        return sortedMps
            .filter(mp => mp.name.toLowerCase().includes(q) || mp.club.toLowerCase().includes(q))
            .slice(0, 10);
    };

    const resultsA = filterMps(searchA);
    const resultsB = filterMps(searchB);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 fade-in">
            <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-4 tracking-tight">Waga <span className="text-blue-500">Głosowań</span></h1>
            <p className="text-center text-text-secondary mb-12 max-w-lg mx-auto">
                Sprawdź, jak bardzo posłowie są zgodni. Wybierz dwóch polityków, aby zobaczyć ich wspólne historię głosowań i różnice w decyzjach.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-6 relative">
                
                {/* SELECTOR A */}
                <div className="flex-1 w-full relative z-20" ref={refA}>
                    <label className="block text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider text-center md:text-left">Poseł A</label>
                    
                    {!selA ? (
                        <div className="relative glass-card overflow-visible">
                            <div className="flex items-center px-4 py-3 border-b border-surface-border bg-surface-color hover:bg-surface-hover transition-colors rounded-t-[15px] rounded-b-[15px] focus-within:ring-2 ring-blue-500/50">
                                <Search className="text-gray-400 mr-3 shrink-0" size={18} />
                                <input
                                    type="text"
                                    placeholder="Wyszukaj posła..."
                                    className="w-full bg-transparent border-none focus:outline-none text-foreground font-medium placeholder:text-gray-500"
                                    value={searchA}
                                    onChange={(e) => { setSearchA(e.target.value); setOpenA(true); }}
                                    onFocus={() => setOpenA(true)}
                                />
                            </div>
                            
                            {openA && (
                                <div className="absolute top-full left-0 w-full mt-2 glass-card shadow-apple-2xl max-h-64 overflow-y-auto custom-scrollbar border border-surface-border animate-slide-up-fade z-50">
                                    {resultsA.length > 0 ? (
                                        <div className="py-2">
                                            {resultsA.map(mp => (
                                                <MPOption key={mp.id} mp={mp} onClick={handleSelectA} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">Nie znaleziono posła</div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card p-4 flex items-center justify-between border-2 border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-surface-color border border-surface-border overflow-hidden shrink-0">
                                    {selA.photoUrl ? (
                                        <img src={selA.photoUrl} alt={selA.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} className="text-gray-500 m-4" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-foreground text-lg">{selA.name}</div>
                                    <div className="text-sm text-text-secondary">{selA.club}</div>
                                </div>
                            </div>
                            <button onClick={() => setSelA(null)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-surface-hover rounded-full" aria-label="Usuń">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* VS ICON */}
                <div className="shrink-0 flex items-center justify-center p-4 bg-surface-color/50 rounded-full border border-surface-border text-text-secondary">
                    <ArrowRightLeft size={24} />
                </div>

                {/* SELECTOR B */}
                <div className="flex-1 w-full relative z-10" ref={refB}>
                    <label className="block text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider text-center md:text-left">Poseł B</label>
                    
                    {!selB ? (
                        <div className="relative glass-card overflow-visible">
                            <div className="flex items-center px-4 py-3 border-b border-surface-border bg-surface-color hover:bg-surface-hover transition-colors rounded-t-[15px] rounded-b-[15px] focus-within:ring-2 ring-blue-500/50">
                                <Search className="text-gray-400 mr-3 shrink-0" size={18} />
                                <input
                                    type="text"
                                    placeholder="Wyszukaj posła..."
                                    className="w-full bg-transparent border-none focus:outline-none text-foreground font-medium placeholder:text-gray-500"
                                    value={searchB}
                                    onChange={(e) => { setSearchB(e.target.value); setOpenB(true); }}
                                    onFocus={() => setOpenB(true)}
                                />
                            </div>
                            
                            {openB && (
                                <div className="absolute top-full left-0 w-full mt-2 glass-card shadow-apple-2xl max-h-64 overflow-y-auto custom-scrollbar border border-surface-border animate-slide-up-fade z-50">
                                    {resultsB.length > 0 ? (
                                        <div className="py-2">
                                            {resultsB.map(mp => (
                                                <MPOption key={mp.id} mp={mp} onClick={handleSelectB} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">Nie znaleziono posła</div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card p-4 flex items-center justify-between border-2 border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-surface-color border border-surface-border overflow-hidden shrink-0">
                                    {selB.photoUrl ? (
                                        <img src={selB.photoUrl} alt={selB.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} className="text-gray-500 m-4" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-foreground text-lg">{selB.name}</div>
                                    <div className="text-sm text-text-secondary">{selB.club}</div>
                                </div>
                            </div>
                            <button onClick={() => setSelB(null)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-surface-hover rounded-full" aria-label="Usuń">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {(!selA || !selB) && (
                <div className="mt-12 text-center text-sm text-gray-500 animate-pulse">
                    Wybierz dwóch posłów, aby ropocząć porównywanie.
                </div>
            )}
        </div>
    );
}
