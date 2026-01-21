import fs from 'fs';
import path from 'path';

export interface RclProject {
    id: string;
    title: string;
    url: string;
    applicant: string;
    number: string;
    date: string;
    status?: string;
}

export async function getRclProjects(): Promise<RclProject[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/rcl/projects.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.warn("RCL projects not found", e);
    }
    return [];
}
