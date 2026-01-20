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
        const filePath = path.join(process.cwd(), 'public/data/mps.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.warn("MPs data not found", e);
    }
    return [];
}

export async function getMP(id: string): Promise<MP | undefined> {
    const mps = await getMPs();
    return mps.find(mp => mp.id === id);
}
