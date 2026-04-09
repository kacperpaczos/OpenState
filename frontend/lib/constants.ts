/**
 * Shared Constants for OpenState
 * 
 * Central place for all magic strings and configuration values
 * to prevent desynchronization across codebase.
 */

// Kanban Stages for Legislative Process
// CRITICAL: Must match backend/fetch_bills.py determine_stage() function
export const KANBAN_STAGES = {
    INICJATYWA: "Inicjatywa",
    SEJM_I_CZYTANIE: "Sejm - I Czytanie",
    SEJM_KOMISJE: "Sejm - Komisje",
    SEJM_II_CZYTANIE: "Sejm - II Czytanie",
    SEJM_GLOSOWANIE: "Sejm - Głosowanie",
    SENAT_KOMISJE: "Senat - Komisje",
    SENAT_GLOSOWANIE: "Senat - Głosowanie",
    PREZYDENT: "Prezydent",
    PUBLIKACJA: "Publikacja",
    WEJSCIE_W_ZYCIE: "Wejście w życie",
} as const;

// Type for Kanban stages
export type KanbanStage = typeof KANBAN_STAGES[keyof typeof KANBAN_STAGES];

// Array of all stages in order
export const KANBAN_STAGES_ORDER: KanbanStage[] = [
    KANBAN_STAGES.INICJATYWA,
    KANBAN_STAGES.SEJM_I_CZYTANIE,
    KANBAN_STAGES.SEJM_KOMISJE,
    KANBAN_STAGES.SEJM_II_CZYTANIE,
    KANBAN_STAGES.SEJM_GLOSOWANIE,
    KANBAN_STAGES.SENAT_KOMISJE,
    KANBAN_STAGES.SENAT_GLOSOWANIE,
    KANBAN_STAGES.PREZYDENT,
    KANBAN_STAGES.PUBLIKACJA,
    KANBAN_STAGES.WEJSCIE_W_ZYCIE,
];

// Stage colors (match GovApple design system)
export const KANBAN_STAGE_COLORS: Record<KanbanStage, string> = {
    [KANBAN_STAGES.INICJATYWA]: "bg-apple-gray-500 text-white",
    [KANBAN_STAGES.SEJM_I_CZYTANIE]: "bg-apple-blue text-white",
    [KANBAN_STAGES.SEJM_KOMISJE]: "bg-apple-blue text-white",
    [KANBAN_STAGES.SEJM_II_CZYTANIE]: "bg-apple-blue text-white",
    [KANBAN_STAGES.SEJM_GLOSOWANIE]: "bg-apple-blue text-white",
    [KANBAN_STAGES.SENAT_KOMISJE]: "bg-apple-purple text-white",
    [KANBAN_STAGES.SENAT_GLOSOWANIE]: "bg-apple-purple text-white",
    [KANBAN_STAGES.PREZYDENT]: "bg-apple-orange text-white",
    [KANBAN_STAGES.PUBLIKACJA]: "bg-apple-green text-white",
    [KANBAN_STAGES.WEJSCIE_W_ZYCIE]: "bg-apple-green text-white",
};

