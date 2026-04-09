"use client";

import { MP } from "@/lib/mps";
import { ArrowLeft, Mail, MapPin, GitCompare, User } from "lucide-react";
import Link from "next/link";
import { useCompare } from "@/lib/contexts/CompareContext";
import ComparisonDock from "@/components/compare/ComparisonDock";
import { PARTY_COLORS } from "@/lib/constants";

export default function MPDetailView({ mp }: { mp: MP }) {
    const { addToCompare, mpA, mpB } = useCompare();
    const isSelected = mpA?.id === mp.id || mpB?.id === mp.id;
    const accentColor = PARTY_COLORS[mp.club] || '#3b82f6'; // Fallback to blue

    const getSafePhoto = (mp: MP) => {
        if (!mp.photoUrl) return null;
        if (mp.chamber === 'Senat') return `/api/image-proxy?url=${encodeURIComponent(mp.photoUrl)}`;
        return mp.photoUrl;
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 fade-in">
            <Link href="/poslowie" className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground mb-6 transition-colors font-medium">
                <ArrowLeft size={18} /> Powrót do listy
            </Link>

            <div className={`glass-card p-8 md:p-12 relative overflow-hidden border-2 transition-colors duration-500 ${isSelected ? 'border-accent-blue/50 shadow-blue-500/10' : 'border-transparent'}`}>
                {/* Background Decor */}
                <div 
                    className="absolute top-0 right-0 w-64 h-64 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"
                    style={{ backgroundColor: accentColor }}
                ></div>

                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-surface-border shadow-2xl shrink-0 bg-surface-color flex items-center justify-center">
                        {mp.photoUrl ? (
                            <img src={getSafePhoto(mp)!} alt={mp.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-gray-500" />
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                            <span className={`inline-block px-3 py-1 ${mp.active !== false ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} border rounded-full text-xs font-bold uppercase tracking-wider`}>
                                {mp.active !== false ? `Aktywny ${mp.chamber === 'Senat' ? 'Senator' : 'Poseł'}` : "Status Nieaktywny"}
                            </span>
                            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                                {mp.chamber}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-foreground leading-tight">{mp.name}</h1>

                        <div className="space-y-2 text-lg">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <span className="font-semibold text-foreground">Klub / Koło:</span>
                                <span style={{ color: accentColor }} className="font-bold">{mp.club}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <span className="font-semibold text-foreground">Okręg:</span>
                                <span>{mp.district}</span>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-wrap gap-3">
                            {mp.email ? (
                                <a href={`mailto:${mp.email}`} className="flex items-center gap-2 px-5 py-2.5 bg-surface-color border border-surface-border rounded-xl hover:bg-surface-hover transition-colors text-foreground font-medium shadow-sm">
                                    <Mail size={18} className="text-accent-blue" />
                                    Wyślij wiadomość
                                </a>
                            ) : (
                                <span className="flex items-center gap-2 px-5 py-2.5 bg-surface-color/50 border border-surface-border rounded-xl text-gray-500 font-medium">
                                    <Mail size={18} /> Brak adresu email
                                </span>
                            )}
                            <button
                                onClick={() => addToCompare(mp)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium shadow-sm ${isSelected 
                                    ? 'bg-blue-600 dark:text-white text-blue-950 border border-blue-500' 
                                    : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'
                                }`}
                            >
                                <GitCompare size={18} />
                                {isSelected ? "W wykazie do porównania" : "Dodaj do porównania"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ComparisonDock />
        </div>
    );
}
