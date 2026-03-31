/**
 * Data Loader tests (tests 21-30)
 * Mock fs to test file-reading functions without actual files.
 */

import fs from 'fs';
import path from 'path';

// Mock the fs module
jest.mock('fs');
const mockFs = jest.mocked(fs);

describe('Data Loaders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // 21. getBills — file exists
    describe('getBills', () => {
        it('returns bills array when file exists', async () => {
            const { getBills } = require('../bills');
            const mockData = [
                { id: '1', title: 'Ustawa A', stages: [{ stageName: 'I Czytanie', date: '2026-01-01' }] },
                { id: '2', title: 'Ustawa B' },
            ];
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData));

            const result = await getBills();
            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Ustawa A');
            // Ensures stages array is added even if missing
            expect(result[1].stages).toEqual([]);
        });

        // 22. getBills — file does not exist
        it('returns empty array when file does not exist', async () => {
            const { getBills } = require('../bills');
            mockFs.existsSync.mockReturnValue(false);

            const result = await getBills();
            expect(result).toEqual([]);
        });
    });

    // 23. getMP exists
    describe('getMPs / getMP', () => {
        it('getMP returns MP when found', async () => {
            const { getMP } = require('../mps');
            const mockData = [
                { id: '123', name: 'Jan Kowalski', club: 'KO', district: 'Warszawa', email: '', active: true, photoUrl: '' },
            ];
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData));

            const result = await getMP('123');
            expect(result).toBeDefined();
            expect(result!.name).toBe('Jan Kowalski');
        });

        // 24. getMP not found
        it('getMP returns undefined when not found', async () => {
            const { getMP } = require('../mps');
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify([{ id: '1', name: 'A' }]));

            const result = await getMP('999');
            expect(result).toBeUndefined();
        });
    });

    // 25. getSenators
    describe('getSenators', () => {
        it('returns senators when file exists', async () => {
            const { getSenators } = require('../senators');
            const mockData = [
                { id: '1', name: 'Senator A', party: 'KO', club: 'KO', district: 'Wrocław', type: 'Senator' },
            ];
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData));

            const result = await getSenators();
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Senator A');
        });

        it('returns empty array when file missing', async () => {
            const { getSenators } = require('../senators');
            mockFs.existsSync.mockReturnValue(false);

            const result = await getSenators();
            expect(result).toEqual([]);
        });
    });

    // 26. getRclProjects
    describe('getRclProjects', () => {
        it('returns projects when file exists', async () => {
            const { getRclProjects } = require('../rcl');
            const mockData = [
                { id: 'UD1', title: 'Projekt A', url: '', applicant: 'MF', number: 'UD1', date: '2026-01-01' },
            ];
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData));

            const result = await getRclProjects();
            expect(result).toHaveLength(1);
        });
    });

    // 30. getVotesForMP — file not found
    describe('getVotesForMP', () => {
        it('returns empty array when file does not exist', async () => {
            const { getVotesForMP } = require('../votes');
            mockFs.existsSync.mockReturnValue(false);

            const result = await getVotesForMP(1);
            expect(result).toEqual([]);
        });

        it('returns votes when file exists', async () => {
            const { getVotesForMP } = require('../votes');
            const mockVotes = [
                { sitting: 1, votingNumber: 1, date: '2026-01-01', title: 'Vote 1', topic: '', kind: 'ELECTRONIC', vote: 'YES' },
            ];
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockVotes));

            const result = await getVotesForMP(1);
            expect(result).toHaveLength(1);
            expect(result[0].vote).toBe('YES');
        });
    });

    // 27-29: stats
    describe('stats functions', () => {
        beforeEach(() => {
            jest.resetModules();
        });

        it('getParliamentStats sums MPs + Senators', async () => {
            // We mock the underlying modules
            jest.doMock('../mps', () => ({
                getMPs: jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }, { id: '3' }]),
                getMP: jest.fn(),
                getParliamentMembers: jest.fn(),
            }));
            jest.doMock('../senators', () => ({
                getSenators: jest.fn().mockResolvedValue([{ id: 's1' }, { id: 's2' }]),
            }));
            jest.doMock('../bills', () => ({
                getBills: jest.fn().mockResolvedValue([]),
            }));
            jest.doMock('../votings', () => ({
                getSittings: jest.fn().mockResolvedValue([]),
            }));

            const { getParliamentStats } = require('../stats');
            const stats = await getParliamentStats();

            expect(stats.totalMPs).toBe(3);
            expect(stats.totalSenators).toBe(2);
            expect(stats.total).toBe(5);
        });
    });
});
