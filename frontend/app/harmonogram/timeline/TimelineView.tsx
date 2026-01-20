"use client";

import Link from "next/link";
import { Circle } from "lucide-react";

export default function TimelineView({ kanban }: { kanban: any }) {
    const tracks = [
        { key: "inicjatywa", title: "Inicjatywa", items: kanban.inicjatywa, color: "bg-blue-500" },
        { key: "sejm_i_czytanie", title: "Sejm - I Czytanie", items: kanban.sejm_i_czytanie, color: "bg-indigo-500" },
        { key: "sejm_komisje", title: "Sejm - Komisje", items: kanban.sejm_komisje, color: "bg-indigo-600" },
        { key: "sejm_ii_czytanie", title: "Sejm - II Czytanie", items: kanban.sejm_ii_czytanie, color: "bg-blue-600" },
        { key: "sejm_glosowanie", title: "Sejm - Głosowanie", items: kanban.sejm_glosowanie, color: "bg-blue-700" },
        { key: "senat_komisje", title: "Senat - Komisje", items: kanban.senat_komisje, color: "bg-purple-500" },
        { key: "senat_glosowanie", title: "Senat - Głosowanie", items: kanban.senat_glosowanie, color: "bg-purple-600" },
        { key: "prezydent", title: "Prezydent", items: kanban.prezydent, color: "bg-orange-500" },
        { key: "publikacja", title: "Publikacja", items: kanban.publikacja, color: "bg-green-500" },
        { key: "wejscie", title: "Wejście w życie", items: kanban.wejscie, color: "bg-green-600" },
    ];

    return (
        <div className="max-w-[1600px] mx-auto fade-in px-4 pb-20">
            {/* Header */}
            <header className="py-6 border-b border-apple-gray-200 dark:border-white/10 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Timeline Legislacyjny</h1>
                        <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">Metro Map View</p>
                    </div>

                    {/* View Switcher */}
                    <div className="flex gap-2">
                        <Link href="/harmonogram" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Kanban
                        </Link>
                        <Link href="/harmonogram/stats" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Stats
                        </Link>
                        <span className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-blue text-white">
                            Timeline
                        </span>
                    </div>
                </div>
            </header>

            {/* Metro Timeline */}
            <div className="space-y-1">
                {tracks.map((track, trackIdx) => (
                    <div key={track.key} className="relative">
                        {/* Track */}
                        <div className="flex items-center py-3">
                            {/* Label */}
                            <div className="w-48 flex-shrink-0">
                                <h3 className="text-sm font-semibold text-foreground">{track.title}</h3>
                                <p className="text-xs text-apple-gray-500">{track.items.length} projektów</p>
                            </div>

                            {/* Line */}
                            <div className="flex-1 relative h-12 flex items-center">
                                {/* Rail */}
                                <div className={`absolute inset-0 h-2 ${track.color} opacity-20 rounded-full`} />

                                {/* Stations (Bills) */}
                                <div className="relative z-10 flex items-center gap-4 pl-4">
                                    {track.items.slice(0, 15).map((item: any, idx: number) => (
                                        <Link
                                            key={item.id}
                                            href={`/ustawy/${item.id}`}
                                            className="group relative"
                                            title={item.title}
                                        >
                                            <div className={`w-3 h-3 ${track.color} rounded-full ring-4 ring-white dark:ring-apple-gray-900 group-hover:scale-150 transition-transform cursor-pointer`} />

                                            {/* Tooltip on hover */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                                                <div className="bg-white dark:bg-apple-gray-800 shadow-apple-xl rounded-card border border-apple-gray-200 dark:border-white/10 p-2 min-w-[200px]">
                                                    <p className="text-xs font-mono text-apple-blue mb-1">#{item.id}</p>
                                                    <p className="text-xs text-foreground line-clamp-2">{item.title}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {track.items.length > 15 && (
                                        <span className="text-xs text-apple-gray-500">+{track.items.length - 15}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-8 card-apple p-4">
                <p className="text-xs text-apple-gray-600 dark:text-apple-gray-400">
                    <strong>Legenda:</strong> Każdy punkt (●) reprezentuje jeden projekt ustawy. Najedź kursorem aby zobaczyć szczegóły.
                </p>
            </div>
        </div>
    );
}
