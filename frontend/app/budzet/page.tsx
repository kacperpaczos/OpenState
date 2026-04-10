import React, { useState, useMemo, useEffect } from 'react';
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
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import { BUDGET_DATA, BudgetCategory, BudgetYear } from '@/lib/budget';
import { 
    ArrowDownRight, 
    ArrowUpRight, 
    Banknote, 
    Wallet, 
    TrendingDown, 
    History, 
    ArrowRight,
    Search,
    Info,
    LineChart as LucideLineChart
} from 'lucide-react';

export default function BudgetPage() {
    const sortedBudgets = [...BUDGET_DATA].sort((a, b) => b.year - a.year);
    const [selectedYear, setSelectedYear] = useState<BudgetYear>(sortedBudgets[0]);
    
    // Update window title
    useEffect(() => {
        document.title = `Budżet Państwa ${selectedYear.year} | OpenState`;
    }, [selectedYear]);

    // Znajdź poprzedni rok dla porównania delt
    const prevYearData = useMemo(() => {
        const index = sortedBudgets.findIndex(b => b.year === selectedYear.year);
        return sortedBudgets[index + 1];
    }, [selectedYear, sortedBudgets]);

    const formatPLN = (value: number) => {
        const absValue = Math.abs(value);
        const suffix = ' mld';
        const formatted = new Intl.NumberFormat('pl-PL', {
            maximumFractionDigits: 1
        }).format(absValue);
        return (value < 0 ? '-' : '') + formatted + suffix;
    };

    const calculateDiff = (current: number, prev: number | undefined) => {
        if (prev === undefined) return null;
        const diff = current - prev;
        const isPositive = diff > 0;
        return {
            value: formatPLN(diff),
            isPositive,
            percent: ((diff / prev) * 100).toFixed(1) + '%'
        };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Elegant Header with Time Machine */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-black text-xs uppercase tracking-[0.2em]">
                            <History size={14} />
                            Wejdź w wehikuł czasu
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white">
                            Budżet Państwa <span className="text-blue-600">{selectedYear.year}</span>
                        </h1>
                        <p className="text-gray-500 font-medium max-w-xl leading-relaxed">
                            Analiza historyczna i bieżąca finansów publicznych Rzeczypospolitej. 
                            Przełączaj lata, aby zobaczyć jak rosły wydatki i zmieniały się priorytety państwa.
                        </p>
                    </div>

                    {/* Desktop Year Selector */}
                    <div className="hidden lg:flex items-center gap-2 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl backdrop-blur-md">
                        {sortedBudgets.map(b => (
                            <button
                                key={b.year}
                                onClick={() => setSelectedYear(b)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                                    selectedYear.year === b.year 
                                    ? "bg-white dark:bg-white/10 shadow-xl shadow-black/5 text-blue-600 dark:text-white scale-105" 
                                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                            >
                                {b.year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Year Selector */}
                <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                    {sortedBudgets.map(b => (
                        <button
                            key={b.year}
                            onClick={() => setSelectedYear(b)}
                            className={`px-6 py-3 rounded-2xl text-sm font-bold shrink-0 transition-all ${
                                selectedYear.year === b.year 
                                ? "bg-blue-600 text-white shadow-lg" 
                                : "bg-gray-100 dark:bg-white/5 text-gray-500"
                            }`}
                        >
                            {b.year}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        label: "Dochody", 
                        value: selectedYear.revenue, 
                        icon: Banknote, 
                        color: "emerald",
                        diff: calculateDiff(selectedYear.revenue, prevYearData?.revenue)
                    },
                    { 
                        label: "Wydatki", 
                        value: selectedYear.expenditure, 
                        icon: Wallet, 
                        color: "blue",
                        diff: calculateDiff(selectedYear.expenditure, prevYearData?.expenditure)
                    },
                    { 
                        label: "Deficyt / Nadwyżka", 
                        value: selectedYear.deficit, 
                        icon: TrendingDown, 
                        color: selectedYear.deficit > 0 ? "red" : "emerald",
                        diff: calculateDiff(selectedYear.deficit, prevYearData?.deficit)
                    },
                    { 
                        label: "Relacja % do PKB", 
                        value: selectedYear.gdpRatio || 0, 
                        icon: LucideLineChart, 
                        color: "purple",
                        isPercent: true
                    }
                ].map((stat, i) => (
                    <div key={i} className="glass-card !p-6 group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-gray-100 dark:border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={22} />
                            </div>
                            {stat.diff && (
                                <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.diff.isPositive ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                    {stat.diff.isPositive ? '+' : ''}{stat.diff.percent}
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{stat.label}</p>
                        <h3 className="text-2xl font-black mt-1">
                            {stat.isPercent ? `${stat.value}%` : formatPLN(stat.value)}
                        </h3>
                        <div className={`absolute -right-4 -bottom-4 w-20 h-20 bg-${stat.color}-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                ))}
            </div>

            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Horizontal Expenditure Bar Chart */}
                <div className="lg:col-span-2 glass-card !p-10 space-y-8">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Gdzie trafiają Twoje pieniądze?</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Szczegółowa struktura wydatków państwa w roku {selectedYear.year}.</p>
                    </div>
                    
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={selectedYear.categories}
                                layout="vertical"
                                margin={{ top: 0, right: 40, left: 20, bottom: 0 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="label" 
                                    type="category" 
                                    width={140} 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 700, fill: '#888' }}
                                />
                                <ReTooltip 
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload as BudgetCategory;
                                            return (
                                                <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                                                    <p className="font-black text-xs uppercase tracking-widest text-gray-400 mb-1">{data.label}</p>
                                                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatPLN(data.amount)}</p>
                                                    <p className="text-[10px] text-gray-500 max-w-[220px] leading-relaxed mt-2 font-medium">{data.description}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="amount" 
                                    radius={[0, 12, 12, 0]} 
                                    barSize={28}
                                    animationDuration={1500}
                                >
                                    {selectedYear.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vertical Context Panel (Proportions & History) */}
                <div className="space-y-8">
                    {/* Proportions Card */}
                    <div className="glass-card !p-8 flex flex-col items-center">
                        <div className="w-full text-center mb-8">
                            <h3 className="text-lg font-black tracking-tight">Punkt widzenia</h3>
                            <p className="text-xs text-gray-500 font-medium">Udziały procentowe</p>
                        </div>
                        <div className="h-[220px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={selectedYear.categories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={6}
                                        dataKey="amount"
                                        animationDuration={1500}
                                    >
                                        {selectedYear.categories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                </RePieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Wydatki</span>
                                <span className="text-2xl font-black">100%</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mt-10">
                            {selectedYear.categories.slice(0, 4).map((cat) => (
                                <div key={cat.id} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 truncate">{cat.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-gray-900 dark:text-white pl-3 text-left">
                                        {((cat.amount / selectedYear.expenditure) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Historical Pulse Chart */}
                    <div className="glass-card !p-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-black tracking-tight">Kondycja PKB</h3>
                            <p className="text-xs text-gray-500 font-medium leading-tight">Relacja deficytu do gospodarki (%)</p>
                        </div>
                        <div className="h-[140px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sortedBudgets.reverse()}>
                                    <defs>
                                        <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area 
                                        type="monotone" 
                                        dataKey="gdpRatio" 
                                        stroke="#3B82F6" 
                                        fillOpacity={1} 
                                        strokeWidth={3}
                                        fill="url(#colorGdp)" 
                                    />
                                    <ReTooltip />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium mt-4 leading-relaxed italic">
                            Trend historyczny odzwierciedla dyscyplinę budżetową na przestrzeni ostatnich dekad.
                        </p>
                    </div>
                </div>
            </div>

            {/* Educational / Interactive call to action */}
            <div className="glass-card !p-12 bg-zinc-950 text-white border-none relative overflow-hidden group">
                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-4xl font-black mb-6 tracking-tighter">Zrozumieć Miliardy</h2>
                    <p className="text-blue-100/70 text-lg leading-relaxed mb-10">
                        Budżet państwa zmieniał się drastycznie na przestrzeni lat. Od skromnych 16 miliardów w 1990 roku, 
                        po blisko bilionowe wydatki dzisiaj. OpenState pozwala Ci analizować te zmiany nie tylko jako suche 
                        cyfry, ale jako realny obraz rozwoju naszego kraju. 
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-white text-blue-950 px-8 py-3.5 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-white/5">
                            Analiza Porównawcza Dekad
                        </button>
                        <button className="bg-white/10 backdrop-blur-2xl border border-white/10 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-white/20 transition-all">
                            Pobierz Raport PDF
                        </button>
                    </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] group-hover:bg-blue-500/20 transition-all duration-1000" />
                <LucideLineChart className="absolute right-12 top-1/2 -translate-y-1/2 text-white/5 w-64 h-64 -rotate-12" />
            </div>
        </div>
    );
}
