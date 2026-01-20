"use client";

import { VoteRecord } from "@/lib/votes";
import { CheckCircle, XCircle, MinusCircle, UserX, AlertCircle } from "lucide-react";

export default function VotingHistory({ votes }: { votes: VoteRecord[] }) {
    if (!votes || votes.length === 0) {
        return (
            <div className="glass-card p-8 text-center opacity-70">
                <h3 className="text-xl font-bold text-foreground mb-2">Historia Głosowań</h3>
                <p className="text-text-secondary">Brak danych o ostatnich głosowaniach.</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden mt-8">
            <div className="p-6 border-b border-surface-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle size={18} className="text-accent-blue" />
                    Ostatnie Głosowania
                </h3>
                <span className="text-xs text-gray-500 bg-surface-color px-2 py-1 rounded">
                    {votes.length} wyników
                </span>
            </div>

            <div className="divide-y divide-white/5">
                {votes.map((vote, i) => (
                    <div key={`${vote.sitting}-${vote.votingNumber}`} className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                        <div className="pt-1">
                            {vote.vote === 'YES' && <CheckCircle size={20} className="text-green-500" />}
                            {vote.vote === 'NO' && <XCircle size={20} className="text-red-500" />}
                            {vote.vote === 'ABSTAIN' && <MinusCircle size={20} className="text-gray-400" />}
                            {vote.vote === 'ABSENT' && <UserX size={20} className="text-gray-600" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-medium text-foreground leading-snug">{vote.title}</h4>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ml-2 shrink-0
                                    ${vote.vote === 'YES' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        vote.vote === 'NO' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            vote.vote === 'ABSTAIN' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                                                'bg-gray-800 text-gray-500 border-gray-700'
                                    }`}>
                                    {vote.vote === 'YES' ? 'ZA' :
                                        vote.vote === 'NO' ? 'PRZECIW' :
                                            vote.vote === 'ABSTAIN' ? 'WSTRZYMAŁ' : 'NIEOBECNY'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                <span>{vote.date}</span>
                                <span>Posiedzenie {vote.sitting}, Głosowanie {vote.votingNumber}</span>
                                <span className="bg-white/5 px-1.5 rounded">{vote.topic}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
