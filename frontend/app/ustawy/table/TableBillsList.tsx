"use client";

import { Bill } from "@/lib/bills";
import { Search, ArrowUpDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setBills, selectFilteredBills, selectFilter } from "@/lib/features/bills/billsSlice";

type SortField = "id" | "title" | "date" | "stage";
type SortDirection = "asc" | "desc";

export default function TableBillsList({ initialProcesses }: { initialProcesses: Bill[] }) {
    const dispatch = useAppDispatch();
    const filteredBills = useAppSelector(selectFilteredBills);
    // Search is handled globally by Navbar

    // Local sort state
    const [sortField, setSortField] = useState<SortField>("id");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    // Initialize store
    useEffect(() => {
        dispatch(setBills(initialProcesses));
    }, [dispatch, initialProcesses]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedBills = useMemo(() => {
        // Clone to avoid mutating Redux state (though filter returns new array, sort mutates)
        let result = [...filteredBills];

        // Sort
        result.sort((a, b) => {
            let aVal: any, bVal: any;

            switch (sortField) {
                case "id":
                    aVal = parseInt(a.id) || 0;
                    bVal = parseInt(b.id) || 0;
                    break;
                case "title":
                    aVal = a.title;
                    bVal = b.title;
                    break;
                case "date":
                    aVal = a.date || "";
                    bVal = b.date || "";
                    break;
                case "stage":
                    aVal = a.kanbanStage || "";
                    bVal = b.kanbanStage || "";
                    break;
            }

            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [filteredBills, sortField, sortDirection]);

    return (
        <div className="max-w-[1600px] mx-auto pb-20 fade-in h-screen flex flex-col px-4">
            {/* Compact Header */}
            <header className="py-4 border-b border-apple-gray-200 dark:border-white/10 sticky top-0 bg-background/95 backdrop-blur-xl z-50 -mx-4 px-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-bold text-foreground">Projekty ({sortedBills.length})</h1>

                    <div className="flex-1 max-w-md"></div>

                    {/* View Switcher */}
                    <div className="flex gap-2">
                        <Link href="/ustawy" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Cards
                        </Link>
                        <Link href="/ustawy/compact" className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-gray-100 dark:bg-white/5 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-white/10 transition-colors">
                            Compact
                        </Link>
                        <span className="px-3 py-1.5 rounded-button text-xs font-semibold bg-apple-blue text-white">
                            Table
                        </span>
                    </div>
                </div>
            </header>

            {/* Table */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-apple-gray-50 dark:bg-apple-gray-900 border-b border-apple-gray-200 dark:border-white/10">
                        <tr>
                            <TableHeader field="id" label="#" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} width="w-20" />
                            <TableHeader field="title" label="Tytuł" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                            <TableHeader field="stage" label="Etap" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} width="w-48" />
                            <TableHeader field="date" label="Data" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} width="w-32" />
                            <th className="px-3 py-2 text-left w-16"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBills.map((process, idx) => (
                            <TableRow key={process.id} process={process} idx={idx} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TableHeader({
    field,
    label,
    sortField,
    sortDirection,
    onSort,
    width
}: {
    field: SortField;
    label: string;
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
    width?: string;
}) {
    const isActive = sortField === field;

    return (
        <th className={`px-3 py-2 text-left ${width || ""}`}>
            <button
                onClick={() => onSort(field)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue transition-colors group"
            >
                {label}
                <ArrowUpDown
                    size={12}
                    className={`transition-all ${isActive ? 'text-apple-blue' : 'opacity-0 group-hover:opacity-50'}`}
                />
            </button>
        </th>
    );
}

function TableRow({ process, idx }: { process: Bill; idx: number }) {
    const stage = process.kanbanStage || "Nieznany";

    return (
        <tr className={`border-b border-apple-gray-100 dark:border-white/5 hover:bg-apple-gray-50 dark:hover:bg-white/5 transition-colors group ${idx % 2 === 0 ? 'bg-white/50 dark:bg-transparent' : ''
            }`}>
            <td className="px-3 py-2.5">
                <span className="font-mono text-xs font-semibold text-apple-blue">#{process.id}</span>
            </td>
            <td className="px-3 py-2.5">
                <Link href={`/ustawy/${process.id}`} className="text-foreground hover:text-apple-blue transition-colors font-medium line-clamp-1">
                    {process.title}
                </Link>
            </td>
            <td className="px-3 py-2.5">
                <StageBadge stage={stage} />
            </td>
            <td className="px-3 py-2.5 text-apple-gray-600 dark:text-apple-gray-400 text-xs">
                {process.date || "—"}
            </td>
            <td className="px-3 py-2.5">
                <Link
                    href={`/ustawy/${process.id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-apple-blue hover:text-apple-blue/80"
                >
                    <ExternalLink size={14} />
                </Link>
            </td>
        </tr>
    );
}

function StageBadge({ stage }: { stage: string }) {
    const getColor = (s: string) => {
        const normalized = s.toLowerCase();
        if (normalized.includes("sejm")) return "text-apple-blue bg-apple-blue/10";
        if (normalized.includes("senat")) return "text-apple-purple bg-apple-purple/10";
        if (normalized.includes("prezydent")) return "text-apple-orange bg-apple-orange/10";
        if (normalized.includes("publikacja")) return "text-apple-green bg-apple-green/10";
        return "text-apple-gray-700 dark:text-apple-gray-300 bg-apple-gray-200 dark:bg-white/10";
    };

    return (
        <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${getColor(stage)}`}>
            {stage}
        </span>
    );
}
