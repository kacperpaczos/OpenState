import { getBills } from "./bills";
import { KANBAN_STAGES } from "./constants";
import { getSittings } from "./votings";
import { getMPs } from "./mps";
import { getSenators } from "./senators";

export interface ProcessStats {
    total: number;
    inProgress: number;
    completed: number;
    byStage: {
        [key: string]: number;
    };
}

export interface VotingStats {
    totalSittings: number;
    latestSitting?: {
        sitting: number;
        date: string;
    };
}

export interface ParliamentStats {
    totalMPs: number;
    totalSenators: number;
    total: number;
}

export async function getProcessStats(): Promise<ProcessStats> {
    const processes = await getBills();

    // Group by Kanban stage
    const byStage: { [key: string]: number } = {};
    processes.forEach(p => {
        const stage = p.kanbanStage || "Unknown";
        byStage[stage] = (byStage[stage] || 0) + 1;
    });

    // Count in-progress (not completed)
    const completedStages = [KANBAN_STAGES.PUBLIKACJA, KANBAN_STAGES.WEJSCIE_W_ZYCIE] as string[];
    const inProgress = processes.filter(p =>
        !completedStages.includes(p.kanbanStage || "")
    ).length;

    const completed = processes.filter(p =>
        completedStages.includes(p.kanbanStage || "")
    ).length;

    return {
        total: processes.length,
        inProgress,
        completed,
        byStage
    };
}

export async function getVotingStats(): Promise<VotingStats> {
    const sittings = await getSittings();

    return {
        totalSittings: sittings.length,
        latestSitting: sittings.length > 0 ? sittings[sittings.length - 1] : undefined
    };
}

export async function getParliamentStats(): Promise<ParliamentStats> {
    const mps = await getMPs();
    const senators = await getSenators();

    return {
        totalMPs: mps.length,
        totalSenators: senators.length,
        total: mps.length + senators.length
    };
}
