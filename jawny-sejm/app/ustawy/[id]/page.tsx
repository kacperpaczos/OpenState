import { getVotingRecord } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, MinusCircle, UserX, AlertCircle, Calendar, FileText } from "lucide-react";
import ClientVotingCharts from "./charts";
import fs from "fs";
import path from "path";

// Helper to load bill data
async function getBillData(id: string) {
    try {
        const filePath = path.join(process.cwd(), "public/data/bills", `${id}.json`);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.error("Failed to load bill data", e);
    }
    return null;
}

export default async function BillPage({ params }: { params: { id: string } }) {
    const bill = await getBillData(params.id);

    // Fallback to mock if file not found (or if we are on a version where fetch hasn't finished)
    // For now, if no bill, show error or fallback
    if (!bill) {
        // Try mock for legacy/demo support
        const mockVoting = await getVotingRecord(params.id);
        if (mockVoting) return <MockVotingView voting={mockVoting} />;

        return (
            <div className="max-w-6xl mx-auto pb-20 fade-in h-full overflow-y-auto custom-scrollbar">
                <Link href="/ustawy" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={16} /> Powrót do listy
                </Link>
                <div className="p-20 text-center text-gray-500 glass-card">
                    <h2 className="text-xl font-bold mb-2">Brak danych szczegółowych</h2>
                    <p>Dane dla procesu {params.id} nie zostały jeszcze pobrane.</p>
                    <p className="text-sm mt-4 text-gray-600">Uruchom: python3 scripts/fetch_bills.py</p>
                </div>
            </div>
        );
    }

    // Extract Voting Data from Stages
    let lastVotingStage = bill.stages?.find((s: any) => s.voting);
    // Sometimes voting is deep, but usually top level stage has 'voting' key if it happened

    // Format Data for View
    const voting = lastVotingStage?.voting;
    const stats = voting ? {
        yes: voting.yes,
        no: voting.no,
        abstain: voting.abstain,
        absent: voting.notParticipating || (460 - (voting.yes + voting.no + voting.abstain))
    } : null;

    const documentType = bill.documentType;
    const title = bill.title;

    return (
        <div className="max-w-6xl mx-auto pb-20 fade-in h-full overflow-y-auto custom-scrollbar">
            <Link href="/ustawy" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={16} /> Powrót do listy
            </Link>

            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {documentType}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Calendar size={14} /> {bill.processStartDate}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{title}</h1>

                {/* Legislative Sources & Links */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {bill.rclLink && (
                        <a href={bill.rclLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-900/40 transition-colors">
                            <span className="font-bold">RCL</span>
                            <span className="text-xs opacity-70">({bill.rclNum})</span>
                        </a>
                    )}
                    {bill.displayAddress && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900/20 text-yellow-500 border border-yellow-500/30 rounded-lg">
                            <span className="font-bold">Dziennik Ustaw:</span>
                            <span className="font-mono">{bill.displayAddress}</span>
                        </div>
                    )}
                    <a href={`https://www.sejm.gov.pl/Sejm10.nsf/PrzebiegProcedury.xsp?nr=${bill.number}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-900/40 transition-colors">
                        Oficjalna strona Sejmu
                    </a>
                </div>

                <div className="text-lg text-gray-300 leading-relaxed max-w-4xl glass-card p-6 border-l-4 border-blue-500">
                    <h3 className="text-sm uppercase text-gray-500 font-bold mb-2 flex items-center gap-2">
                        <FileText size={16} /> Opis Projektu
                    </h3>
                    {bill.description || "Brak opisu."}
                </div>

                {/* Data Warning */}
                {!bill.stages?.some((s: any) => s.stageName?.includes("Komisj") && s.stageName?.includes("Senat")) && bill.stages?.some((s: any) => s.stageName?.includes("Senat")) && (
                    <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/20 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                        <div className="text-sm text-gray-400">
                            <span className="text-orange-400 font-bold">Uwaga o danych:</span> API Sejmu nie udostępnia szczegółowego przebiegu prac w komisjach senackich.
                            Prezentujemy jedynie ostateczne stanowisko Senatu. Pełna historia prac senackich dostępna jest na stronie <a href="https://senat.gov.pl" target="_blank" className="underline hover:text-white">senat.gov.pl</a>.
                        </div>
                    </div>
                )}
            </header>

            {/* Voting Section */}
            {stats ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Result Chart */}
                    <div className="glass-card p-6 flex flex-col items-center justify-center relative">
                        <h3 className="section-title absolute top-6 left-6 w-full">Wynik Głosowania</h3>
                        <ClientVotingCharts
                            data={[
                                { name: 'Za', value: stats.yes, color: '#22c55e' },
                                { name: 'Przeciw', value: stats.no, color: '#ef4444' },
                                { name: 'Wstrzymał', value: stats.abstain, color: '#94a3b8' },
                                { name: 'Nieobecny', value: stats.absent, color: '#334155' },
                            ]}
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-4">
                            <span className="text-3xl font-bold text-white block">{stats.yes}</span>
                            <span className="text-xs text-green-500 uppercase font-bold">Głosów Za</span>
                        </div>
                    </div>

                    {/* Detailed Stats Cards */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        <StatCard label="Przeciw" count={stats.no} icon={XCircle} color="text-red-500" />
                        <StatCard label="Wstrzymało się" count={stats.abstain} icon={MinusCircle} color="text-gray-400" />
                        <StatCard label="Nieobecnych" count={stats.absent} icon={UserX} color="text-gray-600" />
                        <StatCard label="Decyzja" count={lastVotingStage.decision === 'przyjęto' ? 'Przyjęta' : 'Odrzucona'} icon={AlertCircle} color="text-blue-400" sub="Wynik" />
                    </div>
                </div>
            ) : (
                <div className="glass-card p-8 text-center mb-8">
                    <p className="text-gray-400">Ten projekt nie był jeszcze poddany głosowaniu.</p>
                </div>
            )}

            {/* Timeline / Stages (Bonus) */}
            <div className="glass-card overflow-hidden mt-8">
                <div className="p-4 border-b border-white/10">
                    <h3 className="font-semibold text-white">Przebieg Procesu</h3>
                </div>
                <div className="p-4">
                    <div className="space-y-4">
                        {bill.stages?.map((stage: any, i: number) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-24 text-sm text-gray-500 text-right">{stage.date}</div>
                                <div className="border-l-2 border-white/10 pl-4 pb-4 relative">
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div className="text-white font-medium">{stage.stageName}</div>
                                    {stage.decision && <div className="text-xs text-gray-400 mt-1">Decyzja: {stage.decision}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

// Re-use logic for Mock (Legacy)
function MockVotingView({ voting }: { voting: any }) {
    return (
        <div className="max-w-6xl mx-auto pb-20 fade-in h-full overflow-y-auto">
            <Link href="/ustawy" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={16} /> Powrót do listy (Mock)
            </Link>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">{voting.title}</h1>
                <p className="text-xl text-gray-300">{voting.description}</p>
            </header>
            <div className="glass-card p-8 text-center">
                <p>To jest widok przykładowy (Mock Data). Pobierz prawdziwe dane by zobaczyć szczegóły.</p>
            </div>
        </div>
    )
}

function StatCard({ label, count, icon: Icon, color, sub }: any) {
    return (
        <div className="glass-card p-5 flex items-center justify-between">
            <div>
                <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">{label}</span>
                <span className={`text-2xl font-bold ${color}`}>{count}</span>
                {sub && <span className="text-xs text-gray-600 block">{sub}</span>}
            </div>
            <Icon className={`opacity-20 ${color}`} size={40} />
        </div>
    )
}

function VoteBadge({ vote }: { vote: string }) {
    let styles = "bg-gray-800 text-gray-400 border-gray-700";
    if (vote === "Za") styles = "bg-green-500/10 text-green-400 border-green-500/20";
    if (vote === "Przeciw") styles = "bg-red-500/10 text-red-400 border-red-500/20";
    if (vote === "Wstrzymał") styles = "bg-gray-500/10 text-gray-300 border-gray-500/20";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles}`}>
            {vote}
        </span>
    )
}
