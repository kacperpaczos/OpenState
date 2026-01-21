import fs from 'fs';
import path from 'path';

export interface Interpellation {
    num: number;
    term: number;
    title: string;
    receiptDate: string;
    lastModified: string;
    from: string[]; // MPs
    to: string[]; // Ministries
    sentDate?: string;
    replies?: any[];
}

export async function getInterpellations(): Promise<Interpellation[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/interpellations_list.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.warn("Interpellations list not found", e);
    }
    return [];
}

export async function getInterpellation(id: number | string): Promise<any | null> {
    try {
        const filePath = path.join(process.cwd(), `public/data/interpellations/${id}.json`);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        // console.warn(`Interpellation ${id} not found`);
    }
    return null;
}
