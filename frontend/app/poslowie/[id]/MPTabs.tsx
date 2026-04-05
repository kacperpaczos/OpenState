"use client";

import { useState } from "react";
import { BarChart3, User, MessageSquare } from "lucide-react";

type Tab = "glosowania" | "oposeł" | "interpelacje";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "glosowania", label: "Głosowania", icon: <BarChart3 size={16} /> },
    { id: "oposeł", label: "O Pośle", icon: <User size={16} /> },
    { id: "interpelacje", label: "Interpelacje", icon: <MessageSquare size={16} /> },
];

interface MPTabsProps {
    votingPanel: React.ReactNode;
    aboutPanel: React.ReactNode;
    interpellationsPanel: React.ReactNode;
}

export default function MPTabs({ votingPanel, aboutPanel, interpellationsPanel }: MPTabsProps) {
    const [active, setActive] = useState<Tab>("glosowania");

    const panels: Record<Tab, React.ReactNode> = {
        glosowania: votingPanel,
        oposeł: aboutPanel,
        interpelacje: interpellationsPanel,
    };

    return (
        <div>
            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-surface-border mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        data-testid={`tab-${tab.id}`}
                        onClick={() => setActive(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${active === tab.id
                                ? "bg-accent-blue text-white shadow-sm"
                                : "text-gray-400 hover:text-foreground hover:bg-white/5"
                            }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Active panel */}
            <div data-testid={`panel-${active}`}>
                {panels[active]}
            </div>
        </div>
    );
}
