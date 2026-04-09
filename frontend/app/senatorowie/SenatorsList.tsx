"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User, Filter, SortAsc, ArrowRightLeft as CompareIcon } from "lucide-react";
import Link from "next/link";
import { MP } from "@/lib/mps";
import { useSearchParams } from "next/navigation";
import { useCompare } from "@/lib/contexts/CompareContext";
import ComparisonDock from "@/components/compare/ComparisonDock";

export default function SenatorsList({ initialSenators }: { initialSenators: MP[] }) {
    const [senators] = useState<MP[]>(initialSenators);
    
    const searchParams = useSearchParams();
    const globalSearch = searchParams.get("search") || "";

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
    const [sortActive, setSortActive] = useState(true); 
    const [selectedClub, setSelectedClub] = useState("");

    const clubs = useMemo(() => {
        return Array.from(new Set(senators.map(s => s.club))).filter(Boolean).sort();
    }, [senators]);

    const filteredSenators = useMemo(() => {
        let result = senators;
        // text filter
        if (globalSearch) {
            const lower = globalSearch.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(lower) ||
                s.club.toLowerCase().includes(lower) ||
                s.district.toLowerCase().includes(lower)
            );
        }
        // club filter
        if (selectedClub) result = result.filter(s => s.club === selectedClub);
        // active-only filter
        if (activeOnly) result = result.filter(s => s.active !== false);
        // sort
        if (sortActive) result = [...result].sort((a, b) => (b.active !== false ? 1 : 0) - (a.active !== false ? 1 : 0));
        return result;
    }, [senators, globalSearch, activeOnly, sortActive, selectedClub]);

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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Senatorowie</h1>
                    <p className="text-text-secondary font-medium">Senatorowie XI kadencji Senatu · {senators.length} osób</p>
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
                {filteredSenators.slice(0, visibleCount).map((s) => (
                    <SenatorCard key={`${s.chamber}-${s.id}`} senator={s} />
                ))}
            </div>
            {filteredSenators.length > visibleCount && (
                <div className="text-center py-8">
                    <button
                        onClick={() => setVisibleCount(prev => prev + 100)}
                        className="px-6 py-3 bg-accent-blue dark:text-white text-[#1d1d1f] rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        Pokaż więcej ({filteredSenators.length - visibleCount} pozostałych)
                    </button>
                </div>
            )}
            {filteredSenators.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Nie znaleziono senatorów.
                </div>
            )}

            <ComparisonDock />
        </div>
    );
}

function SenatorCard({ senator }: { senator: MP }) {
    const { addToCompare, mpA, mpB } = useCompare();
    const isSelected = mpA?.id === senator.id || mpB?.id === senator.id;
    const href = `/senatorowie/${senator.id}`;

    const handleCompareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCompare(senator);
    };

    return (
        <Link href={href} className="block relative group">
            <div className={`glass-card p-4 flex items-center gap-4 hover:bg-surface-hover transition-all cursor-pointer h-full border-2 ${isSelected ? 'border-blue-500 shadow-blue-500/10' : 'border-transparent'}`}>
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center border border-surface-border group-hover:border-accent-blue/50 transition-colors relative shrink-0">
                    {senator.photoUrl ? (
                        <img src={senator.photoUrl} alt={senator.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <User size={24} className="text-text-secondary group-hover:text-blue-400" />
                    )}
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-semibold text-foreground text-sm truncate">{senator.name}</h3>
                        {senator.active !== false && (
                            <span className="shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">Aktywny</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${senator.active !== false ? 'bg-green-500' : 'bg-red-400'}`} />
                            <span className="text-xs text-text-secondary truncate" title={senator.club}>
                                {senator.club ? senator.club.replace('Klub Parlamentarny', 'KP') : "Niezrzeszony"}
                            </span>
                        </div>
                        <span className="text-[10px] text-text-secondary dark:text-gray-500 font-bold uppercase tracking-wider truncate">
                            {senator.district}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleCompareClick}
                    title="Dodaj do porównania"
                    className={`p-2 rounded-full transition-all shrink-0 ${isSelected 
                        ? 'bg-blue-500 dark:text-white text-[#1d1d1f] shadow-lg' 
                        : 'bg-surface-color text-text-secondary border border-surface-border hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30'
                    }`}
                >
                    <CompareIcon size={16} />
                </button>
            </div>
        </Link>
    )
}
