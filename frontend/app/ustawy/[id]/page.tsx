import { getProcess } from "@/lib/processes";
import ProcessTimeline from "./ProcessTimeline";
import DiffViewer from "@/components/DiffViewer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, Euro, MapPin, GitCompare } from "lucide-react";

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const process = await getProcess(id);

    if (!process) {
        return notFound();
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 fade-in">
            <Link href="/ustawy" className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground mb-6 transition-colors font-medium">
                <ArrowLeft size={18} /> Powrót do listy
            </Link>

            <header className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-sm font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">
                        Druk {process.id}
                    </span>
                    <span className="bg-surface-color text-text-secondary border border-surface-border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {process.documentType}
                    </span>
                    {process.isEU && (
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                            <Euro size={12} /> Dyrektywa UE
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                    {process.title}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-text-secondary border-y border-surface-border py-4 mb-8">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span>Data wpływu: <span className="text-foreground font-medium">{process.date}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-500" />
                        <span>Kadencja: <span className="text-foreground font-medium">{process.term}.</span></span>
                    </div>
                    {process.urgency !== 'normalny' && (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span>Tryb: <span className="text-red-400 font-medium">{process.urgency}</span></span>
                        </div>
                    )}

                    <div className="ml-auto flex items-center gap-4">
                        {process.isapLink && (
                            <a href={process.isapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                                <FileText size={16} />
                                Dziennik Ustaw
                            </a>
                        )}

                        <a href={`https://www.sejm.gov.pl/Sejm10.nsf/PrzebiegProcedury.xsp?nr=${process.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent-blue transition-colors">
                            <MapPin size={16} />
                            Strona Sejmowa
                        </a>
                    </div>
                </div>

                {process.description && (
                    <div className="glass-card p-6 border-l-4 border-accent-blue mb-8">
                        <h3 className="text-xs uppercase text-gray-500 font-bold mb-2 flex items-center gap-2">
                            <FileText size={14} /> Opis
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {process.description}
                        </p>
                    </div>
                )}
            </header>

            <ProcessTimeline process={process} />

            {/* Version Comparison */}
            <div className="mt-12">
                <h2 className="text-headline font-semibold text-foreground mb-4 flex items-center gap-2">
                    <GitCompare className="text-apple-blue" size={24} />
                    Porównanie Wersji
                </h2>
                <DiffViewer billId={process.id} />
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
                * Dane pochodzą z Systemu Informacyjnego Sejmu (API).
            </div>
        </div>
    );
}
