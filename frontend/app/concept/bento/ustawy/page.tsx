import React from 'react';
import { Search, Filter, FileText, ArrowRight } from 'lucide-react';

export default function BentoBillsPage() {
    // Mock bills
    const mockBills = [
        { id: 1, title: "Rządowy projekt ustawy budżetowej na rok 2026", number: "1024", stage: "Prezydent", date: "2026-01-15", author: "Rada Ministrów" },
        { id: 2, title: "Poselski projekt ustawy o zmianie ustawy o ochronie zwierząt", number: "998", stage: "Sejm - II Czytanie", date: "2026-01-10", author: "Posłowie KO" },
        { id: 3, title: "Obywatelski projekt ustawy 'Tak dla CPK'", number: "850", stage: "Sejm - Komisje", date: "2025-12-20", author: "Komitet" },
    ];

    const getStageColor = (stage: string) => {
        if (stage.includes("Prezydent")) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
        if (stage.includes("Sejm")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0f0f11] text-gray-900 dark:text-gray-100 font-sans p-4 md:p-8">

            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                        <FileText className="w-5 h-5" />
                    </span>
                    Proces Legislacyjny
                </h1>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 bg-white dark:bg-[#1c1c1e] p-2 rounded-2xl flex items-center shadow-sm border border-gray-200 dark:border-gray-800">
                    <Search className="w-5 h-5 text-gray-400 ml-3" />
                    <input type="text" placeholder="Szukaj projektu, druku, słowa kluczowego..." className="w-full bg-transparent border-none outline-none px-3 py-2" />
                </div>
                <button className="bg-white dark:bg-[#1c1c1e] px-4 py-3 rounded-2xl font-medium text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm border border-gray-200 dark:border-gray-800">
                    <Filter className="w-4 h-4" />
                    Etap
                </button>
            </div>

            {/* List / Grid */}
            <div className="grid grid-cols-1 gap-4">
                {mockBills.map(bill => (
                    <div key={bill.id} className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-6 border border-gray-200 dark:border-gray-800 hover:border-purple-500/30 transition-all cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex gap-3 mb-2">
                                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-500">Druk nr {bill.number}</span>
                                <span className={`text-xs px-2 py-1 rounded-md font-medium ${getStageColor(bill.stage)}`}>{bill.stage}</span>
                            </div>
                            <h3 className="font-semibold text-xl mb-1 group-hover:text-purple-500 transition-colors">{bill.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Wnioskodawca: {bill.author} • Ostatnia zmiana: {bill.date}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-full group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
