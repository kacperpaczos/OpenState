"use client";

import { BarChart3, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function StatsView({ kanban }: { kanban: any }) {
    // Calculate stats
    const stages = [
        { key: "inicjatywa", title: "Inicjatywa", items: kanban.inicjatywa },
        { key: "sejm_i_czytanie", title: "Sejm I Czytanie", items: kanban.sejm_i_czytanie },
        { key: "sejm_komisje", title: "Sejm Komisje", items: kanban.sejm_komisje },
        { key: "sejm_ii_czytanie", title: "Sejm II Czytanie", items: kanban.sejm_ii_czytanie },
        { key: "sejm_glosowanie", title: "Sejm Głosowanie", items: kanban.sejm_glosowanie },
        { key: "senat_komisje", title: "Senat Komisje", items: kanban.senat_komisje },
        { key: "senat_glosowanie", title: "Senat Głosowanie", items: kanban.senat_glosowanie },
        { key: "prezydent", title: "Prezydent", items: kanban.prezydent },
        { key: "publikacja", title: "Publikacja", items: kanban.publikacja },
        { key: "wejscie", title: "Wejście w życie", items: kanban.wejscie },
    ];

    const totalBills = stages.reduce((sum, s) => sum + s.items.length, 0);
    const inProgress = stages.slice(0, -2).reduce((sum, s) => sum + s.items.length, 0);
    const completed = kanban.publikacja.length + kanban.wejscie.length;

    return (
        <div className="max-w-[1400px] mx-auto fade-in px-4 pb-20">
            {/* Header */}
            <header className="py-6 border-b border-apple-gray-200 dark:border-white/10 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Statystyki Legislacyjne</h1>
                        <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">Analytics Dashboard</p>
                    </div>

                    {/* View Switcher */}
                    <div className="flex gap-2">
                        <Link href="/harmonogram" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Vertical
                        </Link>
                        <Link href="/harmonogram/horizontal" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Horizontal
                        </Link>
                        <span className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-blue text-white">
                            Stats
                        </span>
                        <Link href="/harmonogram/timeline" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Timeline
                        </Link>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <KPICard
                    icon={<BarChart3 size={24} className="text-apple-blue" />}
                    label="Łącznie Projektów"
                    value={totalBills}
                    subtitle="Wszystkie etapy"
                />
                <KPICard
                    icon={<Clock size={24} className="text-apple-orange" />}
                    label="W Trakcie"
                    value={inProgress}
                    subtitle={`${((inProgress / totalBills) * 100).toFixed(0)}% całości`}
                />
                <KPICard
                    icon={<CheckCircle2 size={24} className="text-apple-green" />}
                    label="Zakończone"
                    value={completed}
                    subtitle={`${((completed / totalBills) * 100).toFixed(0)}% całości`}
                />
            </div>

            {/* Breakdown by Stage */}
            <div className="card-apple p-6 mb-8">
                <h2 className="text-headline font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-apple-blue" />
                    Rozkład według Etapu
                </h2>

                <div className="space-y-3">
                    {stages.map((stage) => {
                        const percentage = totalBills > 0 ? (stage.items.length / totalBills) * 100 : 0;
                        return (
                            <div key={stage.key}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-foreground">{stage.title}</span>
                                    <span className="text-xs text-apple-gray-600 dark:text-apple-gray-400">
                                        {stage.items.length} ({percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-apple-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-apple-blue transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Projects */}
            <div className="card-apple p-6">
                <h2 className="text-headline font-semibold text-foreground mb-4">
                    Najnowsze Projekty w Toku
                </h2>
                <div className="space-y-2">
                    {inProgress > 0 ? (
                        stages.slice(0, 5).flatMap(s => s.items).slice(0, 10).map((item: any, idx: number) => (
                            <Link
                                key={item.id}
                                href={`/ustawy/${item.id}`}
                                className="block p-3 rounded-card bg-apple-gray-50 dark:bg-white/5 hover:bg-apple-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono text-apple-blue">#{item.id}</span>
                                        <span className="text-sm text-foreground line-clamp-1">{item.title}</span>
                                    </div>
                                    <span className="text-xs text-apple-gray-500">{item.stage}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-apple-gray-500 text-center py-4">Brak projektów w toku</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function KPICard({ icon, label, value, subtitle }: { icon: React.ReactNode; label: string; value: number; subtitle: string }) {
    return (
        <div className="card-apple p-6">
            <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-card bg-apple-blue/10 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
            <div className="text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-1">{label}</div>
            <div className="text-xs text-apple-gray-500">{subtitle}</div>
        </div>
    );
}
