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
}

export async function getMPs(): Promise<MP[]> {
    try {
        const mpsPath = path.join(process.cwd(), 'public/data/mps.json');
        const senatorsPath = path.join(process.cwd(), 'public/data/senators.json');
        
        let allMembers: MP[] = [];

        if (fs.existsSync(mpsPath)) {
            const mpsContent = fs.readFileSync(mpsPath, 'utf-8');
            const mps = JSON.parse(mpsContent).map((m: any) => ({
                ...m,
                chamber: 'Sejm' as const,
                firstLastName: m.firstLastName || m.name
            }));
            allMembers = [...allMembers, ...mps];
        }

        if (fs.existsSync(senatorsPath)) {
            const senatorsContent = fs.readFileSync(senatorsPath, 'utf-8');
            const senators = JSON.parse(senatorsContent).map((s: any) => ({
                ...s,
                chamber: 'Senat' as const,
                firstLastName: s.name
            }));
            allMembers = [...allMembers, ...senators];
        }

        return allMembers;
    } catch (e) {
        console.warn("Error loading parliament members data", e);
    }
    return [];
}

export async function getMP(id: string): Promise<MP | undefined> {
    const mps = await getMPs();
    return mps.find(mp => mp.id === id);
}
// Alias for compatibility/refactor
export const getParliamentMembers = getMPs;
