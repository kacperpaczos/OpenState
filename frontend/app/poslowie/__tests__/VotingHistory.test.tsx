import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import VotingHistory from "@/app/poslowie/[id]/VotingHistory";
import { VoteRecord } from "@/lib/votes";

// Helper to build a VoteRecord with explicit n for votingNumber
const makeVote = (vote: string, sitting = 1, n = 1): VoteRecord => ({
    sitting, votingNumber: n, date: "2025-01-10", title: `Głosowanie ${sitting}-${n}`,
    topic: "", kind: "ELECTRONIC", vote,
});

const mockVotes: VoteRecord[] = [
    makeVote("YES", 12, 1),
    makeVote("NO", 12, 2),
    makeVote("ABSTAIN", 11, 5),
    makeVote("ABSENT", 11, 6),
];

// Build 60 votes to test pagination (> 50 page size)
const manyVotes: VoteRecord[] = Array.from({ length: 60 }, (_, i) =>
    makeVote(i % 2 === 0 ? "YES" : "NO", Math.floor(i / 10) + 1, (i % 10) + 1)
);

describe("VotingHistory", () => {
    // ── Empty state ──────────────────────────────────────────────────────────
    it("renders empty state when no votes", () => {
        render(<VotingHistory votes={[]} />);
        expect(screen.getByText("Brak danych o ostatnich głosowaniach.")).toBeInTheDocument();
    });

    // ── Grouping & sorting ───────────────────────────────────────────────────
    it("groups votes by sitting, newest first", () => {
        render(<VotingHistory votes={mockVotes} />);
        const headings = screen.getAllByText(/Posiedzenie \d+/);
        expect(headings[0]).toHaveTextContent("Posiedzenie 12");
        expect(headings[1]).toHaveTextContent("Posiedzenie 11");
    });

    // ── Filter buttons ───────────────────────────────────────────────────────
    it("renders all 5 filter buttons", () => {
        render(<VotingHistory votes={mockVotes} />);
        expect(screen.getByTestId("filter-ALL")).toBeInTheDocument();
        expect(screen.getByTestId("filter-YES")).toBeInTheDocument();
        expect(screen.getByTestId("filter-NO")).toBeInTheDocument();
        expect(screen.getByTestId("filter-ABSTAIN")).toBeInTheDocument();
        expect(screen.getByTestId("filter-ABSENT")).toBeInTheDocument();
    });

    it("filters to only YES votes when ZA clicked", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={mockVotes} />);

        await user.click(screen.getByTestId("filter-YES"));
        // Now expand the one visible sitting
        const btn = screen.getByText("Posiedzenie 12").closest("button")!;
        await user.click(btn);

        expect(screen.getByText("Głosowanie 12-1")).toBeInTheDocument(); // YES vote
        expect(screen.queryByText("Głosowanie 12-2")).not.toBeInTheDocument(); // NO vote — should be gone
    });

    it("shows no-results message when filter yields nothing", async () => {
        const user = userEvent.setup();
        // All votes are YES, no AGAINST votes
        const yesOnly = [makeVote("YES", 1, 1), makeVote("YES", 1, 2)];
        render(<VotingHistory votes={yesOnly} />);

        await user.click(screen.getByTestId("filter-NO"));
        expect(screen.getByText("Brak głosowań dla wybranego filtra.")).toBeInTheDocument();
    });

    it("resets to page 1 when filter changes", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={manyVotes} />);

        // Load more first
        await user.click(screen.getByTestId("load-more"));
        // Switch filter — should go back to 50
        await user.click(screen.getByTestId("filter-YES"));
        // Should show only YES votes (30 of 60), within limit → no load-more
        expect(screen.queryByTestId("load-more")).not.toBeInTheDocument();
    });

    // ── Pagination ───────────────────────────────────────────────────────────
    it("does not show load-more when votes <= 50", () => {
        render(<VotingHistory votes={mockVotes} />);
        expect(screen.queryByTestId("load-more")).not.toBeInTheDocument();
    });

    it("shows load-more when votes > 50", () => {
        render(<VotingHistory votes={manyVotes} />);
        expect(screen.getByTestId("load-more")).toBeInTheDocument();
        expect(screen.getByTestId("load-more")).toHaveTextContent("10 pozostałych");
    });

    it("loads more votes when button clicked", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={manyVotes} />);
        await user.click(screen.getByTestId("load-more"));
        // Now all 60 are loaded — load-more gone
        await waitFor(() => {
            expect(screen.queryByTestId("load-more")).not.toBeInTheDocument();
        });
    });

    // ── Expand / collapse ────────────────────────────────────────────────────
    it("expands a sitting and shows vote rows", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={mockVotes} />);

        expect(screen.queryByText("Głosowanie 12-1")).not.toBeInTheDocument();
        await user.click(screen.getByText("Posiedzenie 12").closest("button")!);
        expect(screen.getByText("Głosowanie 12-1")).toBeInTheDocument();
    });

    it("links each row to the voting detail page", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={mockVotes} />);
        await user.click(screen.getByText("Posiedzenie 12").closest("button")!);

        const links = screen.getAllByRole("link");
        const row = links.find(l => l.textContent?.includes("Głosowanie 12-1"));
        expect(row).toHaveAttribute("href", "/glosowania/12/1");
    });

    it("collapses sitting when clicked again", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={mockVotes} />);

        const btn = screen.getByText("Posiedzenie 12").closest("button")!;
        await user.click(btn);
        expect(screen.getByText("Głosowanie 12-1")).toBeInTheDocument();
        await user.click(btn);
        await waitFor(() => {
            expect(screen.queryByText("Głosowanie 12-1")).not.toBeInTheDocument();
        });
    });
});
