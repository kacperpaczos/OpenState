"use client";

import { MOCK_DB } from "@/lib/data";
import { FileText, ArrowRight, Activity, Clock, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function BillsPage() {
    const { kanban, votingRecords } = MOCK_DB;
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Combine sources
    const allBills = useMemo(() => [
        // Flatten all Kanban stages 
        // @ts-ignore
        ...Object.values(kanban).flat().map((b: any, i) => ({
            title: b.title, dept: b.tag, status: b.stage || "W toku", prio: b.priority, id: b.id || `kanban-${i}`, isVoting: true
        })),

        // @ts-ignore
        ...Object.values(votingRecords).map(v => ({ title: v.title, dept: "Głosowanie", status: v.result, prio: "Wysoki", id: v.id, isVoting: true }))
    ], [kanban, votingRecords]);

    // Filtering Logic
    const filteredBills = allBills.filter(bill => {
        const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.dept.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ? true :
            statusFilter === 'processed' ? bill.status !== 'W toku' && bill.status !== 'Inicjatywa' :
                bill.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-6xl mx-auto pb-20 fade-in h-full flex flex-col">
            <header className="mb-0 pt-0 sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/10 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex justify-between items-end mb-6 pt-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Śledź Ustawę</h1>
                        <p className="text-gray-400">Przegląd wszystkich projektów legislacyjnych w toku.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-bold text-blue-500">{filteredBills.length}</span>
                        <span className="text-sm text-gray-500 block uppercase tracking-wider">Wyników</span>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-wrap gap-4 items-center justify-end">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {[
                            { id: 'all', label: 'Wszystkie' },
                            { id: 'Sejm', label: 'W Sejmie' },
                            { id: 'Senat', label: 'W Senacie' },
                            { id: 'Prezydent', label: 'Do Podpisu' },
                            { id: 'processed', label: 'Zakończone' }
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setStatusFilter(filter.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border
                                    ${statusFilter === filter.id
                                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-foreground'}`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="glass-card overflow-hidden mt-4 flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500 uppercase text-xs tracking-wider">
                            <th className="p-4 font-semibold">Tytuł Projektu</th>
                            <th className="p-4 font-semibold">Resort / Autor</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Priorytet</th>
                            <th className="p-4 font-semibold text-right">Akcja</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredBills.length > 0 ? (
                            filteredBills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-foreground font-medium max-w-md">
                                        {bill.title}
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Activity size={14} className="text-blue-500" />
                                            <span className="truncate max-w-[150px]">{bill.dept}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${bill.status === 'Przyjęta' || bill.status === 'Publikacja' || bill.status === 'Wejście w życie' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                bill.status.includes('Sejm') || bill.status === 'Inicjatywa' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                    bill.status === 'Senat' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                        bill.status === 'Prezydent' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                            'bg-gray-500/10 border-gray-500/20 text-gray-400'
                                            }`}>
                                            {bill.status.includes('Sejm') && <Clock size={10} />}
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded border
                        ${bill.prio === 'Critical' || bill.prio === 'High' || bill.prio === 'Wysoki' ? 'border-red-500/30 text-red-400' : 'border-white/10 text-gray-500'}
                    `}>
                                            {bill.prio}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/ustawy/${bill.id}`}
                                            className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                            Szczegóły <ArrowRight size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Nie znaleziono ustaw pasujących do kryteriów.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
