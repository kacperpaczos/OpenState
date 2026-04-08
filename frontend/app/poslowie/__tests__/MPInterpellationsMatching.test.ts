/**
 * Unit tests for the interpellations name-matching logic used in MPInterpellationsPanel.
 *
 * The panel filters all interpellations by checking that EVERY word in the MP's name
 * appears in at least one entry in `i.from`. This prevents the old bug where only the
 * last word (surname) was used, causing false positives for MPs sharing a surname.
 */

import type { Interpellation } from "@/lib/interpellations";

// Pure helper — mirrors the logic in MPInterpellationsPanel
function matchByFullName(mpName: string, from: string[]): boolean {
    const nameParts = mpName.toLowerCase().trim().split(/\s+/);
    return from.some(f => {
        const fLow = f.toLowerCase();
        return nameParts.every(part => fLow.includes(part));
    });
}

function makeInterpellation(from: string[]): Interpellation {
    return {
        num: 1,
        term: 10,
        title: "Test interpelacji",
        receiptDate: "2025-01-01",
        lastModified: "2025-01-01",
        from,
        to: ["Minister"],
    };
}

describe("MPInterpellationsPanel — name matching logic", () => {

    it("matches when full name is present in from[]", () => {
        const result = matchByFullName("Jan Kowalski", ["Jan Kowalski"]);
        expect(result).toBe(true);
    });

    it("matches case-insensitively", () => {
        const result = matchByFullName("Jan Kowalski", ["JAN KOWALSKI"]);
        expect(result).toBe(true);
    });

    it("does NOT match when only surname matches (old bug)", () => {
        // 'Kowalski' alone must NOT match 'Anna Kowalska' for MP 'Jan Kowalski'
        const result = matchByFullName("Jan Kowalski", ["Anna Kowalska"]);
        expect(result).toBe(false);
    });

    it("does NOT match a different person with same surname", () => {
        // Two MPs with surname 'Nowak' — must not cross-match
        const result = matchByFullName("Adam Nowak", ["Ewa Nowak"]);
        expect(result).toBe(false);
    });

    it("matches when from[] contains full name among multiple authors", () => {
        const result = matchByFullName("Jan Kowalski", ["Ewa Nowak", "Jan Kowalski", "Anna Zielinska"]);
        expect(result).toBe(true);
    });

    it("returns false when from[] is empty", () => {
        const result = matchByFullName("Jan Kowalski", []);
        expect(result).toBe(false);
    });

    it("works correctly on a built Interpellation object", () => {
        const interp = makeInterpellation(["Jan Kowalski"]);
        const nameParts = "Jan Kowalski".toLowerCase().split(/\s+/);
        const matched = interp.from.some(f => nameParts.every(p => f.toLowerCase().includes(p)));
        expect(matched).toBe(true);
    });

    it("handles multi-word names (3 words)", () => {
        expect(matchByFullName("Anna Maria Nowak", ["Anna Maria Nowak"])).toBe(true);
        expect(matchByFullName("Anna Maria Nowak", ["Anna Nowak"])).toBe(false);
    });
});
