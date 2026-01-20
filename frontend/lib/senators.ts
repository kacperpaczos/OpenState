import fs from "fs";
import path from "path";

export type Senator = {
    id: string;
    name: string;
    email: string;
    club: string;
    district: string;
    photoUrl: string;
    detailUrl: string;
};

export async function getSenators(): Promise<Senator[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/senators.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.warn("Senators data not found", e);
    }
    return [];
}
