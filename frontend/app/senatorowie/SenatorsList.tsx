"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User } from "lucide-react";
import Link from "next/link";
import { Senator } from "@/lib/senators";

export default function SenatorsList({ initialSenators }: { initialSenators: Senator[] }) {
    const [senators, setSenators] = useState<Senator[]>(initialSenators);
    const [filter, setFilter] = useState("");
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

    const filteredSenators = useMemo(() => {
        if (!filter) return senators;
        const lower = filter.toLowerCase();
        return senators.filter(s =>
            s.name.toLowerCase().includes(lower) ||
            (s.club && s.club.toLowerCase().includes(lower)) ||
            (s.district && s.district.toLowerCase().includes(lower))
        );
    }, [senators, filter]);

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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Śledź Senatora</h1>
                    <p className="text-gray-400">Senatorowie XI kadencji</p>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-gray-500" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Szukaj po nazwisku, klubie lub okręgu..."
                        className="pl-10 pr-4 py-2 rounded-xl bg-surface-color/50 border border-surface-border text-foreground focus:ring-2 focus:ring-accent-blue/50 w-full md:w-96 backdrop-blur-md transition-all"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                {filteredSenators.map((senator) => (
                    <SenatorCard key={senator.id} senator={senator} />
                ))}
                {filteredSenators.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Nie znaleziono senatorów.
                    </div>
                )}
            </div>
        </div>
    );
}

function SenatorCard({ senator }: { senator: Senator }) {
    return (
        <Link href={`/senatorowie/${senator.id}`} className="block">
            <div className="glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group h-full">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center border border-purple-500/30 group-hover:border-purple-400/50 transition-colors relative shrink-0">
                    {senator.photoUrl ? (
                        <img src={senator.photoUrl} alt={senator.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <User size={24} className="text-gray-400 group-hover:text-blue-400" />
                    )}
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-semibold text-foreground text-sm truncate">{senator.name}</h3>
                    <div className="flex flex-col gap-0.5 mt-1">
                        {senator.club && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue"></span>
                                <span className="text-xs text-text-secondary truncate" title={senator.club}>
                                    {senator.club.replace('Klub Parlamentarny', 'KP').replace('Koalicja Obywatelska', 'KO')}
                                </span>
                            </div>
                        )}
                        {senator.district && (
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
                                {senator.district.replace('Okręg wyborczy nr', 'Okręg')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
