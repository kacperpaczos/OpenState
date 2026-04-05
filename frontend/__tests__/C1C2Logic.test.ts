/**
 * Tests for getVotingsForBill (C1) and computeAgreement logic (C2)
 */
import { VotingSummary } from "@/lib/votings";

// ── C1: getVotingsForBill matching ───────────────────────────────────────────

function matchesForBill(billId: string, voting: VotingSummary): boolean {
    const patterns = [
        `druk nr ${billId}`,
        `druk nr. ${billId}`,
        `(${billId})`,
        `nr ${billId}`,
    ];
    const hay = `${voting.title} ${voting.topic ?? ""}`.toLowerCase();
    return patterns.some(p => hay.includes(p.toLowerCase()));
}

const makeVoting = (title: string, topic = ""): VotingSummary => ({
    sitting: 1, votingNumber: 1, date: "2025-01-01", title, topic, kind: "ELECTRONIC",
});

describe("C1: Bill-Voting matching", () => {
    it("matches 'druk nr 402' pattern", () => {
        expect(matchesForBill("402", makeVoting("Pkt. 1 (druk nr 402) o zmianie ustawy"))).toBe(true);
    });

    it("matches 'druk nr. 402' with dot", () => {
        expect(matchesForBill("402", makeVoting("Sprawozdanie druk nr. 402"))).toBe(true);
    });

    it("matches '(402)' pattern", () => {
        expect(matchesForBill("402", makeVoting("Ustawa (402) o finansach"))).toBe(true);
    });

    it("matches 'nr 402' pattern", () => {
        expect(matchesForBill("402", makeVoting("Wniosek o odraczanie nr 402"))).toBe(true);
    });

    it("matches billId in topic field", () => {
        expect(matchesForBill("402", makeVoting("Głosowanie ogólne", "druk nr 402"))).toBe(true);
    });

    it("does NOT match unrelated voting", () => {
        expect(matchesForBill("402", makeVoting("Wniosek o przerwę"))).toBe(false);
    });

    it("does NOT match partial number (402 in 1402)", () => {
        // '(1402)' should NOT match billId 402
        expect(matchesForBill("402", makeVoting("Ustawa (1402) o czymś"))).toBe(false);
    });
});

// ── C2: MP Agreement calculation ─────────────────────────────────────────────

import { VoteRecord } from "@/lib/votes";

function computeAgreement(votesA: VoteRecord[], votesB: VoteRecord[]) {
    const mapB = new Map<string, string>(
        votesB.map(v => [`${v.sitting}-${v.votingNumber}`, v.vote])
    );
    let agree = 0, disagree = 0, total = 0;
    for (const va of votesA) {
        const key = `${va.sitting}-${va.votingNumber}`;
        const vb = mapB.get(key);
        if (!vb) continue;
        if (va.vote === "ABSENT" && vb === "ABSENT") continue;
        total++;
        if (va.vote === vb) agree++;
        else if (va.vote !== "ABSENT" && vb !== "ABSENT") disagree++;
    }
    return { agree, disagree, total, pct: total > 0 ? Math.round((agree / total) * 100) : null };
}

const makeVote = (vote: string, sitting = 1, n = 1): VoteRecord => ({
    sitting, votingNumber: n, date: "2025-01-01", title: "Test", topic: "", kind: "ELECTRONIC", vote,
});

describe("C2: MP vote agreement calculation", () => {
    it("returns 100% when both always vote the same", () => {
        const v = [makeVote("YES", 1, 1), makeVote("NO", 1, 2)];
        const { pct } = computeAgreement(v, v);
        expect(pct).toBe(100);
    });

    it("returns 0% when always vote opposite", () => {
        const a = [makeVote("YES", 1, 1), makeVote("YES", 1, 2)];
        const b = [makeVote("NO", 1, 1), makeVote("NO", 1, 2)];
        const { pct } = computeAgreement(a, b);
        expect(pct).toBe(0);
    });

    it("returns 50% for half agree half disagree", () => {
        const a = [makeVote("YES", 1, 1), makeVote("YES", 1, 2)];
        const b = [makeVote("YES", 1, 1), makeVote("NO", 1, 2)];
        const { pct } = computeAgreement(a, b);
        expect(pct).toBe(50);
    });

    it("excludes voting where BOTH are absent", () => {
        const a = [makeVote("ABSENT", 1, 1)];
        const b = [makeVote("ABSENT", 1, 1)];
        const { total, pct } = computeAgreement(a, b);
        expect(total).toBe(0);
        expect(pct).toBeNull();
    });

    it("includes voting where ONE is absent and other voted", () => {
        const a = [makeVote("ABSENT", 1, 1)];
        const b = [makeVote("YES", 1, 1)];
        const { total } = computeAgreement(a, b);
        expect(total).toBe(1);
    });

    it("returns null pct when no common votings", () => {
        const a = [makeVote("YES", 1, 1)];
        const b = [makeVote("YES", 2, 5)]; // different sitting
        const { pct } = computeAgreement(a, b);
        expect(pct).toBeNull();
    });

    it("counts agree and disagree correctly", () => {
        const a = [makeVote("YES", 1, 1), makeVote("NO", 1, 2), makeVote("YES", 1, 3)];
        const b = [makeVote("YES", 1, 1), makeVote("YES", 1, 2), makeVote("YES", 1, 3)];
        const { agree, disagree } = computeAgreement(a, b);
        expect(agree).toBe(2);
        expect(disagree).toBe(1);
    });
});
