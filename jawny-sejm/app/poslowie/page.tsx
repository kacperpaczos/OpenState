"use client";

import { useState, useMemo } from "react";
import { getParliamentMembers, type MP } from "@/lib/data";
import { Search, User } from "lucide-react";

// In a real app, this would be a server component fetching initial data,
// but for the mock filter logic it's easier to keep it client-side for now
// or use URL search params. Let's do a client component that fetches data once.

import { useEffect } from "react";

export default function MPsPage() {
    const [mps, setMps] = useState<MP[]>([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        getParliamentMembers().then(setMps);
    }, []);

    const filteredMps = useMemo(() => {
        if (!filter) return mps;
        const lower = filter.toLowerCase();
        return mps.filter(mp =>
            mp.name.toLowerCase().includes(lower) ||
            mp.party.toLowerCase().includes(lower)
        );
    }, [mps, filter]);

    return (
        <div className="max-w-7xl mx-auto pb-20 fade-in h-screen flex flex-col">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Śledź Parlamentarzystę</h1>
                    <p className="text-gray-400">460 Posłów i 100 Senatorów</p>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-gray-500" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Szukaj po nazwisku lub partii..."
                        className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 w-full md:w-80"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMps.slice(0, 100).map((mp, i) => ( // Limit render for perf in proto
                        <MPCard key={i} mp={mp} />
                    ))}
                </div>
                {filteredMps.length > 100 && (
                    <div className="text-center py-8 text-gray-500">
                        i {filteredMps.length - 100} więcej... (Wpisz nazwisko aby znaleźć)
                    </div>
                )}
            </div>
        </div>
    );
}

function MPCard({ mp }: { mp: MP }) {
    return (
        <div className="glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors relative">
                {mp.photoUrl ? (
                    <img src={mp.photoUrl} alt={mp.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                    <User size={20} className="text-gray-400 group-hover:text-blue-400" />
                )}
            </div>
            <div>
                <h3 className="font-semibold text-white text-sm">{mp.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{mp.party}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span className="text-xs text-blue-400">{mp.attendance}% obecności</span>
                </div>
            </div>
        </div>
    )
}
