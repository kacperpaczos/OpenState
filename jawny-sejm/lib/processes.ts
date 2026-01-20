import fs from "fs";
import path from "path";

export interface ProcessStage {
    stageName: string;
    date: string;
    children?: {
        stageName: string;
        date: string;
        decision?: string;
    }[];
}

export interface LegislativeProcess {
    id: string;
    eli: string;
    title: string;
    description: string;
    documentType: string;
    isEU: boolean;
    date: string;
    term: number;
    urgency: string;
    stages: ProcessStage[];
}

export async function getProcesses(): Promise<LegislativeProcess[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/processes.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.warn("Processes data not found", e);
    }
    return [];
}

export async function getProcess(id: string): Promise<LegislativeProcess | undefined> {
    const processes = await getProcesses();
    return processes.find(p => p.id === id);
}
