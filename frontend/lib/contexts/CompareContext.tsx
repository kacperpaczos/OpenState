"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MP } from "@/lib/mps";

interface CompareContextType {
    mpA: MP | null;
    mpB: MP | null;
    setMPA: (mp: MP | null) => void;
    setMPB: (mp: MP | null) => void;
    addToCompare: (mp: MP) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [mpA, setMpAState] = useState<MP | null>(null);
    const [mpB, setMpBState] = useState<MP | null>(null);

    // Drobna obsluga wyciagania ID poslow w Storage
    useEffect(() => {
        try {
            const savedA = localStorage.getItem("compare_mpA");
            const savedB = localStorage.getItem("compare_mpB");
            if (savedA) setMpAState(JSON.parse(savedA));
            if (savedB) setMpBState(JSON.parse(savedB));
        } catch (e) { }
    }, []);

    const setMPA = (mp: MP | null) => {
        setMpAState(mp);
        if (mp) localStorage.setItem("compare_mpA", JSON.stringify(mp));
        else localStorage.removeItem("compare_mpA");
    };

    const setMPB = (mp: MP | null) => {
        setMpBState(mp);
        if (mp) localStorage.setItem("compare_mpB", JSON.stringify(mp));
        else localStorage.removeItem("compare_mpB");
    };

    const addToCompare = (mp: MP) => {
        if (!mpA && mp?.id !== mpB?.id) setMPA(mp);
        else if (!mpB && mp?.id !== mpA?.id) setMPB(mp);
    };

    const removeFromCompare = (id: string) => {
        if (mpA && mpA.id === id) setMPA(null);
        if (mpB && mpB.id === id) setMPB(null);
    };

    const clearCompare = () => {
        setMPA(null);
        setMPB(null);
    };

    return (
        <CompareContext.Provider value={{ mpA, mpB, setMPA, setMPB, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}
