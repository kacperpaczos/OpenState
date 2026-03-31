"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User } from "lucide-react";
import Link from "next/link";
import { MP } from "@/lib/mps";
import { useAppSelector } from "@/lib/hooks";
import { selectGlobalSearch } from "@/lib/features/search/searchSlice";

export default function MPsList({ initialMPs }: { initialMPs: MP[] }) {
    const [mps] = useState<MP[]>(initialMPs);
    const globalSearch = useAppSelector(selectGlobalSearch);
    const [chamber, setChamber] = useState<"all" | "sejm" | "senat">("all");
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

    const filteredMps = useMemo(() => {
        let result = mps;

        // Filter by chamber
        if (chamber === "sejm") {
            result = result.filter(mp => mp.chamber === "Sejm");
        } else if (chamber === "senat") {
            result = result.filter(mp => mp.chamber === "Senat");
        }

        // Filter by search
        if (globalSearch) {
            const lower = globalSearch.toLowerCase();
            result = result.filter(mp =>
                mp.name.toLowerCase().includes(lower) ||
                mp.club.toLowerCase().includes(lower) ||
                mp.district.toLowerCase().includes(lower)
            );
        }

        return result;
    }, [mps, globalSearch, chamber]);

    const [visibleCount, setVisibleCount] = useState(100);

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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Parlamentarzyści</h1>
                    <p className="text-gray-400">Posłowie X kadencji i Senatorowie XI kadencji</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                    {/* Chamber Toggle */}
                    <div className="flex bg-surface-color border border-surface-border rounded-xl p-1">
                        <button
                            onClick={() => setChamber("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${chamber === 'all' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-500 hover:text-foreground'}`}
                        >
                            Wszyscy
                        </button>
                        <button
                            onClick={() => setChamber("sejm")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${chamber === 'sejm' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-500 hover:text-foreground'}`}
                        >
                            Sejm
                        </button>
                        <button
                            onClick={() => setChamber("senat")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${chamber === 'senat' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-500 hover:text-foreground'}`}
                        >
                            Senat
                        </button>
                    </div>
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
            <div className="glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group h-full">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-surface-border group-hover:border-accent-blue/50 transition-colors relative shrink-0">
                    {mp.photoUrl ? (
                        <img src={mp.photoUrl} alt={mp.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <User size={24} className="text-gray-400 group-hover:text-blue-400" />
                    )}
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-semibold text-foreground text-sm truncate">{mp.name}</h3>
                    <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${mp.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
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
