"use client";

import { ArrowRight, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function HorizontalKanban({ kanban }: { kanban: any }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const columns = [
        { key: "inicjatywa", title: "Inicjatywa", color: "blue" },
        { key: "sejm_i_czytanie", title: "Sejm I", color: "indigo" },
        { key: "sejm_komisje", title: "Komisje", color: "indigo" },
        { key: "sejm_ii_czytanie", title: "Sejm II", color: "blue" },
        { key: "sejm_glosowanie", title: "Głosowanie", color: "blue" },
        { key: "senat_komisje", title: "Senat", color: "purple" },
        { key: "senat_glosowanie", title: "S. Głos", color: "purple" },
        { key: "prezydent", title: "Prezydent", color: "orange" },
        { key: "publikacja", title: "Publikacja", color: "green" },
        { key: "wejscie", title: "W życie", color: "green" },
    ];

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="h-screen flex flex-col fade-in px-4">
            {/* Header */}
            <header className="py-4 flex items-center justify-between border-b border-apple-gray-200 dark:border-white/10">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Harmonogram Legislacyjny</h1>
                    <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">Horizontal Kanban View</p>
                </div>

                {/* View Switcher */}
                <div className="flex gap-2">
                    <Link href="/harmonogram" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                        Vertical
                    </Link>
                    <span className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-blue text-white">
                        Horizontal
                    </span>
                    <Link href="/harmonogram/stats" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                        Stats
                    </Link>
                    <Link href="/harmonogram/timeline" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                        Timeline
                    </Link>
                </div>
            </header>

            {/* Horizontal Scroll Container */}
            <div className="flex-1 relative overflow-hidden py-6">
                {/* Scroll Buttons */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-apple-gray-800 shadow-apple-lg border border-apple-gray-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <ChevronLeft size={20} className="text-apple-gray-700 dark:text-apple-gray-300" />
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-apple-gray-800 shadow-apple-lg border border-apple-gray-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <ChevronRight size={20} className="text-apple-gray-700 dark:text-apple-gray-300" />
                </button>

                {/* Kanban Columns */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto h-full px-12 pb-4 scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {columns.map((col) => {
                        const items = kanban[col.key] || [];
                        return (
                            <div key={col.key} className="flex-shrink-0 w-[180px] flex flex-col snap-center">
                                {/* Column Header */}
                                <div className="mb-3">
                                    <h3 className="text-xs font-bold text-apple-gray-800 dark:text-apple-gray-200 mb-1">
                                        {col.title}
                                    </h3>
                                    <p className="text-[10px] text-apple-gray-500">
                                        {items.length} {items.length === 1 ? 'ustawa' : 'ustaw'}
                                    </p>
                                </div>

                                {/* Items */}
                                <div className="flex-1 space-y-2 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                                    {items.map((item: any) => (
                                        <KanbanCard key={item.id} item={item} color={col.color} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function KanbanCard({ item, color }: { item: any; color: string }) {
    const colorClasses: any = {
        blue: "border-apple-blue/20 bg-apple-blue/5 hover:bg-apple-blue/10",
        indigo: "border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10",
        purple: "border-apple-purple/20 bg-apple-purple/5 hover:bg-apple-purple/10",
        orange: "border-apple-orange/20 bg-apple-orange/5 hover:bg-apple-orange/10",
        green: "border-apple-green/20 bg-apple-green/5 hover:bg-apple-green/10",
    };

    return (
        <Link href={`/ustawy/${item.id}`}>
            <div className={`border rounded-card p-2.5 transition-all cursor-pointer ${colorClasses[color] || colorClasses.blue}`}>
                <p className="text-[10px] font-mono text-apple-blue mb-1">#{item.id}</p>
                <h4 className="text-xs font-semibold text-foreground line-clamp-3 leading-tight mb-2">
                    {item.title}
                </h4>
                {item.isapLink && (
                    <div className="flex items-center gap-1 text-[9px] text-apple-green">
                        <FileText size={9} />
                        Dz.U.
                    </div>
                )}
            </div>
        </Link>
    );
}
