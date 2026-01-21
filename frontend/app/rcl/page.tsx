import { getRclProjects } from "@/lib/rcl";
import Link from "next/link";
import { FileText, Calendar } from "lucide-react";

export default async function RclPage() {
    const projects = await getRclProjects();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">
                Rządowe Centrum <span className="text-gradient">Legislacji</span>
            </h1>

            <p className="text-gray-400 mb-8 max-w-2xl">
                Projekty ustaw i rozporządzeń będące na etapie prac rządowych, zanim trafią do laski marszałkowskiej.
            </p>

            <div className="grid gap-6">
                {projects.map((p) => (
                    <div key={p.id} className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                            <FileText />
                        </div>
                        <div className="flex-grow">
                            <div className="flex flex-wrap gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider
                                    ${p.status?.includes('konsultacje') ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}
                                `}>
                                    {p.status || "W toku"}
                                </span>
                                <span className="text-gray-500 text-xs flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {p.date}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {p.title}
                            </h3>
                            <div className="flex justify-between items-end mt-4">
                                <div className="text-sm text-gray-400">
                                    Wnioskodawca: <span className="text-gray-300">{p.applicant}</span>
                                    <br />
                                    Numer wykazu: {p.number}
                                </div>
                                <Link
                                    href={p.url}
                                    target="_blank"
                                    className="px-4 py-2 bg-surface-hover hover:bg-surface-border rounded-lg text-sm text-white transition-colors"
                                >
                                    Szczegóły RCL
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
