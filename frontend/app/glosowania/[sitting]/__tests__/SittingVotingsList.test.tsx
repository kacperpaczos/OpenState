import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SittingVotingsList from "@/app/glosowania/[sitting]/SittingVotingsList";
import { VotingSummary } from "@/lib/votings";

jest.mock("next/link", () => {
    return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

const makeVoting = (n: number, sitting = 12): VotingSummary => ({
    sitting,
    votingNumber: n,
    date: "2025-01-01",
    title: `Ustawa nr ${n}`,
    topic: `Temat ${n}`,
    kind: "ELECTRONIC",
});

const mockVotings = [
    makeVoting(1),
    makeVoting(2),
    makeVoting(3),
];

describe("SittingVotingsList", () => {

    // ── Rendering ────────────────────────────────────────────────────────────
    it("renders all voting titles", () => {
        render(<SittingVotingsList votings={mockVotings} sitting="12" />);
        expect(screen.getByText("Ustawa nr 1")).toBeInTheDocument();
        expect(screen.getByText("Ustawa nr 2")).toBeInTheDocument();
        expect(screen.getByText("Ustawa nr 3")).toBeInTheDocument();
    });

    it("shows count in header text", () => {
        render(<SittingVotingsList votings={mockVotings} sitting="12" />);
        expect(screen.getByText(/z 3/i)).toBeInTheDocument();
    });

    // ── Each row is a Link (bug fix regression test) ─────────────────────────
    it("each row links to the correct voting detail page", () => {
        render(<SittingVotingsList votings={mockVotings} sitting="12" />);
        const links = screen.getAllByRole("link");
        // Every voting should have a link
        expect(links.length).toBeGreaterThanOrEqual(mockVotings.length);
        // First voting → /glosowania/12/1
        const firstLink = links.find(l => l.textContent?.includes("Ustawa nr 1"));
        expect(firstLink).toHaveAttribute("href", "/glosowania/12/1");
    });

    it("links point to correct sitting number from prop", () => {
        render(<SittingVotingsList votings={[makeVoting(5, 99)]} sitting="99" />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/glosowania/99/5");
    });

    // ── Pagination ───────────────────────────────────────────────────────────
    it("does not show pagination for 30 or fewer votings", () => {
        render(<SittingVotingsList votings={mockVotings} sitting="12" />);
        expect(screen.queryByRole("button", { name: /Następna/i })).not.toBeInTheDocument();
    });

    it("shows pagination controls when votings exceed page size", () => {
        const manyVotings = Array.from({ length: 35 }, (_, i) => makeVoting(i + 1));
        render(<SittingVotingsList votings={manyVotings} sitting="12" />);
        expect(screen.getByRole("button", { name: /Następna/i })).toBeInTheDocument();
    });

    it("previous button is disabled on first page", () => {
        const manyVotings = Array.from({ length: 35 }, (_, i) => makeVoting(i + 1));
        render(<SittingVotingsList votings={manyVotings} sitting="12" />);
        const prev = screen.getByRole("button", { name: /Poprzednia/i });
        expect(prev).toBeDisabled();
    });

    it("next button navigates to page 2", async () => {
        const user = userEvent.setup();
        const manyVotings = Array.from({ length: 35 }, (_, i) => makeVoting(i + 1));
        render(<SittingVotingsList votings={manyVotings} sitting="12" />);

        await user.click(screen.getByRole("button", { name: /Następna/i }));
        // Page 2 shows items 31-35
        expect(screen.getByText("Ustawa nr 31")).toBeInTheDocument();
        // Item 1 should no longer be visible
        expect(screen.queryByText("Ustawa nr 1")).not.toBeInTheDocument();
    });
});
