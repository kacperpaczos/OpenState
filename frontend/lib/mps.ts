import { db } from "@/src/db";
import { deputies, type Deputy } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export interface MP {
    id: string;
    name: string;
    firstLastName: string;
    club: string;
    party?: string;
    district: string;
    email: string;
    active: boolean;
    photoUrl: string;
    chamber?: 'Sejm' | 'Senat';
    detailUrl?: string; // For Senators
    // Advanced data for future use
    birthDate?: string;
    profession?: string;
    education?: string;
    numberOfVotes?: number;
    voivodeship?: string;
    attendance?: number;
    rebelLevel?: number;
}

/**
 * Helper to map DB deputy record to MP interface
 */
function mapDeputyToMP(d: Deputy): MP {
    return {
        id: d.id.toString(),
        name: d.name,
        firstLastName: d.name,
        club: d.club || "",
        party: d.party || "",
        district: d.district || "",
        email: d.email || "",
        active: d.active ?? true,
        photoUrl: d.photoUrl || "",
        chamber: d.type === "Senator" ? "Senat" : "Sejm",
    };
}

export async function getMPs(): Promise<MP[]> {
    try {
        const dbMps = await db.select().from(deputies).where(eq(deputies.type, "Poseł"));
        return dbMps.map(mapDeputyToMP);
    } catch (e) {
        console.error("Database error fetching MPs:", e);
        throw e; // Propagate error for UI handling
    }
}

export async function getSenators(): Promise<MP[]> {
    try {
        const dbSenators = await db.select().from(deputies).where(eq(deputies.type, "Senator"));
        return dbSenators.map(mapDeputyToMP);
    } catch (e) {
        console.error("Database error fetching Senators:", e);
        throw e;
    }
}

export async function getParliamentMembers(): Promise<MP[]> {
    try {
        const allMembers = await db.select().from(deputies);
        return allMembers.map(mapDeputyToMP);
    } catch (e) {
        console.error("Database error fetching all members:", e);
        throw e;
    }
}

export async function getMP(id: string): Promise<MP | undefined> {
    try {
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
            const member = await db.select().from(deputies).where(eq(deputies.id, numericId)).limit(1);
            if (member.length > 0) {
                return mapDeputyToMP(member[0]);
            }
        }
        return undefined;
    } catch (e) {
        console.error(`Database error fetching MP ${id}:`, e);
        throw e;
    }
}
