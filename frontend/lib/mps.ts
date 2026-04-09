import fs from "fs";
import path from "path";

export interface MP {
    id: string;
    name: string;
    firstLastName: string;
    club: string;
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

export async function getMPs(): Promise<MP[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/mps.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent).map((m: any) => ({
                ...m,
                chamber: 'Sejm' as const,
                firstLastName: m.firstLastName || m.name
            }));
        }
    } catch (e) {
        console.warn("MPs data not found", e);
    }
    return [];
}

export async function getSenators(): Promise<MP[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/senators.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent).map((s: any) => ({
                ...s,
                chamber: 'Senat' as const,
                firstLastName: s.name
            }));
        }
    } catch (e) {
        console.warn("Senators data not found", e);
    }
    return [];
}

export async function getParliamentMembers(): Promise<MP[]> {
    const [mps, senators] = await Promise.all([getMPs(), getSenators()]);
    return [...mps, ...senators];
}

export async function getMP(id: string): Promise<MP | undefined> {
    const members = await getParliamentMembers();
    return members.find(m => m.id === id);
}
