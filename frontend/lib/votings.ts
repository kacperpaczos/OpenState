import { db } from "@/src/db";
import { sittings, votings, voteRecords, type Voting as DbVoting, type VoteRecord as DbVoteRecord, type Sitting as DbSitting } from "@/src/db/schema";
import { eq, and, desc, asc, like, or } from "drizzle-orm";

export interface Sitting {
    sitting: number;
    date: string;
}

export interface VotingSummary {
    sitting: number;
    votingNumber: number;
    date: string;
    title: string;
    topic?: string;
    pdfLink?: string;
    kind: string;
}

export async function getSittings(): Promise<Sitting[]> {
    try {
        const dbSittings = await db.select().from(sittings).orderBy(desc(sittings.sittingNumber));
        return dbSittings.map((s: DbSitting) => ({
            sitting: s.sittingNumber,
            date: s.date?.toISOString() || ""
        }));
    } catch (e) {
        console.error("Database error fetching sittings:", e);
        throw e;
    }
}

export async function getSittingVotings(sitting: number): Promise<VotingSummary[]> {
    try {
        const dbVotings = await db.select().from(votings).where(eq(votings.sittingNumber, sitting)).orderBy(asc(votings.votingNumber));
        return dbVotings.map((v: DbVoting) => ({
            sitting: v.sittingNumber,
            votingNumber: v.votingNumber,
            date: v.date?.toISOString() || "",
            title: v.title || "",
            topic: v.topic || undefined,
            kind: v.kind || "ELECTRONIC"
        }));
    } catch (e) {
        console.error(`Database error fetching votings for sitting ${sitting}:`, e);
        throw e;
    }
}

/**
 * Detailed Voting type joined with records
 */
type DbVotingWithRecords = DbVoting & {
    voteRecords: DbVoteRecord[];
};

export async function getVotingDetails(sitting: number, voting: number): Promise<any | null> {
    try {
        const dbVoting = await db.query.votings.findFirst({
            where: and(
                eq(votings.sittingNumber, sitting),
                eq(votings.votingNumber, voting)
            ),
            with: {
                voteRecords: true
            }
        }) as DbVotingWithRecords | undefined;
        
        if (!dbVoting) return null;

        return {
            ...dbVoting,
            date: dbVoting.date?.toISOString(),
            votes: (dbVoting.voteRecords || []).map((vr: DbVoteRecord) => ({
                MP: vr.deputyId,
                club: vr.clubAtVote,
                vote: vr.vote
            }))
        };
    } catch (e) {
        console.error(`Database error fetching voting details ${sitting}/${voting}:`, e);
        throw e;
    }
}

export async function getAllVotings(): Promise<VotingSummary[]> {
    try {
        const dbVotings = await db.select().from(votings).orderBy(desc(votings.sittingNumber), desc(votings.votingNumber));
        return dbVotings.map((v: DbVoting) => ({
            sitting: v.sittingNumber,
            votingNumber: v.votingNumber,
            date: v.date?.toISOString() || "",
            title: v.title || "",
            topic: v.topic || undefined,
            kind: v.kind || "ELECTRONIC"
        }));
    } catch (e) {
        console.error("Database error fetching all votings:", e);
        throw e;
    }
}

/**
 * Find votings related to a specific bill using DB pattern matching.
 */
export async function getVotingsForBill(billId: string): Promise<VotingSummary[]> {
    try {
        const dbResults = await db.select().from(votings).where(
            or(
                like(votings.title, `%druk nr ${billId}%`),
                like(votings.title, `%druk nr. ${billId}%`),
                like(votings.title, `%(${billId})%`),
                like(votings.topic, `%druk nr ${billId}%`)
            )
        ).orderBy(desc(votings.sittingNumber), desc(votings.votingNumber));

        return dbResults.map((v: DbVoting) => ({
            sitting: v.sittingNumber,
            votingNumber: v.votingNumber,
            date: v.date?.toISOString() || "",
            title: v.title || "",
            topic: v.topic || undefined,
            kind: v.kind || "ELECTRONIC"
        }));
    } catch (e) {
        console.error(`Database error searching votings for bill ${billId}:`, e);
        throw e;
    }
}
