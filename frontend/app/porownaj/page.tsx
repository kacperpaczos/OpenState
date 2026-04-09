import { getParliamentMembers } from "@/lib/mps";
import { getVotesForMP } from "@/lib/votes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, CheckCircle, XCircle, MinusCircle, UserX, ArrowRightLeft } from "lucide-react";
import { VoteRecord } from "@/lib/votes";
import MPCompareSelector from "@/components/porownaj/MPCompareSelector";
import { PARTY_COLORS } from "@/lib/constants";
import { getVotesForSenator } from "@/lib/votes";

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

import { Suspense } from "react";

export default async function ComparePage({ searchParams }: PageProps) {
    const { a, b } = await searchParams;

    const idA = a ? parseInt(a) : null;
    const idB = b ? parseInt(b) : null;

    if (!idA || !idB || isNaN(idA) || isNaN(idB)) {
        // Show picker page
        const mps = await getParliamentMembers();
        const activeMPs = mps.filter((m: any) => m.active !== false);
        return (
            <div className="min-h-screen pt-20 px-4">
                <Suspense fallback={<div className="p-8 text-center">Inicjalizacja porównywarki...</div>}>
                    <MPCompareSelector mps={activeMPs} prefilledA={a} prefilledB={b} />
                </Suspense>
            </div>
        );
    }

    const [mps, votesA, votesB] = await Promise.all([
        getParliamentMembers(),
        null, // placeholder for votes
        null, // placeholder for votes
    ]);

    const mpA = mps.find(m => m.id === String(idA));
    const mpB = mps.find(m => m.id === String(idB));

    if (!mpA || !mpB) return notFound();

    // Fetch votes based on chamber
    const [actualVotesA, actualVotesB] = await Promise.all([
        mpA.chamber === 'Senat' ? getVotesForSenator(mpA.id) : getVotesForMP(idA),
        mpB.chamber === 'Senat' ? getVotesForSenator(mpB.id) : getVotesForMP(idB),
    ]);

    const { agree, disagree, total, pct } = computeAgreement(actualVotesA, actualVotesB);

    // Find most controversial votes (where they disagreed)
    const mapB = new Map<string, VoteRecord>(
        actualVotesB.map(v => [`${v.sitting}-${v.votingNumber}`, v])
    );
    const diffs = actualVotesA
        .filter(va => {
            const vb = mapB.get(`${va.sitting}-${va.votingNumber}`);
            return vb && va.vote !== vb.vote && va.vote !== "ABSENT" && vb.vote !== "ABSENT";
        })
        .slice(0, 20);

    const agreementColor = pct === null ? "text-gray-400"
        : pct >= 80 ? "text-green-400"
            : pct >= 60 ? "text-yellow-400"
                : "text-red-400";

    const getSafePhoto = (mp: any) => {
        if (!mp.photoUrl) return null;
        if (mp.chamber === 'Senat') return `/api/image-proxy?url=${encodeURIComponent(mp.photoUrl)}`;
        return mp.photoUrl;
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 fade-in">
            <Link href="/poslowie" className="flex items-center text-gray-400 hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Powrót do Listy
            </Link>

            {/* Header */}
            <div className="glass-card p-0 overflow-hidden mb-6">
                <div className="p-8 pb-12 relative overflow-hidden">
                    {/* Background decorations based on parties */}
                    <div className="absolute top-0 left-0 w-1/2 h-full opacity-10" style={{ background: PARTY_COLORS[mpA.club] || '#86868b' }}></div>
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10" style={{ background: PARTY_COLORS[mpB.club] || '#86868b' }}></div>
                    
                    <p className="text-xs text-gray-500 uppercase font-black mb-6 flex items-center justify-center gap-2 relative z-10">
                        <Users size={14} /> Porównanie Parlamentarzystów
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <Link href={mpA.chamber === 'Senat' ? '#' : `/poslowie/${idA}`} className="flex-1 flex flex-col items-center group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-border mb-4 shadow-xl group-hover:scale-105 transition-transform">
                                <img src={getSafePhoto(mpA) || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="text-2xl font-black text-center group-hover:text-blue-500 transition-colors leading-tight">{mpA.name}</div>
                            <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">{mpA.chamber} • {mpA.club}</div>
                        </Link>

                        <div className="text-center px-6 py-4 bg-surface-color-heavy rounded-3xl shadow-apple-sm border border-surface-border">
                            <div className={`text-6xl font-black ${agreementColor} tracking-tighter`}>
                                {pct !== null ? `${pct}%` : "–"}
                            </div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">zgodność</div>
                        </div>

                        <Link href={mpB.chamber === 'Senat' ? '#' : `/poslowie/${idB}`} className="flex-1 flex flex-col items-center group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-border mb-4 shadow-xl group-hover:scale-105 transition-transform">
                                <img src={getSafePhoto(mpB) || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="text-2xl font-black text-center group-hover:text-blue-500 transition-colors leading-tight">{mpB.name}</div>
                            <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">{mpB.chamber} • {mpB.club}</div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-6 text-center group hover:bg-green-500/5 transition-colors">
                    <div className="text-4xl font-black text-green-500">{agree}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Głosowali Tak Samo</div>
                </div>
                <div className="glass-card p-6 text-center group hover:bg-red-500/5 transition-colors">
                    <div className="text-4xl font-black text-red-500">{disagree}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Głosowali Inaczej</div>
                </div>
                <div className="glass-card p-6 text-center group hover:bg-surface-hover transition-colors">
                    <div className="text-4xl font-black text-foreground">{total}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Wspólne Głosowania</div>
                </div>
            </div>

            {/* Disagreements */}
            {diffs.length > 0 && (
                <div className="glass-card overflow-hidden !p-0">
                    <div className="p-6 border-b border-surface-border bg-surface-color/50">
                        <h2 className="font-black text-foreground uppercase tracking-widest text-sm">Rozbieżności w decyzjach (ostatnie {diffs.length})</h2>
                    </div>
                    <div className="divide-y divide-surface-border">
                        {diffs.map(va => {
                            const vb = mapB.get(`${va.sitting}-${va.votingNumber}`)!;
                            const cfgA = VOTE_LABEL[va.vote] ?? VOTE_LABEL.ABSENT;
                            const cfgB = VOTE_LABEL[vb.vote] ?? VOTE_LABEL.ABSENT;
                            return (
                                <Link
                                    key={`${va.sitting}-${va.votingNumber}`}
                                    href={mpA.chamber === 'Senat' ? '#' : `/glosowania/${va.sitting}/${va.votingNumber}`}
                                    className="flex items-start gap-4 px-6 py-5 hover:bg-surface-hover transition-all group"
                                >
                                    <div className="w-12 shrink-0 text-center">
                                        <div className="text-[10px] text-gray-600 font-black uppercase">{mpA.chamber === 'Senat' ? 'pos.' : 'pos.'}</div>
                                        <div className="text-lg font-black text-gray-400 leading-tight group-hover:text-blue-500 transition-colors">{va.sitting}</div>
                                        <div className="text-[10px] text-gray-600 font-bold">/{va.votingNumber}</div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">{va.title}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter truncate">{va.topic}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 bg-black/5 dark:bg-white/5 p-2 rounded-2xl">
                                        <div className="flex flex-col items-center min-w-[50px]">
                                            <span className={`text-[10px] font-black flex flex-col items-center gap-1 ${cfgA.cls}`}>
                                                {cfgA.icon}
                                                {cfgA.label}
                                            </span>
                                        </div>
                                        <span className="text-gray-400 font-black text-[10px]">VS</span>
                                        <div className="flex flex-col items-center min-w-[50px]">
                                            <span className={`text-[10px] font-black flex flex-col items-center gap-1 ${cfgB.cls}`}>
                                                {cfgB.icon}
                                                {cfgB.label}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {total === 0 && (
                <div className="glass-card p-20 text-center">
                    <div className="text-gray-400 mb-4 flex justify-center"><ArrowRightLeft size={48} className="opacity-20" /></div>
                    <div className="text-xl font-black text-gray-500 uppercase tracking-widest">Brak prowównywalnych danych</div>
                    <p className="text-sm text-gray-400 mt-2">Wybrani parlamentarzyści nie brali udziału w tych samych głosowaniach.</p>
                </div>
            )}
        </div>
    );
}
