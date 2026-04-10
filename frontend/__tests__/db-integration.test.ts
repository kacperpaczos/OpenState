import { getMPs } from "../lib/mps";
import { getBills } from "../lib/bills";
import { getSittings } from "../lib/votings";

/**
 * Pure DB Integration Test
 * Verifies that the refactored data layer correctly fetches 
 * from PostgreSQL without relying on JSON files.
 */
describe("Database-Only Integration Tests", () => {
    jest.setTimeout(10000);
    
    test("getMPs should return data from PostgreSQL", async () => {
        try {
            const mps = await getMPs();
            expect(Array.isArray(mps)).toBe(true);
            // Even if the DB is empty during tests, it shouldn't throw a JSON-related error
            console.log(`[Test] Successfully fetched ${mps.length} MPs from DB.`);
        } catch (error) {
            console.error("Test failed: getMPs error", error);
            throw error;
        }
    });

    test("getBills should return data from PostgreSQL with stages", async () => {
        try {
            const bills = await getBills();
            expect(Array.isArray(bills)).toBe(true);
            console.log(`[Test] Successfully fetched ${bills.length} Bills from DB.`);
        } catch (error) {
            console.error("Test failed: getBills error", error);
            throw error;
        }
    });

    test("getSittings should return the sittings list from PostgreSQL", async () => {
        try {
            const sittings = await getSittings();
            expect(Array.isArray(sittings)).toBe(true);
            console.log(`[Test] Successfully fetched ${sittings.length} Sittings from DB.`);
        } catch (error) {
            console.error("Test failed: getSittings error", error);
            throw error;
        }
    });
});
