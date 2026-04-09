"use client";

import React, { useState } from 'react';
import { 
    PieChart as RePieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip as ReTooltip, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Legend
} from 'recharts';
import { BUDGET_DATA, BudgetCategory } from '@/lib/budget';
import { ArrowDownRight, ArrowUpRight, Banknote, Info, Wallet, TrendingDown } from 'lucide-react';

export default function BudgetPage() {
    const [selectedYear, setSelectedYear] = useState(BUDGET_DATA[0]);

    const formatPLN = (value: number) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
            maximumFractionDigits: 1
        }).format(value) + ' mld';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Budżet Państwa</h1>
                    <p className="text-gray-500 font-medium mt-1">Analiza finansów publicznych i kierunków wydatkowania</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    {BUDGET_DATA.map(year => (
                        <button
                            key={year.year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                selectedYear.year === year.year 
                                ? "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white" 
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                        >
                            Rok {year.year}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card !p-6 flex flex-col justify-between group overflow-hidden relative">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
                            <Banknote size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dochody</p>
                            <h3 className="text-2xl font-black">{formatPLN(selectedYear.revenue)}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-green-600">
                        <TrendingDown className="rotate-180" size={14} /> 
                        +{(selectedYear.revenue - BUDGET_DATA[1].revenue).toFixed(1)} mld r/r
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors" />
                </div>

                <div className="glass-card !p-6 flex flex-col justify-between group overflow-hidden relative">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Wydatki</p>
                            <h3 className="text-2xl font-black">{formatPLN(selectedYear.expenditure)}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-gray-400">
                        Porażająca kwota, dynamicznie rosnąca
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                </div>

                <div className="glass-card !p-6 flex flex-col justify-between group overflow-hidden relative border-red-500/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deficyt</p>
                            <h3 className="text-2xl font-black text-red-600 dark:text-red-400">{formatPLN(selectedYear.deficit)}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-500">
                        <ArrowUpRight size={14} /> 
                        Wzrost o {(selectedYear.deficit - BUDGET_DATA[1].deficit).toFixed(1)} mld r/r
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors" />
                </div>
            </div>

            {/* Main Content: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Category Breakdown */}
                <div className="lg:col-span-2 glass-card !p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold">Struktura Wydatków</h2>
                        <p className="text-sm text-gray-500">Gdzie trafiają pieniądze z budżetu państwa</p>
                    </div>
                    
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={selectedYear.categories}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="label" 
                                    type="category" 
                                    width={140} 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600 }}
                                />
                                <ReTooltip 
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload as BudgetCategory;
                                            return (
                                                <div className="glass-card !p-3 shadow-xl border-gray-200/50 dark:border-white/10">
                                                    <p className="font-bold text-sm mb-1">{data.label}</p>
                                                    <p className="text-blue-600 dark:text-blue-400 font-black text-lg">{formatPLN(data.amount)}</p>
                                                    <p className="text-[10px] text-gray-500 max-w-[200px] leading-relaxed mt-1">{data.description}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="amount" 
                                    radius={[0, 8, 8, 0]} 
                                    barSize={24}
                                >
                                    {selectedYear.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Pie Chart + Legend */}
                <div className="glass-card !p-8 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold">Proporcje</h2>
                        <p className="text-sm text-gray-500">Udział w całkowitych wydatkach</p>
                    </div>
                    <div className="h-[240px] w-full shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={selectedYear.categories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="amount"
                                >
                                    {selectedYear.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <ReTooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 overflow-y-auto pr-2 mt-4 custom-scrollbar">
                        {selectedYear.categories.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
                                </div>
                                <span className="font-black text-gray-900 dark:text-white">
                                    {((cat.amount / selectedYear.expenditure) * 100).toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tax Info Section */}
            <div className="glass-card !p-10 bg-gradient-to-br from-gray-900 to-blue-950 text-white border-none relative overflow-hidden group">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-black mb-4">Na co idą Twoje podatki?</h2>
                    <p className="text-blue-100/80 leading-relaxed mb-6">
                        Budżet państwa to nie tylko cyfry na papierze. To Twoje składki, podatki PIT i VAT przekute w infrastrukturę, 
                        bezpieczeństwo i usługi publiczne. Pół biliona złotych rocznie to gigantyczna odpowiedzialność. 
                        Monitoruj, jak te środki są rozdysponowywane i czy kierunki wydatków pokrywają się z Twoimi priorytetami.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-white text-blue-950 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-white/10">
                            Przewodnik po budżecie
                        </button>
                        <button className="bg-blue-500/20 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-500/30 transition-colors">
                            Wszystkie działy klasyfikacji
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent pointer-none" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000" />
            </div>
        </div>
    );
}
