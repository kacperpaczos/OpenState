import { getParliamentMembers as getBacklogMembers } from "./mps";

// This file is being deprecated/refactored.
// The app should now use dedicated get functions from:
// - lib/mps.ts
// - lib/senators.ts
// - lib/votings.ts
// - lib/processes.ts

// Keeping some types for compatibility if needed elsewhere, 
// but recommending moving to specific files.

import { getSenators } from "./senators";
import { getBills, Bill } from "./bills";

export type MP = {
    type: 'Poseł' | 'Senator';
    name: string;
    party: string;
    district: string;
    photoUrl?: string;
    attendance?: number;
    votes?: VoteHistory[];
    // ^ Note: Detailed votes on specific bills are hard to mock correctly 
    // without full database. For now we might keep them optional or empty.
};

export type VoteHistory = {
    title: string;
    vote: 'Za' | 'Przeciw' | 'Wstrzymał' | 'Nieobecny';
    color: 'green' | 'red' | 'gray';
};

export type VotingRecord = {
    id: string;
    title: string;
    description: string;
    date: string;
    result: string;
    totalVotes: number;
    stats: {
        yes: number;
        no: number;
        abstain: number;
        absent: number;
    };
    votes: {
        mpName: string;
        mpParty: string;
        vote: string;
    }[];
};

// -- Aggregated Parliament Members Getter --
export async function getParliamentMembers(): Promise<MP[]> {
    let members: MP[] = [];

    // 1. Fetch Real MPs (using existing logic or file)
    // We can read public/data/mps.json directly here or reuse logic from mps.ts if we export it better.
    // For now, let's read the file directly to be safe and fast.
    try {
        const fs = require('fs');
        const path = require('path');
        const mpsPath = path.join(process.cwd(), 'public/data/mps.json');

        if (fs.existsSync(mpsPath)) {
            const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf-8'));
            members = mpsData.map((p: any) => ({
                type: 'Poseł',
                name: p.name,
                party: p.party,
                district: p.district,
                photoUrl: p.photoUrl,
                attendance: 90, // Placeholder
                votes: [] // Placeholder
            }));
        }
    } catch (e) {
        console.warn("Failed to load MPs for parliament view", e);
    }

    // 2. Fetch Real Senators
    const senators = await getSenators();
    senators.forEach(s => {
        members.push({
            type: 'Senator',
            name: s.name,
            party: s.party,
            district: s.district,
            photoUrl: s.photoUrl,
            attendance: 95, // Placeholder
            votes: []
        });
    });

    return members;
}

// -- Deprecated / Legacy Support -- 
// Ideally we stop using MOCK_DB and use specific getters.
// But if some components rely on MOCK_DB.votingRecords directly:

export const MOCK_DB = {
    parliament: [], // Should assume empty if not awaited, or components should use getAllMembers()
    votingRecords: {} // Empty, components should handle null
};

export async function getVotingRecord(id: string) {
    // This mock function is likely insufficient for real data.
    // Real voting data structure is complex (folder per sitting).
    // Components should use lib/votings.ts -> getVotingDetails
    return null;
}


