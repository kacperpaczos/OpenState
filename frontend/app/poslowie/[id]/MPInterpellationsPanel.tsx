import { getInterpellations } from "@/lib/interpellations";
import Link from "next/link";
import { MessageSquare, ExternalLink } from "lucide-react";

export default async function MPInterpellationsPanel({ mpName }: { mpName: string }) {
    const all = await getInterpellations();
    // Match by name — interpellations.from contains the full name string
    const mine = all
        .filter(i => i.from.some(f => f.toLowerCase().includes(mpName.toLowerCase().split(" ").slice(-1)[0])))
        .sort((a, b) => b.num - a.num)
        .slice(0, 50);

    if (mine.length === 0) {
        return (
            <div className="glass-card p-8 text-center opacity-70">
                <MessageSquare size={32} className="mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400 text-sm">Brak interpelacji lub dane nie są dostępne.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-4">{mine.length} interpelacji (maks. 50)</p>
            {mine.map(i => (
                <div key={i.num} className="glass-card p-5 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <span className="text-xs font-mono text-gray-500 mb-1 block">Nr {i.num} · {i.receiptDate}</span>
                            <h4 className="text-sm font-medium text-foreground line-clamp-2">{i.title}</h4>
                            {i.to?.[0] && (
                                <p className="text-xs text-gray-500 mt-1">Do: {i.to[0]}</p>
                            )}
                        </div>
                        {i.replies?.[0]?.key && (
                            <Link
                                href={`https://sejm.gov.pl/Sejm10.nsf/InterpelacjaTresc.xsp?key=${i.replies[0].key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                <ExternalLink size={14} />
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
