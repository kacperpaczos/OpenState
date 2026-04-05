import { getVotingsForBill } from "@/lib/votings";
import { VotingSummary } from "@/lib/votings";
import Link from "next/link";
import { Vote, CheckCircle, XCircle, MinusCircle } from "lucide-react";

function VoteBadge({ title }: { title: string }) {
    const t = title.toLowerCase();
    if (t.includes("przyjęt") || t.includes("uchwalon")) {
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-green-500/10 text-green-400 border-green-500/20 flex-shrink-0">Przyjęto</span>;
    }
    if (t.includes("odrzucon")) {
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/20 flex-shrink-0">Odrzucono</span>;
    }
    return null;
}

export default async function RelatedVotings({ billId }: { billId: string }) {
    const votings = await getVotingsForBill(billId);

    if (votings.length === 0) return null;

    return (
        <div className="glass-card overflow-hidden mt-8">
            <div className="p-5 border-b border-surface-border flex items-center gap-2">
                <Vote size={18} className="text-accent-blue" />
                <h2 className="font-semibold text-foreground">Powiązane Głosowania</h2>
                <span className="ml-auto text-xs text-gray-500 bg-surface-color px-2 py-1 rounded">{votings.length}</span>
            </div>
            <div className="divide-y divide-white/5">
                {votings.map(v => (
                    <Link
                        key={`${v.sitting}-${v.votingNumber}`}
                        href={`/glosowania/${v.sitting}/${v.votingNumber}`}
                        className="flex items-start gap-4 px-5 py-4 hover:bg-white/5 transition-colors group"
                    >
                        <div className="w-12 shrink-0 text-center">
                            <div className="text-[10px] text-gray-600 uppercase font-mono">pos.</div>
                            <div className="text-lg font-bold text-gray-400 leading-none">{v.sitting}</div>
                            <div className="text-[10px] text-gray-600">/{v.votingNumber}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-blue-300 transition-colors">{v.title}</p>
                            {v.topic && <p className="text-xs text-gray-500 mt-0.5">{v.topic}</p>}
                            <p className="text-[10px] text-gray-600 mt-1">{v.date} · {v.kind}</p>
                        </div>
                        <VoteBadge title={v.title} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
