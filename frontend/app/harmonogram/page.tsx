import { MOCK_DB } from "@/lib/data";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

export default function SchedulePage() {
    const { kanban } = MOCK_DB;

    const rows = [
        { title: "Inicjatywa", items: kanban.inicjatywa, bg: "bg-blue-500/5 dark:bg-blue-900/10", border: "border-blue-500/20", badge: "bg-blue-500/10 text-blue-400" },

        // Sejm - Granular
        { title: "Sejm - I Czytanie", items: kanban.sejm_i_czytanie, bg: "bg-indigo-500/5 dark:bg-indigo-900/10", border: "border-indigo-500/20", badge: "bg-indigo-500/10 text-indigo-400" },
        { title: "Sejm - Komisje", items: kanban.sejm_komisje, bg: "bg-indigo-600/5 dark:bg-indigo-800/10", border: "border-indigo-600/20", badge: "bg-indigo-600/10 text-indigo-400" },
        { title: "Sejm - II Czytanie", items: kanban.sejm_ii_czytanie, bg: "bg-blue-600/5 dark:bg-blue-800/10", border: "border-blue-600/20", badge: "bg-blue-600/10 text-blue-400" },
        { title: "Sejm - Głosowanie", items: kanban.sejm_glosowanie, bg: "bg-blue-700/5 dark:bg-blue-700/10", border: "border-blue-700/20", badge: "bg-blue-700/10 text-blue-300" },

        // Senat - Granular
        { title: "Senat - Komisje", items: kanban.senat_komisje, bg: "bg-purple-500/5 dark:bg-purple-900/10", border: "border-purple-500/20", badge: "bg-purple-500/10 text-purple-400" },
        { title: "Senat - Głosowanie", items: kanban.senat_glosowanie, bg: "bg-purple-600/5 dark:bg-purple-800/10", border: "border-purple-600/20", badge: "bg-purple-600/10 text-purple-400" },

        { title: "Prezydent", items: kanban.prezydent, bg: "bg-red-500/5 dark:bg-red-900/10", border: "border-red-500/20", badge: "bg-red-500/10 text-red-500" },
        { title: "Publikacja", items: kanban.publikacja, bg: "bg-yellow-500/5 dark:bg-yellow-900/10", border: "border-yellow-500/20", badge: "bg-yellow-500/10 text-yellow-500" },
        { title: "Wejście w życie", items: kanban.wejscie, bg: "bg-green-500/5 dark:bg-green-900/10", border: "border-green-500/20", badge: "bg-green-500/10 text-green-500" },
    ];

    return (
        <div className="h-full flex flex-col fade-in">
            <header className="mb-6 flex-shrink-0 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Plan Prac Sejmu</h1>
                    <p className="text-gray-500 dark:text-gray-400">Proces legislacyjny w widoku strumieniowym.</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-10 scrollbar-thin">
                {rows.map((row) => (
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
                                                        <span className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20" title="Opublikowano w Dzienniku Ustaw">
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
        </div>
    );
}
