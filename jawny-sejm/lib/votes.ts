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
        if (!fs.existsSync(VOTINGS_DIR)) return [];

        const files = fs.readdirSync(VOTINGS_DIR).filter(f => f.endsWith('.json'));
        const votes: VoteRecord[] = [];

        // Sort files by date/number if possible, but filesystem order is arbitrary.
        // We'll sort result later.

        for (const file of files) {
            const content = fs.readFileSync(path.join(VOTINGS_DIR, file), 'utf-8');
            const data = JSON.parse(content);

            if (!data.votes) continue;

            const mpVote = data.votes.find((v: any) => v.mpId === mpId);
            if (mpVote) {
                votes.push({
                    sitting: data.sitting,
                    votingNumber: data.votingNumber,
                    date: data.date,
                    title: data.title,
                    topic: data.topic,
                    kind: data.kind,
                    vote: mpVote.vote
                });
            } else {
                // MP might be absent from list entirely? Usually means absent.
                // Check if they are in the list at all? 
                // For now assume if not in list, no record.
                // Or explicitly check 'List of absent'.
                // The API 'votes' array usually contains all MPs? Need to verify.
                // Actually the API returns List<Vote> which has MP id.
                // If MP is not there, maybe they didn't exist then? or absent?
            }
        }

        // Sort by date desc (or sitting/voting desc)
        return votes.sort((a, b) => {
            if (b.sitting !== a.sitting) return b.sitting - a.sitting;
            return b.votingNumber - a.votingNumber;
        });

    } catch (e) {
        console.error("Error loading votes for MP", e);
        return [];
    }
}
