import { getMPs } from "@/lib/mps";
import { getVotesForMP } from "@/lib/votes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, CheckCircle, XCircle, MinusCircle, UserX } from "lucide-react";
import { VoteRecord } from "@/lib/votes";

interface PageProps {
    searchParams: Promise<{ a?: string; b?: string }>;
}

function computeAgreement(votesA: VoteRecord[], votesB: VoteRecord[]) {
    // Build maps: key = `${sitting}-${votingNumber}` → vote
    const mapB = new Map<string, string>(
        votesB.map(v => [`${v.sitting}-${v.votingNumber}`, v.vote])
    );
    let agree = 0, disagree = 0, total = 0;
    for (const va of votesA) {
        const key = `${va.sitting}-${va.votingNumber}`;
        const vb = mapB.get(key);
        if (!vb) continue;
        // Count only when at least one of them actually voted (not both absent)
        if (va.vote === "ABSENT" && vb === "ABSENT") continue;
        total++;
        if (va.vote === vb) agree++;
        else if (va.vote !== "ABSENT" && vb !== "ABSENT") disagree++;
    }
    return { agree, disagree, total, pct: total > 0 ? Math.round((agree / total) * 100) : null };
}

const VOTE_LABEL: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    YES: { label: "ZA", icon: <CheckCircle size={14} className="text-green-500" />, cls: "text-green-400" },
    NO: { label: "PRZECIW", icon: <XCircle size={14} className="text-red-500" />, cls: "text-red-400" },
    ABSTAIN: { label: "WSTRZ.", icon: <MinusCircle size={14} className="text-yellow-400" />, cls: "text-yellow-400" },
    ABSENT: { label: "NIEOB.", icon: <UserX size={14} className="text-gray-600" />, cls: "text-gray-500" },
};

export default async function ComparePage({ searchParams }: PageProps) {
    const { a, b } = await searchParams;

    const idA = a ? parseInt(a) : null;
    const idB = b ? parseInt(b) : null;

    if (!idA || !idB || isNaN(idA) || isNaN(idB)) {
        // Show picker page
        const mps = await getMPs();
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 fade-in text-center">
                <h1 className="text-4xl font-bold mb-4">Porównaj Posłów</h1>
                <p className="text-gray-400 mb-8">
                    Wybierz dwóch posłów, aby zobaczyć jak często głosowali tak samo.
                </p>
                <p className="text-sm text-gray-500">
                    Użyj adresu URL: <span className="font-mono text-blue-400">/porownaj?a=[id1]&b=[id2]</span>
                </p>
                <div className="glass-card p-6 mt-8 text-left">
                    <p className="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wide">Przykłady</p>
                    {mps.slice(0, 6).map(mp => (
                        <div key={mp.id} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                            <span className="text-sm text-foreground">{mp.name}</span>
                            <span className="font-mono text-xs text-gray-500">id: {mp.id}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const [mps, votesA, votesB] = await Promise.all([
        getMPs(),
        getVotesForMP(idA),
        getVotesForMP(idB),
    ]);

    const mpA = mps.find(m => m.id === String(idA));
    const mpB = mps.find(m => m.id === String(idB));

    if (!mpA || !mpB) return notFound();

    const { agree, disagree, total, pct } = computeAgreement(votesA, votesB);

    // Find most controversial votes (where they disagreed)
    const mapB = new Map<string, VoteRecord>(
        votesB.map(v => [`${v.sitting}-${v.votingNumber}`, v])
    );
    const diffs = votesA
        .filter(va => {
            const vb = mapB.get(`${va.sitting}-${va.votingNumber}`);
            return vb && va.vote !== vb.vote && va.vote !== "ABSENT" && vb.vote !== "ABSENT";
        })
        .slice(0, 20);

    const agreementColor = pct === null ? "text-gray-400"
        : pct >= 80 ? "text-green-400"
            : pct >= 60 ? "text-yellow-400"
                : "text-red-400";

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
            <Link href="/poslowie" className="flex items-center text-gray-400 hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Powrót do Posłów
            </Link>

            {/* Header */}
            <div className="glass-card p-8 mb-6">
                <p className="text-xs text-gray-500 uppercase font-bold mb-4 flex items-center gap-2">
                    <Users size={14} /> Porównanie Posłów
                </p>
                <div className="flex items-center justify-between gap-4">
                    <Link href={`/poslowie/${idA}`} className="flex-1 text-center hover:text-blue-400 transition-colors">
                        <div className="text-2xl font-bold">{mpA.name}</div>
                        <div className="text-sm text-gray-500">{mpA.club}</div>
                    </Link>
                    <div className="text-center px-6">
                        <div className={`text-6xl font-black ${agreementColor}`}>
                            {pct !== null ? `${pct}%` : "–"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">zgodność</div>
                    </div>
                    <Link href={`/poslowie/${idB}`} className="flex-1 text-center hover:text-blue-400 transition-colors">
                        <div className="text-2xl font-bold">{mpB.name}</div>
                        <div className="text-sm text-gray-500">{mpB.club}</div>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">{agree}</div>
                    <div className="text-xs text-gray-500 mt-1">Tak samo</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-3xl font-bold text-red-400">{disagree}</div>
                    <div className="text-xs text-gray-500 mt-1">Inaczej</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-3xl font-bold text-foreground">{total}</div>
                    <div className="text-xs text-gray-500 mt-1">Razem porównano</div>
                </div>
            </div>

            {/* Disagreements */}
            {diffs.length > 0 && (
                <div className="glass-card overflow-hidden">
                    <div className="p-5 border-b border-surface-border">
                        <h2 className="font-semibold text-foreground">Rozbieżności (ostatnie {diffs.length})</h2>
                    </div>
                    <div className="divide-y divide-surface-border">
                        {diffs.map(va => {
                            const vb = mapB.get(`${va.sitting}-${va.votingNumber}`)!;
                            const cfgA = VOTE_LABEL[va.vote] ?? VOTE_LABEL.ABSENT;
                            const cfgB = VOTE_LABEL[vb.vote] ?? VOTE_LABEL.ABSENT;
                            return (
                                <Link
                                    key={`${va.sitting}-${va.votingNumber}`}
                                    href={`/glosowania/${va.sitting}/${va.votingNumber}`}
                                    className="flex items-start gap-4 px-5 py-4 hover:bg-surface-hover transition-colors group"
                                >
                                    <div className="w-10 shrink-0 text-center">
                                        <div className="text-[10px] text-gray-600 font-mono">pos.</div>
                                        <div className="text-base font-bold text-gray-400 leading-tight">{va.sitting}</div>
                                        <div className="text-[10px] text-gray-600">/{va.votingNumber}</div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{va.title}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-xs font-bold flex items-center gap-1 ${cfgA.cls}`}>{cfgA.icon}{cfgA.label}</span>
                                        <span className="text-gray-600">vs</span>
                                        <span className={`text-xs font-bold flex items-center gap-1 ${cfgB.cls}`}>{cfgB.icon}{cfgB.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {total === 0 && (
                <div className="glass-card p-8 text-center text-gray-500">
                    Brak wspólnych głosowań do porównania.
                </div>
            )}
        </div>
    );
}
