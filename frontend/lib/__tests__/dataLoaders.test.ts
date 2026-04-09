/**
 * Data Loader tests
 * Using spyOn for more reliable path-based mocking.
 */

import fs from 'fs';
import { getMPs, getSenators, getParliamentMembers, getMP } from '../mps';
import { getVotesForMP, getVotesForSenator } from '../votes';
import { getBills } from '../bills';
import { getRclProjects } from '../rcl';
import { getParliamentStats } from '../stats';

jest.mock('fs');
const mockFs = jest.mocked(fs);

describe('Data Loaders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock fs implementation
        mockFs.existsSync.mockImplementation((p: any) => {
            const ps = String(p);
            return ps.includes('mps.json') || ps.includes('senators.json') || ps.includes('bills.json') || 
                   ps.includes('projects.json') || ps.includes('74.json') || ps.includes('s1.json');
        });
        
        mockFs.readFileSync.mockImplementation((p: any) => {
            const ps = String(p);
            if (ps.includes('mps.json')) return JSON.stringify([{ id: '74', name: 'Adam' }]);
            if (ps.includes('senators.json')) return JSON.stringify([{ id: 's1', name: 'S' }]);
            if (ps.includes('bills.json')) return JSON.stringify([{ id: '1', title: 'Ustawa A' }]);
            if (ps.includes('projects.json')) return JSON.stringify([{ id: 'UD1', title: 'P' }]);
            if (ps.includes('74.json')) return JSON.stringify([{ sitting: 1, vote: 'YES' }]);
            if (ps.includes('s1.json')) return JSON.stringify([{ sitting: 49, vote: 'NO' }]);
            return '[]';
        });
    });

    it('getMPs returns Sejm members', async () => {
        const result = await getMPs();
        expect(result).toHaveLength(1);
        expect(result[0].chamber).toBe('Sejm');
    });

    it('getSenators returns Senat members', async () => {
        const result = await getSenators();
        expect(result).toHaveLength(1);
        expect(result[0].chamber).toBe('Senat');
    });

    it('getParliamentMembers merges both', async () => {
        const result = await getParliamentMembers();
        expect(result).toHaveLength(2);
    });

    it('getMP finds member', async () => {
        const result = await getMP('74');
        expect(result?.name).toBe('Adam');
    });

    it('getVotesForMP returns votes', async () => {
        const result = await getVotesForMP(74);
        expect(result).toHaveLength(1);
        expect(result[0].vote).toBe('YES');
    });

    it('getVotesForSenator returns votes', async () => {
        const result = await getVotesForSenator('s1');
        expect(result).toHaveLength(1);
        expect(result[0].vote).toBe('NO');
    });

    it('getBills returns bills', async () => {
        const result = await getBills();
        expect(result).toHaveLength(1);
    });

    it('getParliamentStats calculates totals', async () => {
        const stats = await getParliamentStats();
        expect(stats.total).toBe(2); // 1 MP + 1 Senator
    });
});
