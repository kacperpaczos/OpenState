import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MPStats from "@/app/poslowie/[id]/MPStats";
import { VoteRecord } from "@/lib/votes";

const makeVote = (vote: string, sitting = 1, n = 1): VoteRecord => ({
    sitting, votingNumber: n, date: "2025-01-01",
    title: "Test", topic: "", kind: "ELECTRONIC", vote,
});

const mockVotes: VoteRecord[] = [
    makeVote("YES", 1, 1),
    makeVote("YES", 1, 2),
    makeVote("YES", 1, 3),
    makeVote("NO", 2, 1),
    makeVote("ABSTAIN", 2, 2),
    makeVote("ABSENT", 2, 3), // 1 absent → 5/6 present → 83%
];

describe("MPStats", () => {
    it("renders nothing when votes are empty", () => {
        const { container } = render(<MPStats votes={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it("shows the total vote count", () => {
        render(<MPStats votes={mockVotes} />);
        expect(screen.getByText("6 głosowań")).toBeInTheDocument();
    });

    it("calculates attendance percentage correctly (5/6 = 83%)", () => {
        render(<MPStats votes={mockVotes} />);
        const percentages = screen.getAllByText("83%");
        expect(percentages.length).toBeGreaterThan(0);
    });

    it("shows correct present / total text", () => {
        render(<MPStats votes={mockVotes} />);
        expect(screen.getByText("obecny na 5 z 6 głosowań")).toBeInTheDocument();
    });

    it("displays vote counts in summary chips", () => {
        render(<MPStats votes={mockVotes} />);
        expect(screen.getByText("3 ZA")).toBeInTheDocument();
        expect(screen.getByText("1 PRZECIW")).toBeInTheDocument();
        expect(screen.getByText("1 WSTRZ.")).toBeInTheDocument();
        expect(screen.getByText("1 NIEOB.")).toBeInTheDocument();
    });

    it("renders Statystyki Aktywności heading", () => {
        render(<MPStats votes={mockVotes} />);
        expect(screen.getByText("Statystyki Aktywności")).toBeInTheDocument();
    });

    it("shows 100% attendance when nobody is absent", () => {
        const fullVotes = [makeVote("YES"), makeVote("YES"), makeVote("NO")];
        render(<MPStats votes={fullVotes} />);
        const percentages = screen.getAllByText("100%");
        expect(percentages.length).toBeGreaterThan(0);
    });

    it("shows low attendance for mostly absent MP", () => {
        const loVotes = [
            makeVote("ABSENT", 1, 1), makeVote("ABSENT", 1, 2),
            makeVote("ABSENT", 1, 3), makeVote("YES", 1, 4),
        ]; // 1/4 = 25%
        render(<MPStats votes={loVotes} />);
        const percentages = screen.getAllByText("25%");
        expect(percentages.length).toBeGreaterThan(0);
    });
});
