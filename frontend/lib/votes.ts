import { db } from "@/src/db";
import { voteRecords, votings } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export interface VoteRecord {
    sitting: number;
    votingNumber: number;
    date: string;
    title: string;
    topic: string;
    kind: string; // e.g., "ELECTRONIC"
    vote: string; // "YES", "NO", "ABSTAIN", "ABSENT"
}

/**
 * Shared logic to fetch votes for any deputy (MP or Senator) from the database
 */
async function fetchVotesFromDb(deputyId: number): Promise<VoteRecord[]> {
    try {
        const results = await db
            .select({
                vote: voteRecords.vote,
                sitting: votings.sittingNumber,
                votingNumber: votings.votingNumber,
                date: votings.date,
                title: votings.title,
                topic: votings.topic,
                kind: votings.kind,
            })
            .from(voteRecords)
            .innerJoin(votings, eq(voteRecords.votingId, votings.id))
            .where(eq(voteRecords.deputyId, deputyId))
            .orderBy(desc(votings.date), desc(votings.votingNumber));

        return results.map(r => ({
            sitting: r.sitting || 0,
            votingNumber: r.votingNumber || 0,
            date: r.date ? new Date(r.date).toLocaleDateString('pl-PL') : "—",
            title: r.title || "",
            topic: r.topic || "",
            kind: r.kind || "ELECTRONIC",
            vote: r.vote || "ABSENT",
        }));

    } catch (e) {
        console.error(`Database error fetching votes for deputy ${deputyId}:`, e);
        return [];
    }
}

export async function getVotesForMP(mpId: number): Promise<VoteRecord[]> {
    return fetchVotesFromDb(mpId);
}

export async function getVotesForSenator(senatorId: string): Promise<VoteRecord[]> {
    const numericId = parseInt(senatorId);
    if (isNaN(numericId)) return [];
    return fetchVotesFromDb(numericId);
}
