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
            return JSON.parse(fileContent);
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
