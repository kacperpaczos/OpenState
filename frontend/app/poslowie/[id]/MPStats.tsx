"use client";

import { VoteRecord } from "@/lib/votes";
import { TrendingUp, CheckCircle2, XCircle, MinusCircle, UserX } from "lucide-react";

interface MPStatsProps {
    votes: VoteRecord[];
}

interface StatBarProps {
    label: string;
    count: number;
    total: number;
    color: string;
    textColor: string;
}

function StatBar({ label, count, total, color, textColor }: StatBarProps) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold w-20 shrink-0 ${textColor}`}>{label}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-gray-400 w-14 text-right tabular-nums">
                {count} <span className="text-gray-600">({pct}%)</span>
            </span>
        </div>
    );
}

export default function MPStats({ votes }: MPStatsProps) {
    if (!votes || votes.length === 0) return null;

    const total = votes.length;
    const yes = votes.filter(v => v.vote === "YES").length;
    const no = votes.filter(v => v.vote === "NO").length;
    const abstain = votes.filter(v => v.vote === "ABSTAIN").length;
    const absent = votes.filter(v => v.vote === "ABSENT").length;
    const present = total - absent;
    const attendancePct = Math.round((present / total) * 100);

    // Attendance color based on value
    const attendanceColor =
        attendancePct >= 90 ? "text-green-400" :
            attendancePct >= 75 ? "text-yellow-400" :
                "text-red-400";

    return (
        <div className="glass-card p-6 mt-8">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-5">
                <TrendingUp size={18} className="text-accent-blue" />
                Statystyki Aktywności
                <span className="ml-auto text-xs text-gray-500 font-normal">{total} głosowań</span>
            </h3>

            {/* Attendance KPI */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Frekwencja</p>
                    <p className={`text-4xl font-bold mt-1 ${attendanceColor}`}>{attendancePct}%</p>
                    <p className="text-xs text-gray-500 mt-1">obecny na {present} z {total} głosowań</p>
                </div>
                {/* Donut ring (pure CSS) */}
                <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                        <circle
                            cx="18" cy="18" r="15.9" fill="none"
                            stroke={attendancePct >= 90 ? "#4ade80" : attendancePct >= 75 ? "#facc15" : "#f87171"}
                            strokeWidth="3"
                            strokeDasharray={`${attendancePct} ${100 - attendancePct}`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold ${attendanceColor}`}>{attendancePct}%</span>
                    </div>
                </div>
            </div>

            {/* Vote breakdown bars */}
            <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Rozkład głosów</p>
                <StatBar label="Za" count={yes} total={present} color="bg-green-500" textColor="text-green-400" />
                <StatBar label="Przeciw" count={no} total={present} color="bg-red-500" textColor="text-red-400" />
                <StatBar label="Wstrz." count={abstain} total={present} color="bg-yellow-400" textColor="text-yellow-400" />
            </div>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/10">
                <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full border border-green-500/20">
                    <CheckCircle2 size={12} /> {yes} ZA
                </span>
                <span className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20">
                    <XCircle size={12} /> {no} PRZECIW
                </span>
                <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-500/20">
                    <MinusCircle size={12} /> {abstain} WSTRZ.
                </span>
                <span className="flex items-center gap-1 text-xs bg-gray-800 text-gray-500 px-2.5 py-1 rounded-full border border-gray-700">
                    <UserX size={12} /> {absent} NIEOB.
                </span>
            </div>
        </div>
    );
}
