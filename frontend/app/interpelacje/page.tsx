import { getInterpellations } from "@/lib/interpellations";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function InterpellationsPage() {
    const interpellations = await getInterpellations();

    // Sort by number descending
    const sorted = interpellations.sort((a, b) => b.num - a.num);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">
                Interpelacje <span className="text-gradient">Poselskie</span>
            </h1>

            <div className="glass-card mb-8 p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Szukaj w interpelacjach (tytuł, autor)..."
                        className="w-full pl-12 pr-4 py-3 bg-surface-color border border-surface-border rounded-xl text-white focus:ring-2 focus:ring-purple-500/50"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {sorted.slice(0, 50).map((i) => (
                    <div key={i.num} className="glass-card p-6 hover:bg-surface-color/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono text-gray-400">Nr {i.num} • {i.receiptDate}</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300">
                                {i.to && i.to[0]}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {i.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Zgłaszający: {i.from.join(", ")}
                        </p>
                        <Link
                            href={`https://sejm.gov.pl/Sejm10.nsf/InterpelacjaTresc.xsp?key=${i.replies?.[0]?.key || i.num}`}
                            target="_blank"
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                            Zobacz na stronie Sejmu →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
