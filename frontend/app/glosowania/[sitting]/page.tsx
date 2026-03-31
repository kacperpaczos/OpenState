import { getSittingVotings } from "@/lib/votings";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ sitting: string }>;
}

export default async function SittingPage({ params }: PageProps) {
    const { sitting } = await params;
    const votings = await getSittingVotings(parseInt(sitting));

    // Sort by voting number (desc)
    votings.sort((a, b) => b.votingNumber - a.votingNumber);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <Link href="/glosowania" className="flex items-center text-gray-400 hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do listy posiedzeń
            </Link>

            <header className="mb-12">
                <span className="text-blue-500 font-mono mb-2 block">X Kadencja Sejmu</span>
                <h1 className="text-4xl font-bold text-foreground">
                    Posiedzenie nr <span className="text-gradient">{sitting}</span>
                </h1>
                <p className="text-gray-400 mt-2">
                    Liczba głosowań: {votings.length}
                </p>
            </header>

            <div className="space-y-4">
                {votings.map((v) => (
                    <div key={v.votingNumber} className="glass-card p-6 flex items-start gap-4">
                        <div className="w-16 flex-shrink-0 text-center">
                            <div className="text-xs text-gray-500 uppercase font-bold">Nr</div>
                            <div className="text-2xl font-bold text-foreground">{v.votingNumber}</div>
                        </div>
                        <div className="flex-grow">
                            <div className="text-xs text-gray-500 mb-1">{v.date} • {v.kind}</div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                {v.title}
                            </h3>
                            {v.topic && <p className="text-gray-400 text-sm">{v.topic}</p>}
                        </div>
                        <div className="flex-shrink-0 self-center">
                            {/* Button to detail could go here if implemented, or just link rows */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
