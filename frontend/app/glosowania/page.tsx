import { getSittings } from "@/lib/votings";
import Link from "next/link";
import { Users } from "lucide-react";

export default async function VotingsPage() {
    const sittings = await getSittings();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">
                Przeglądarka <span className="text-gradient">Głosowań</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sittings.map((s) => (
                    <Link key={s.sitting} href={`/glosowania/${s.sitting}`}>
                        <div className="glass-card p-6 hover:bg-surface-color/50 transition-all cursor-pointer group h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-500 text-sm font-mono">Posiedzenie nr</span>
                                <span className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
                                    <Users className="w-5 h-5" />
                                </span>
                            </div>
                            <h2 className="text-5xl font-bold text-foreground mb-2 group-hover:text-blue-400 transition-colors">
                                {s.sitting}
                            </h2>
                            <p className="text-gray-400 text-sm mt-4 border-t border-gray-800 pt-4">
                                Daty: {s.date || "Brak danych"}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
