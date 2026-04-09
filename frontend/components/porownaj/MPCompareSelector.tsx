"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MP } from "@/lib/mps";
import { Search, X, User, ArrowRightLeft, ChevronDown, Check } from "lucide-react";
import { useCompare } from "@/lib/contexts/CompareContext";
import { PARTY_COLORS } from "@/lib/constants";

interface MPCompareSelectorProps {
    mps: MP[];
    prefilledA?: string | null;
    prefilledB?: string | null;
}

function getSafePhotoUrl(mp: MP) {
    if (!mp.photoUrl) return null;
    if (mp.chamber === 'Senat') {
        return `/api/image-proxy?url=${encodeURIComponent(mp.photoUrl)}`;
    }
    return mp.photoUrl;
}

function MPOption({ mp, onClick, isSelected }: { mp: MP, onClick: (mp: MP) => void, isSelected?: boolean }) {
    const partyColor = PARTY_COLORS[mp.club] || PARTY_COLORS[Object.keys(PARTY_COLORS).find(k => mp.club.includes(k)) || ""] || "#86868b";

    return (
        <button
            onClick={() => onClick(mp)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-surface-hover text-left transition-colors border-l-4 ${isSelected ? "bg-blue-500/10 border-blue-500" : "border-transparent"}`}
            style={{ borderLeftColor: partyColor }}
        >
            <div className="w-10 h-10 rounded-full bg-surface-color border border-surface-border overflow-hidden shrink-0 flex items-center justify-center">
                {mp.photoUrl ? (
                    <img src={getSafePhotoUrl(mp)!} alt={mp.name} className="w-full h-full object-cover" />
                ) : (
                    <User size={16} className="text-gray-500" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground text-sm truncate">{mp.name}</div>
                <div className="text-[10px] text-text-secondary flex items-center gap-1">
                    <span className="font-bold px-1 rounded bg-black/5 dark:bg-white/5">{mp.chamber}</span>
                    <span className="truncate">{mp.club}</span>
                </div>
            </div>
            {isSelected && <Check size={16} className="text-blue-500 shrink-0" />}
        </button>
    );
}

export default function MPCompareSelector({ mps, prefilledA, prefilledB }: MPCompareSelectorProps) {
    const router = useRouter();
    const { mpA, mpB, setMPA, setMPB, clearCompare } = useCompare();

    // Filters state
    const [chamberFilter, setChamberFilter] = useState<'All' | 'Sejm' | 'Senat'>('All');
    const [clubFilter, setClubFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState("");

    const clubs = useMemo(() => {
        const set = new Set(mps.map(m => m.club));
        return Array.from(set).sort();
    }, [mps]);

    // Sort MPs alphabetically
    const sortedMps = useMemo(() => {
        return [...mps].sort((a, b) => a.firstLastName.localeCompare(b.firstLastName));
    }, [mps]);

    const filteredMps = useMemo(() => {
        return sortedMps.filter(mp => {
            const matchesChamber = chamberFilter === 'All' || mp.chamber === chamberFilter;
            const matchesClub = clubFilter === 'All' || mp.club === clubFilter;
            const matchesSearch = !searchQuery || 
                mp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                mp.club.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesChamber && matchesClub && matchesSearch;
        });
    }, [sortedMps, chamberFilter, clubFilter, searchQuery]);

    const findMp = (id?: string | null) => sortedMps.find(m => m.id === id) || null;

    useEffect(() => {
        if (prefilledA && !mpA) setMPA(findMp(prefilledA));
        if (prefilledB && !mpB) setMPB(findMp(prefilledB));
    }, [prefilledA, prefilledB, mps]);

    const canCompare = mpA && mpB;

    return (
        <div className="w-full max-w-6xl mx-auto p-4 pb-32 fade-in">
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                    Waga <span className="text-blue-500">Głosowań</span>
                </h1>
                <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                    Porównaj głosowania posłów i senatorów. Wybierz dwóch parlamentarzystów, aby zobaczyć ich zgodność i kluczowe różnice.
                </p>
            </div>

            {/* QUICK FILTERS */}
            <div className="glass-card mb-8 p-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                    {(['All', 'Sejm', 'Senat'] as const).map(c => (
                        <button
                            key={c}
                            onClick={() => setChamberFilter(c)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${chamberFilter === c ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-500' : 'text-text-secondary hover:text-foreground'}`}
                        >
                            {c === 'All' ? 'Wszyscy' : c}
                        </button>
                    ))}
                </div>

                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Szukaj po nazwisku lub klubie..."
                        className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 ring-blue-500/50 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="relative group">
                    <select 
                        className="appearance-none bg-black/5 dark:bg-white/5 rounded-xl py-3 pl-4 pr-10 font-bold text-sm outline-none focus:ring-2 ring-blue-500/50 cursor-pointer"
                        value={clubFilter}
                        onChange={(e) => setClubFilter(e.target.value)}
                    >
                        <option value="All">Wszystkie kluby</option>
                        {clubs.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={16} />
                </div>
            </div>

            {/* GRID OF MEMBERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar p-1">
                {filteredMps.slice(0, 48).map(mp => (
                    <div key={mp.id} className="glass-card !p-0 overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                        <MPOption 
                            mp={mp} 
                            isSelected={mpA?.id === mp.id || mpB?.id === mp.id}
                            onClick={(m) => {
                                if (mpA?.id === m.id) setMPA(null);
                                else if (mpB?.id === m.id) setMPB(null);
                                else if (!mpA) setMPA(m);
                                else if (!mpB) setMPB(m);
                                else {
                                    setMPB(m);
                                }
                            }} 
                        />
                    </div>
                ))}
                {filteredMps.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 font-medium">
                        Nie znaleziono parlamentarzysty o podanych kryteriach.
                    </div>
                )}
            </div>

            {/* FLOATING COMPARISON TRAY */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${mpA || mpB ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="glass-card-heavy flex items-center gap-4 p-3 md:p-4 shadow-2xl border-2 border-blue-500/20">
                    
                    <div className="flex items-center gap-2">
                        {/* Member A */}
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 transition-all ${mpA ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-dashed border-gray-400/30'}`}>
                            {mpA ? (
                                <div className="relative w-full h-full group">
                                    <img src={getSafePhotoUrl(mpA)!} className="w-full h-full object-cover" alt="" />
                                    <button onClick={() => setMPA(null)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100/10">1</div>
                            )}
                        </div>

                        <ArrowRightLeft className="text-gray-400 mx-1 md:mx-2 shrink-0" size={20} />

                        {/* Member B */}
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 transition-all ${mpB ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-dashed border-gray-400/30'}`}>
                            {mpB ? (
                                <div className="relative w-full h-full group">
                                    <img src={getSafePhotoUrl(mpB)!} className="w-full h-full object-cover" alt="" />
                                    <button onClick={() => setMPB(null)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100/10">2</div>
                            )}
                        </div>
                    </div>

                    <div className="h-10 w-px bg-surface-border mx-2 hidden md:block" />

                    <div className="flex flex-col gap-1 pr-2">
                        {canCompare ? (
                            <button 
                                onClick={() => router.push(`/porownaj?a=${mpA.id}&b=${mpB.id}`)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95 whitespace-nowrap"
                            >
                                Porównaj <ArrowRightLeft size={16} />
                            </button>
                        ) : (
                            <div className="hidden md:block text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse px-4">
                                Wybierz {mpA ? 'drugą osobę' : 'pierwszą osobę'}
                            </div>
                        )}
                        {(mpA || mpB) && (
                            <button onClick={clearCompare} className="text-[10px] text-gray-500 hover:text-red-500 transition-colors underline decoration-dotted text-center md:text-left">
                                Wyczyść
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
