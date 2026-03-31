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
    // Details
    description?: string;
    stages?: {
        name: string;
        date: string;
        status: string;
    }[];
    documents?: {
        title: string;
        url: string;
    }[];
}

export async function getRclProjects(): Promise<RclProject[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/rcl/projects.json');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.warn("RCL projects list not found", e);
    }
    return [];
}

export async function getRclProject(id: string): Promise<RclProject | undefined> {
    try {
        const filePath = path.join(process.cwd(), `public/data/rcl/details/${id}.json`);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.warn(`RCL project ${id} not found`, e);
    }
    return undefined;
}
