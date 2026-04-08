import { getSittingVotings } from "@/lib/votings";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import SittingVotingsList from "./SittingVotingsList";

interface PageProps {
    params: Promise<{ sitting: string }>;
}

export default async function SittingPage({ params }: PageProps) {
    const { sitting } = await params;
    const votings = await getSittingVotings(parseInt(sitting));

    // Newest first
    votings.sort((a, b) => b.votingNumber - a.votingNumber);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 fade-in">
            <Link href="/glosowania" className="flex items-center text-gray-500 hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do listy głosowań
            </Link>

            <header className="mb-8">
                <span className="text-blue-400 font-mono text-sm mb-2 block">X Kadencja Sejmu</span>
                <h1 className="text-4xl font-bold text-foreground">
                    Posiedzenie nr <span className="text-gradient">{sitting}</span>
                </h1>
            </header>

            {votings.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Calendar size={40} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 font-medium">Brak danych o głosowaniach dla tego posiedzenia.</p>
                    <p className="text-gray-600 text-sm mt-1">Dane mogą nie być jeszcze zaindeksowane.</p>
                </div>
            ) : (
                <SittingVotingsList votings={votings} sitting={sitting} />
            )}
        </div>
    );
}
