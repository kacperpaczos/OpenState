import { db } from "@/src/db";
import { bills, billStages, type Bill as DbBill, type BillStage } from "@/src/db/schema";
import { eq, asc } from "drizzle-orm";

export interface ProcessStage {
    stageName: string;
    date: string;
    stageType?: string;
    organ?: string;
    children?: {
        stageName: string;
        date: string;
        decision?: string;
    }[];
}

export interface Bill {
    id: string;
    printNo: string;
    title: string;
    description: string;
    documentType: string;
    authorType: string;
    status: string;
    kanbanStage?: string;
    isEU: boolean;
    passed: boolean;
    term: number;
    date: string;
    processStartDate?: string;
    urgency: string;
    isapLink?: string;
    eliLink?: string;
    rclLink?: string;
    rclProjectId?: string;
    stages: ProcessStage[];
}

/**
 * Maps DB record to Bill interface
 * Using a type that represents the bill with its stages joined
 */
type DbBillWithStages = DbBill & { stages: BillStage[] };

function mapDbBillToInterface(d: DbBillWithStages): Bill {
    return {
        id: d.id,
        printNo: d.printNo || d.id,
        title: d.title,
        description: d.description || "",
        documentType: d.documentType || "",
        authorType: d.authorType || "",
        status: d.status || "",
        kanbanStage: d.kanbanStage || undefined,
        isEU: d.isEU ?? false,
        passed: d.passed ?? false,
        term: d.term || 10,
        date: d.date || "",
        processStartDate: d.processStartDate || undefined,
        urgency: d.urgencyStatus || "NORMAL",
        isapLink: d.isapLink || undefined,
        eliLink: d.eliLink || undefined,
        rclLink: d.rclLink || undefined,
        rclProjectId: d.rclProjectId || undefined,
        stages: (d.stages || []).map((s: BillStage) => ({
            stageName: s.stageName,
            date: s.date || "",
            stageType: s.stageType || undefined,
            organ: s.organ || undefined,
            children: s.children as any || undefined
        }))
    };
}

export async function getBills(): Promise<Bill[]> {
    try {
        const dbBills = await db.query.bills.findMany({
            with: {
                stages: {
                    orderBy: [asc(billStages.sortOrder)]
                }
            }
        });
        return dbBills.map(mapDbBillToInterface);
    } catch (e) {
        console.error("Database error fetching bills:", e);
        throw e;
    }
}

export async function getBill(id: string): Promise<Bill | undefined> {
    try {
        const dbBill = await db.query.bills.findFirst({
            where: eq(bills.id, id),
            with: {
                stages: {
                    orderBy: [asc(billStages.sortOrder)]
                }
            }
        });
        
        if (!dbBill) return undefined;
        return mapDbBillToInterface(dbBill);
    } catch (e) {
        console.error(`Database error fetching bill ${id}:`, e);
        throw e;
    }
}
