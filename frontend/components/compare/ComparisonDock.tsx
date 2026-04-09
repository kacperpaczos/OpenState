"use client";

import { useEffect, useState } from "react";
import { useCompare } from "@/lib/contexts/CompareContext";
import { X, User, ArrowRightLeft, Zap } from "lucide-react";
import Link from "next/link";
import { MP } from "@/lib/mps";

export default function ComparisonDock() {
    const { mpA, mpB, removeFromCompare } = useCompare();
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (mpA || mpB) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [mpA, mpB, isMounted]);

    if (!isMounted || (!mpA && !mpB && !isVisible)) return null;

    const canCompare = mpA && mpB;

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] transition-all duration-500 ease-out-expo ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}>
            <div className="glass-card bg-surface-color/80 backdrop-blur-xl border border-white/20 shadow-2xl p-2 px-4 flex items-center gap-4 min-w-[300px] h-16">
                
                {/* Slot A */}
                <CompareSlot mp={mpA} onRemove={() => removeFromCompare(mpA?.id || "")} label="A" />

                <div className="text-gray-500/50">
                    <ArrowRightLeft size={16} />
                </div>

                {/* Slot B */}
                <CompareSlot mp={mpB} onRemove={() => removeFromCompare(mpB?.id || "")} label="B" />

                {/* Action Button */}
                <div className="ml-2 border-l border-surface-border pl-4">
                    {canCompare ? (
                        <Link 
                            href={`/porownaj?a=${mpA.id}&b=${mpB.id}`}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 dark:text-white text-blue-950 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
                        >
                            <Zap size={14} fill="currentColor" />
                            Porównaj
                        </Link>
                    ) : (
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter leading-none max-w-[80px]">
                            Wybierz drugą osobę
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function CompareSlot({ mp, onRemove, label }: { mp: MP | null, onRemove: () => void, label: string }) {
    return (
        <div className="relative group">
            <div className={`w-11 h-11 rounded-full border-2 transition-all flex items-center justify-center overflow-hidden ${mp ? 'border-blue-500 shadow-lg' : 'border-dashed border-gray-500/30 bg-gray-500/5'}`}>
                {mp ? (
                    <img src={mp.photoUrl} alt={mp.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-500 text-xs font-bold">{label}</span>
                )}
            </div>
            
            {mp && (
                <button 
                    onClick={onRemove}
                    className="absolute -top-1 -right-1 bg-red-500 dark:text-white text-red-950 rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X size={10} strokeWidth={3} />
                </button>
            )}
            
            {mp && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-surface-color border border-surface-border px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                    {mp.name}
                </div>
            )}
        </div>
    );
}
