import { getVotingDetails, getSittingVotings } from "@/lib/votings";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, MinusCircle, UserX } from "lucide-react";

interface PageProps {
    params: Promise<{ sitting: string; voting: string }>;
}

function VoteBar({ label, count, total, colorClass }: { label: string; count: number; total: number; colorClass: string }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className={`font-semibold ${colorClass}`}>{label}</span>
                <span className="text-foreground font-bold">{count} <span className="text-gray-500 font-normal">({pct}%)</span></span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${colorClass.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default async function VotingDetailPage({ params }: PageProps) {
    const { sitting, voting } = await params;
    const sittingNum = parseInt(sitting);
    const votingNum = parseInt(voting);

    const details = await getVotingDetails(sittingNum, votingNum);

    if (!details) {
        // Try to find basic info in sitting index
        const sittingVotings = await getSittingVotings(sittingNum);
        const basic = sittingVotings.find(v => v.votingNumber === votingNum);
        if (!basic) return notFound();

        // Show basic info without per-person breakdown
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
                <Link href={`/glosowania/${sitting}`} className="flex items-center text-gray-400 hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do posiedzenia {sitting}
                </Link>
                <div className="glass-card p-8">
                    <span className="text-gray-500 font-mono text-sm">Posiedzenie {sitting} / Głosowanie {voting}</span>
                    <h1 className="text-3xl font-bold text-foreground mt-2 mb-4">{basic.title}</h1>
                    {basic.topic && <p className="text-gray-400">{basic.topic}</p>}
                    <p className="text-gray-500 mt-6 text-sm">Szczegółowe dane o głosujących nie są jeszcze dostępne.</p>
                </div>
            </div>
        );
    }

    const votes: Array<{ MP: number; vote: string; club?: string }> = details.votes || [];
    const yes = votes.filter(v => v.vote === "YES").length;
    const no = votes.filter(v => v.vote === "NO").length;
    const abstain = votes.filter(v => v.vote === "ABSTAIN").length;
    const absent = votes.filter(v => v.vote === "ABSENT").length;
    const total = votes.length;

    const result = yes > no ? "passed" : no > yes ? "rejected" : "tie";

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
            <Link href={`/glosowania/${sitting}`} className="flex items-center text-gray-400 hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do posiedzenia {sitting}
            </Link>

            {/* Header */}
            <div className="glass-card p-8 mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="text-blue-400 font-mono text-sm">Posiedzenie {sitting} · Głosowanie nr {voting}</span>
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${result === "passed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            result === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}>
                        {result === "passed" ? "✓ Przyjęto" : result === "rejected" ? "✗ Odrzucono" : "Remis"}
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{details.title}</h1>
                {details.topic && <p className="text-gray-400 text-sm">{details.topic}</p>}
                <p className="text-gray-500 text-xs mt-3">{details.date} · {details.kind}</p>
            </div>

            {/* Result bars */}
            <div className="glass-card p-6 mb-6 space-y-4">
                <h2 className="font-semibold text-foreground mb-4">Wynik głosowania</h2>
                <VoteBar label="Za" count={yes} total={total} colorClass="text-green-400" />
                <VoteBar label="Przeciw" count={no} total={total} colorClass="text-red-400" />
                <VoteBar label="Wstrzymało się" count={abstain} total={total} colorClass="text-yellow-400" />
                <VoteBar label="Nieobecni" count={absent} total={total} colorClass="text-gray-500" />
            </div>

            {/* Per-person breakdown */}
            {votes.length > 0 && (
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-surface-border">
                        <h2 className="font-semibold text-foreground">Głosowania posłów ({votes.length})</h2>
                    </div>
                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                        {votes.map((v) => (
                            <Link
                                key={v.MP}
                                href={`/poslowie/${v.MP}`}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors"
                            >
                                <div className="w-5 flex-shrink-0">
                                    {v.vote === "YES" && <CheckCircle size={18} className="text-green-500" />}
                                    {v.vote === "NO" && <XCircle size={18} className="text-red-500" />}
                                    {v.vote === "ABSTAIN" && <MinusCircle size={18} className="text-yellow-400" />}
                                    {v.vote === "ABSENT" && <UserX size={18} className="text-gray-600" />}
                                </div>
                                <span className="text-sm text-foreground flex-1">Poseł #{v.MP}</span>
                                {v.club && <span className="text-xs text-gray-500">{v.club}</span>}
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${v.vote === "YES" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                        v.vote === "NO" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                            v.vote === "ABSTAIN" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                                "bg-gray-800 text-gray-500 border-gray-700"
                                    }`}>
                                    {v.vote === "YES" ? "ZA" : v.vote === "NO" ? "PRZEC" : v.vote === "ABSTAIN" ? "WSTRZ" : "NIEOB"}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
