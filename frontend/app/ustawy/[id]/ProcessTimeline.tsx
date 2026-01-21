"use client";

import { Bill } from "@/lib/bills";
import { CheckCircle, Circle, Clock, FileText } from "lucide-react";

export default function ProcessTimeline({ process }: { process: Bill }) {
    // Reverse stages to show newest first? Or oldest first? 
    // Usually timelines are newest at top or bottom. Let's do oldest at top (chronological) usually makes sense for reading a story, 
    // but for status updates usually newest is top.
    // Let's stick to the order from API (usually chronological).

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-surface-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Clock size={18} className="text-accent-blue" />
                    Przebieg Procesu Legislacyjnego
                </h3>
                <span className="text-xs text-gray-500 bg-surface-color px-2 py-1 rounded">
                    {process.stages.length} etapów
                </span>
            </div>

            <div className="p-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-[43px] top-6 bottom-6 w-0.5 bg-surface-border"></div>

                <div className="space-y-8 relative">
                    {process.stages.map((stage, i) => (
                        <div key={i} className="relative group">
                            <div className="flex gap-6">
                                {/* Icon/Dot */}
                                <div className="relative z-10">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 
                                        ${i === process.stages.length - 1
                                            ? 'bg-accent-blue border-accent-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                            : 'bg-surface-color border-surface-border text-gray-500 group-hover:border-accent-blue/50'
                                        } transition-colors`}>
                                        {i === process.stages.length - 1 ? <CheckCircle size={16} /> : <Circle size={12} />}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                        <h4 className={`text-base font-medium ${i === process.stages.length - 1 ? 'text-accent-blue' : 'text-foreground'}`}>
                                            {stage.stageName}
                                        </h4>
                                        <span className="text-sm text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 mx-0 sm:mx-0 w-fit mt-1 sm:mt-0">
                                            {stage.date}
                                        </span>
                                    </div>

                                    {stage.children && stage.children.length > 0 && (
                                        <div className="mt-3 space-y-3 bg-white/5 rounded-xl p-4 border border-white/5">
                                            {stage.children.map((child, j) => (
                                                <div key={j} className="flex items-start gap-3 text-sm">
                                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 shrink-0"></div>
                                                    <div>
                                                        <div className="text-gray-800 dark:text-gray-300">{child.stageName}</div>
                                                        {child.decision && (
                                                            <div className="text-xs text-green-600 dark:text-green-400 mt-0.5 font-medium">
                                                                Decyzja: {child.decision}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
