"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User, Filter, SortAsc } from "lucide-react";
import Link from "next/link";
import { MP } from "@/lib/mps";
import { useAppSelector } from "@/lib/hooks";
import { selectGlobalSearch } from "@/lib/features/search/searchSlice";

export default function MPsList({ initialMPs }: { initialMPs: MP[] }) {
    const [mps] = useState<MP[]>(initialMPs);
    const globalSearch = useAppSelector(selectGlobalSearch);
    const [headerHidden, setHeaderHidden] = useState(false);

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

    const [activeOnly, setActiveOnly] = useState(false);
    const [sortActive, setSortActive] = useState(true); // aktywni pierwsi domyslnie
    const [selectedClub, setSelectedClub] = useState("");

    const clubs = useMemo(() => {
        return Array.from(new Set(mps.map(mp => mp.club))).filter(Boolean).sort();
    }, [mps]);

    const filteredMps = useMemo(() => {
        let result = mps;
        // text filter
        if (globalSearch) {
            const lower = globalSearch.toLowerCase();
            result = result.filter(mp =>
                mp.name.toLowerCase().includes(lower) ||
                mp.club.toLowerCase().includes(lower) ||
                mp.district.toLowerCase().includes(lower)
            );
        }
        // club filter
        if (selectedClub) result = result.filter(mp => mp.club === selectedClub);
        // active-only filter
        if (activeOnly) result = result.filter(mp => mp.active !== false);
        // sort
        if (sortActive) result = [...result].sort((a, b) => (b.active !== false ? 1 : 0) - (a.active !== false ? 1 : 0));
        return result;
    }, [mps, globalSearch, activeOnly, sortActive, selectedClub]);

    const [visibleCount, setVisibleCount] = useState(100);

    // Reset pagination when any filter changes
    useEffect(() => {
        setVisibleCount(100);
    }, [globalSearch, selectedClub, activeOnly, sortActive]);

    return (
        <div className="max-w-7xl mx-auto pb-20 fade-in">
            <header
                className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
                style={{
                    transform: headerHidden ? 'translateY(-150px)' : 'translateY(0)',
                    opacity: headerHidden ? 0 : 1
                }}
            >
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Posłowie</h1>
                    <p className="text-gray-400">Posłowie X kadencji Sejmu · {mps.length} osób</p>
                </div>
                {/* Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={selectedClub}
                        onChange={(e) => setSelectedClub(e.target.value)}
                        className="bg-surface-color text-text-secondary border-surface-border text-xs font-semibold rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent-blue border cursor-pointer hover:border-accent-blue/30 transition-colors"
                    >
                        <option value="">Wszystkie kluby</option>
                        {clubs.map(club => (
                            <option key={club} value={club}>{club}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setActiveOnly(v => !v)}
                        data-testid="active-only-toggle"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeOnly
                            ? 'bg-green-500/15 text-green-500 border-green-500/30'
                            : 'bg-surface-color text-text-secondary border-surface-border hover:border-green-500/30'
                            }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${activeOnly ? 'bg-green-500' : 'bg-gray-400'}`} />
                        Tylko aktywni
                    </button>
                    <button
                        onClick={() => setSortActive(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${sortActive
                            ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/30'
                            : 'bg-surface-color text-text-secondary border-surface-border hover:border-accent-blue/30'
                            }`}
                    >
                        <SortAsc size={12} />
                        {sortActive ? 'Aktywni pierwsi' : 'Alfabetycznie'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                {filteredMps.slice(0, visibleCount).map((mp) => (
                    <MPCard key={`${mp.chamber}-${mp.id}`} mp={mp} />
                ))}
            </div>
            {filteredMps.length > visibleCount && (
                <div className="text-center py-8">
                    <button
                        onClick={() => setVisibleCount(prev => prev + 100)}
                        className="px-6 py-3 bg-accent-blue text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        Pokaż więcej ({filteredMps.length - visibleCount} pozostałych)
                    </button>
                </div>
            )}
            {filteredMps.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Nie znaleziono parlamentarzystów.
                </div>
            )}
        </div>
    );
}

function MPCard({ mp }: { mp: MP }) {
    const href = mp.chamber === 'Senat' ? `/senatorowie/${mp.id}` : `/poslowie/${mp.id}`;

    return (
        <Link href={href} className="block">
            <div className="glass-card p-4 flex items-center gap-4 hover:bg-surface-hover transition-colors cursor-pointer group h-full">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center border border-surface-border group-hover:border-accent-blue/50 transition-colors relative shrink-0">
                    {mp.photoUrl ? (
                        <img src={mp.photoUrl} alt={mp.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <User size={24} className="text-gray-400 group-hover:text-blue-400" />
                    )}
                </div>
                <div className="overflow-hidden min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-semibold text-foreground text-sm truncate">{mp.name}</h3>
                        {mp.active !== false && (
                            <span className="shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">Aktywny</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${mp.active !== false ? 'bg-green-500' : 'bg-red-400'}`} />
                            <span className="text-xs text-text-secondary truncate" title={mp.club}>{mp.club}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
                            {mp.district}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
