"use client";

import { Senator } from "@/lib/senators";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function SenatorDetailView({ senator }: { senator: Senator }) {
    return (
        <div className="max-w-4xl mx-auto pb-20 fade-in h-screen overflow-y-auto custom-scrollbar">
            <Link href="/senatorowie" className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground mb-6 transition-colors font-medium">
                <ArrowLeft size={18} /> Powrót do listy
            </Link>

            <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-surface-border shadow-2xl shrink-0 bg-gray-800">
                        {senator.photoUrl ? (
                            <img src={senator.photoUrl} alt={senator.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-color/10 text-gray-400">
                                Brak zdjęcia
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                Senator RP
                            </span>
                            <h1 className="text-4xl font-bold text-foreground leading-tight">{senator.name}</h1>
                        </div>

                        <div className="space-y-2 text-lg">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <span className="font-semibold text-foreground">Klub:</span>
                                <span>{senator.club || "Niezrzeszony"}</span>
                            </div>
                            {senator.district && (
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <span className="font-semibold text-foreground">Okręg:</span>
                                    <span>{senator.district}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 flex flex-wrap gap-4">
                            {senator.email && (
                                <a href={`mailto:${senator.email}`} className="flex items-center gap-2 px-5 py-2.5 bg-surface-color border border-surface-border rounded-xl hover:bg-white/10 transition-colors text-foreground font-medium shadow-sm">
                                    <Mail size={18} className="text-accent-blue" />
                                    Wyślij wiadomość
                                </a>
                            )}
                            <a href={senator.detailsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-surface-color border border-surface-border rounded-xl hover:bg-white/10 transition-colors text-foreground font-medium shadow-sm">
                                <MapPin size={18} className="text-gray-500" />
                                Strona Senatu
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
