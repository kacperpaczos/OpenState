"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User } from "lucide-react";
import Link from "next/link";
import { MP } from "@/lib/mps";

export default function MPsList({ initialMPs }: { initialMPs: MP[] }) {
    const [mps] = useState<MP[]>(initialMPs);
    const [filter, setFilter] = useState("");
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
        if (filter) {
            const lower = filter.toLowerCase();
            result = result.filter(mp =>
                mp.name.toLowerCase().includes(lower) ||
                mp.club.toLowerCase().includes(lower) ||
                mp.district.toLowerCase().includes(lower)
            );
        }

        return result;
    }, [mps, filter, chamber]);

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

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-500" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Szukaj po nazwisku lub klubie..."
                            className="pl-10 pr-4 py-2 rounded-xl bg-surface-color/50 border border-surface-border text-foreground focus:ring-2 focus:ring-accent-blue/50 w-full md:w-64 backdrop-blur-md transition-all"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                {filteredMps.slice(0, 100).map((mp) => (
                    <MPCard key={`${mp.chamber}-${mp.id}`} mp={mp} />
                ))}
            </div>
            {filteredMps.length > 100 && (
                <div className="text-center py-8 text-gray-500">
                    i {filteredMps.length - 100} więcej... (Wpisz nazwisko aby znaleźć)
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
    return (
        <Link href={`/poslowie/${mp.id}`} className="block">
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
