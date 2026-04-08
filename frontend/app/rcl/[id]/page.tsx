import { getRclProject } from "@/lib/rcl";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, User, ExternalLink, Activity, Download } from "lucide-react";

export default async function RclProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getRclProject(id);

    if (!project) {
        return notFound();
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 fade-in px-4 pt-10">
            <Link href="/rcl" className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground mb-6 transition-colors font-medium">
                <ArrowLeft size={18} /> Powrót do listy
            </Link>

            {/* Header */}
            <div className="glass-card p-8 mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider
                        ${project.status?.includes('konsultacje') ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}
                    `}>
                        {project.status || "W toku"}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded">
                        <Calendar size={14} /> {project.date}
                    </span>
                    <span className="text-gray-500 text-sm font-mono bg-white/5 px-2.5 py-1 rounded">
                        Nr: {project.number}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                    {project.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <User size={18} className="text-gray-500" />
                        <span>Wnioskodawca: <span className="font-semibold text-foreground">{project.applicant}</span></span>
                    </div>

                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Strona źródłowa <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content - Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description if available */}
                    {project.description && (
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <FileText className="text-blue-500" /> Opis projektu
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {project.description}
                            </p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Activity className="text-green-500" /> Przebieg procesu
                        </h2>

                        <div className="relative pl-4 space-y-8">
                            {/* Vertical Line */}
                            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-black/10 dark:bg-white/10"></div>

                            {project.stages && project.stages.length > 0 ? (
                                project.stages.map((stage, idx) => (
                                    <div key={idx} className="relative flex gap-4">
                                        <div className={`
                                            relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-black
                                            ${stage.status === 'success' || stage.status === 'current'
                                                ? 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                                : 'border-gray-600 text-gray-600'}
                                        `}>
                                            <div className={`w-2 h-2 rounded-full ${stage.status === 'success' ? 'bg-green-500' : 'bg-transparent'}`}></div>
                                        </div>
                                        <div className="flex-1 pt-0.5">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-semibold ${stage.status === 'current' ? 'text-green-500' : 'text-gray-600 dark:text-gray-200'}`}>
                                                    {stage.name}
                                                </h3>
                                                {stage.date && (
                                                    <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                                                        {stage.date}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">Brak szczegółowych danych o przebiegu.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Documents */}
                <div className="space-y-6">
                    <div className="glass-card p-6 sticky top-6">
                        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <Download className="text-purple-500" /> Dokumenty
                        </h2>

                        {project.documents && project.documents.length > 0 ? (
                            <div className="space-y-3">
                                {project.documents.map((doc, i) => (
                                    <a
                                        key={i}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 hover:border-purple-500/30 transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <FileText size={18} className="text-gray-400 group-hover:text-purple-400 mt-0.5 flex-shrink-0" />
                                            <div className="overflow-hidden">
                                                <div className="text-sm text-text-secondary group-hover:text-foreground truncate" title={doc.title}>
                                                    {doc.title}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">Pobierz plik</div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">Brak załączonych dokumentów.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-gray-600 text-sm">
                * Dane pochodzą z serwisu Rządowego Centrum Legislacji.
            </div>
        </div>
    );
}
