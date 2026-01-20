import fs from "fs";
import path from "path";

const VOTINGS_DIR = path.join(process.cwd(), 'public/data/votings');

export interface VoteRecord {
    sitting: number;
    votingNumber: number;
    date: string;
    title: string;
    topic: string;
    kind: string; // e.g., "ELECTRONIC"
    vote: string; // "YES", "NO", "ABSTAIN", "ABSENT"
}

// Optimized loader: Reads all JSONs in the dir (or specific ones) and filters for MP
// In production, this should be a database or indexed file. For now, reading 20 files is fast enough.
export async function getVotesForMP(mpId: number): Promise<VoteRecord[]> {
    try {
        // Use optimized aggregated file
        const mpFile = path.join(process.cwd(), 'public/data/votes_by_mp', `${mpId}.json`);

        if (fs.existsSync(mpFile)) {
            const content = fs.readFileSync(mpFile, 'utf-8');
            const votes = JSON.parse(content);
            return votes;
        }

        return [];

    } catch (e) {
        console.error("Error loading votes for MP", e);
        return [];
    }
}
