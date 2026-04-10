import { db } from "@/src/db";
import { bills, sittings, deputies } from "@/src/db/schema";
import { count, eq, sql, desc } from "drizzle-orm";
import { KANBAN_STAGES } from "./constants";

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
    try {
        const completedStages = [KANBAN_STAGES.PUBLIKACJA, KANBAN_STAGES.WEJSCIE_W_ZYCIE] as string[];
        
        const [totalRes, completedRes, stagesRes] = await Promise.all([
            db.select({ value: count() }).from(bills),
            db.select({ value: count() }).from(bills).where(sql`${bills.kanbanStage} IN ${completedStages}`),
            db.select({ 
                stage: bills.kanbanStage, 
                value: count() 
            }).from(bills).groupBy(bills.kanbanStage)
        ]);

        const total = totalRes[0].value;
        const completed = completedRes[0].value;
        const byStage: { [key: string]: number } = {};
        
        stagesRes.forEach((r: { stage: string | null; value: number }) => {
            if (r.stage) byStage[r.stage] = r.value;
        });

        return {
            total,
            inProgress: total - completed,
            completed,
            byStage
        };
    } catch (e) {
        console.error("Database error calculating process stats:", e);
        throw e;
    }
}

export async function getVotingStats(): Promise<VotingStats> {
    try {
        const totalRes = await db.select({ value: count() }).from(sittings);
        const latest = await db.select().from(sittings).orderBy(desc(sittings.sittingNumber)).limit(1);

        return {
            totalSittings: totalRes[0].value,
            latestSitting: latest.length > 0 ? {
                sitting: latest[0].sittingNumber,
                date: latest[0].date?.toISOString() || ""
            } : undefined
        };
    } catch (e) {
        console.error("Database error calculating voting stats:", e);
        throw e;
    }
}

export async function getParliamentStats(): Promise<ParliamentStats> {
    try {
        const mpsRes = await db.select({ value: count() }).from(deputies).where(eq(deputies.type, "Poseł"));
        const senatorsRes = await db.select({ value: count() }).from(deputies).where(eq(deputies.type, "Senator"));

        const mps = mpsRes[0].value;
        const senators = senatorsRes[0].value;

        return {
            totalMPs: mps,
            totalSenators: senators,
            total: mps + senators
        };
    } catch (e) {
        console.error("Database error calculating parliament stats:", e);
        throw e;
    }
}
