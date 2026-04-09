"use client";

import { useState, useRef } from "react";
import { Bill } from "@/lib/bills";
import { KANBAN_STAGES } from "@/lib/constants";
import { ArrowRight, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type ViewMode = "vertical" | "horizontal";

export default function ScheduleBoard({ initialProcesses }: { initialProcesses: Bill[] }) {
    const processes = initialProcesses;
    const [viewMode, setViewMode] = useState<ViewMode>("vertical");
    const scrollRef = useRef<HTMLDivElement>(null);

    const kanban = {
         inicjatywa: processes.filter(p => p.kanbanStage === KANBAN_STAGES.INICJATYWA),
         sejm_i_czytanie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SEJM_I_CZYTANIE),
         sejm_komisje: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SEJM_KOMISJE),
         sejm_ii_czytanie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SEJM_II_CZYTANIE),
         sejm_glosowanie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SEJM_GLOSOWANIE),
         senat_komisje: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SENAT_KOMISJE),
         senat_glosowanie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SENAT_GLOSOWANIE),
         prezydent: processes.filter(p => p.kanbanStage === KANBAN_STAGES.PREZYDENT),
         publikacja: processes.filter(p => p.kanbanStage === KANBAN_STAGES.PUBLIKACJA),
         wejscie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.WEJSCIE_W_ZYCIE),
    };

    const verticalRows = [
        { title: KANBAN_STAGES.INICJATYWA, items: kanban.inicjatywa, bg: "bg-blue-500/5 dark:bg-blue-900/10", border: "border-blue-500/20", badge: "bg-blue-500/10 text-blue-400" },
        { title: KANBAN_STAGES.SEJM_I_CZYTANIE, items: kanban.sejm_i_czytanie, bg: "bg-indigo-500/5 dark:bg-indigo-900/10", border: "border-indigo-500/20", badge: "bg-indigo-500/10 text-indigo-400" },
        { title: KANBAN_STAGES.SEJM_KOMISJE, items: kanban.sejm_komisje, bg: "bg-indigo-600/5 dark:bg-indigo-800/10", border: "border-indigo-600/20", badge: "bg-indigo-600/10 text-indigo-400" },
        { title: KANBAN_STAGES.SEJM_II_CZYTANIE, items: kanban.sejm_ii_czytanie, bg: "bg-blue-600/5 dark:bg-blue-800/10", border: "border-blue-600/20", badge: "bg-blue-600/10 text-blue-400" },
        { title: KANBAN_STAGES.SEJM_GLOSOWANIE, items: kanban.sejm_glosowanie, bg: "bg-blue-700/5 dark:bg-blue-700/10", border: "border-blue-700/20", badge: "bg-blue-700/10 text-blue-300" },
        { title: KANBAN_STAGES.SENAT_KOMISJE, items: kanban.senat_komisje, bg: "bg-purple-500/5 dark:bg-purple-900/10", border: "border-purple-500/20", badge: "bg-purple-500/10 text-purple-400" },
        { title: KANBAN_STAGES.SENAT_GLOSOWANIE, items: kanban.senat_glosowanie, bg: "bg-purple-600/5 dark:bg-purple-800/10", border: "border-purple-600/20", badge: "bg-purple-600/10 text-purple-400" },
        { title: KANBAN_STAGES.PREZYDENT, items: kanban.prezydent, bg: "bg-red-500/5 dark:bg-red-900/10", border: "border-red-500/20", badge: "bg-red-500/10 text-red-500" },
        { title: KANBAN_STAGES.PUBLIKACJA, items: kanban.publikacja, bg: "bg-yellow-500/5 dark:bg-yellow-900/10", border: "border-yellow-500/20", badge: "bg-yellow-500/10 text-yellow-500" },
        { title: KANBAN_STAGES.WEJSCIE_W_ZYCIE, items: kanban.wejscie, bg: "bg-green-500/5 dark:bg-green-900/10", border: "border-green-500/20", badge: "bg-green-500/10 text-green-500" },
    ];

    const horizontalColumns = [
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
             scrollRef.current.scrollBy({ left: direction === "left" ? -400 : 400, behavior: "smooth" });
        }
    };

    return (
        <div className="h-full flex flex-col fade-in max-w-[1600px] mx-auto px-4">
            <header className="py-6 flex-shrink-0 flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Plan Prac Sejmu</h1>
                    <p className="text-gray-500 dark:text-gray-400">Proces legislacyjny w widoku strumieniowym.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("vertical")}
                        className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-colors ${viewMode === 'vertical' ? 'bg-apple-blue text-white' : 'bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10'}`}
                    >
                        Vertical
                    </button>
                    <button
                        onClick={() => setViewMode("horizontal")}
                        className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-colors ${viewMode === 'horizontal' ? 'bg-apple-blue text-white' : 'bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10'}`}
                    >
                        Horizontal
                    </button>
                    <Link href="/ustawy" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors ml-2">
                        Wróć do Kart
                    </Link>
                </div>
            </header>

            {viewMode === "vertical" ? (
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-10 scrollbar-thin">
                    {verticalRows.map((row) => (
                        <div key={row.title} className={`rounded-3xl border ${row.border} ${row.bg} backdrop-blur-sm p-4 transition-colors`}>
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="font-bold text-lg text-foreground px-2">{row.title}</h3>
                                <span className="text-xs font-mono text-gray-500 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">
                                    {row.items.length} ustaw
                                </span>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10">
                                {row.items.length === 0 ? (
                                    <div className="text-sm text-gray-400 italic px-4 py-8 w-full text-center border border-dashed border-gray-500/20 rounded-xl">
                                        Brak procedowanych ustaw na tym etapie
                                    </div>
                                ) : (
                                    row.items.map((item: any) => (
                                        <Link key={item.id} href={`/ustawy/${item.id}`} className="block flex-shrink-0">
                                            <div className="w-[320px] glass-card p-5 hover:border-opacity-50 transition-all hover:scale-[1.01] group bg-white/40 dark:bg-white/5">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded ${row.badge}`}>
                                                        {item.tag || "Sejm"}
                                                    </span>
                                                    {item.priority === 'Critical' && (
                                                        <span className="flex h-2 w-2 relative">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                        </span>
                                                    )}
                                                </div>

                                                <h4 className="text-base font-semibold text-foreground mb-4 leading-snug group-hover:text-blue-500 transition-colors line-clamp-2 min-h-[3rem]">
                                                    {item.title}
                                                </h4>

                                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-500/10 pt-3 mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono">Druk {item.id}</span>
                                                        {item.isapLink && (
                                                            <span className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                                                                <FileText size={10} /> Dz.U.
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-blue-500 opacity-0 group-hover:opacity-100">
                                                        Szczegóły <ArrowRight size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 relative overflow-hidden py-2 min-h-[600px]">
                    <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-apple-gray-800 shadow-apple-lg border border-apple-gray-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform">
                        <ChevronLeft size={20} className="text-apple-gray-700 dark:text-apple-gray-300" />
                    </button>
                    <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-apple-gray-800 shadow-apple-lg border border-apple-gray-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform">
                        <ChevronRight size={20} className="text-apple-gray-700 dark:text-apple-gray-300" />
                    </button>

                    <div ref={scrollRef} className="flex gap-4 overflow-x-auto h-full px-12 pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
                        {horizontalColumns.map((col) => {
                             const items = (kanban as any)[col.key] || [];
                             return (
                                 <div key={col.key} className="flex-shrink-0 w-[200px] flex flex-col snap-center h-full">
                                     <div className="mb-3">
                                         <h3 className="text-sm font-bold text-apple-gray-800 dark:text-apple-gray-200 mb-1">{col.title}</h3>
                                         <p className="text-[10px] text-apple-gray-500">{items.length} ustaw</p>
                                     </div>
                                     <div className="flex-1 space-y-2 overflow-y-auto pr-1 pb-10 scrollbar-thin">
                                         {items.map((item: any) => (
                                             <KanbanCard key={item.id} item={item} color={col.color} />
                                         ))}
                                     </div>
                                 </div>
                             );
                        })}
                    </div>
                </div>
            )}
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
                <h4 className="text-xs font-semibold text-foreground line-clamp-3 leading-tight mb-2">{item.title}</h4>
                {item.isapLink && (
                    <div className="flex items-center gap-1 text-[9px] text-apple-green"><FileText size={9} /> Dz.U.</div>
                )}
            </div>
        </Link>
    );
}
