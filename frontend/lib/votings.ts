import fs from 'fs';
import path from 'path';

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
        const filePath = path.join(process.cwd(), 'public/data/votings/sittings.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const data: Sitting[] = JSON.parse(fileContent);
            // Sort by sitting number descending (newest first)
            return data.sort((a, b) => b.sitting - a.sitting);
        }
    } catch (e) {
        console.warn("Sittings list not found", e);
    }
    return [];
}

export async function getSittingVotings(sitting: number): Promise<VotingSummary[]> {
    try {
        const filePath = path.join(process.cwd(), `public/data/votings/${sitting}/index.json`);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        // console.warn(`Votings for sitting ${sitting} not found`);
    }
    return [];
}

export async function getVotingDetails(sitting: number, voting: number): Promise<any | null> {
    try {
        const filePath = path.join(process.cwd(), `public/data/votings/${sitting}/${voting}.json`);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.warn(`Voting details ${sitting}/${voting} not found`);
    }
    return null;
}

export async function getAllVotings(): Promise<VotingSummary[]> {
    const sittings = await getSittings();
    const all: VotingSummary[] = [];
    for (const s of sittings) {
        const sv = await getSittingVotings(s.sitting);
        all.push(...sv);
    }
    // Newest first: sort by sitting desc, then votingNumber desc
    return all.sort((a, b) => b.sitting !== a.sitting ? b.sitting - a.sitting : b.votingNumber - a.votingNumber);
}

/**
 * C1: Find votings related to a specific bill (by druk/print number).
 * Voting titles from the Sejm API typically contain "druk nr 402" or "(402)" patterns.
 */
export async function getVotingsForBill(billId: string): Promise<VotingSummary[]> {
    const all = await getAllVotings();
    const patterns = [
        `druk nr ${billId}`,
        `druk nr. ${billId}`,
        `(${billId})`,
        `nr ${billId}`,
    ];
    return all.filter(v => {
        const hay = `${v.title} ${v.topic ?? ""}`.toLowerCase();
        return patterns.some(p => hay.includes(p.toLowerCase()));
    });
}
