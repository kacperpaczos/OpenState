import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import VotingsList from "@/app/glosowania/VotingsList";
import { VotingSummary } from "@/lib/votings";

const makeVoting = (n: number, sitting = 1): VotingSummary => ({
    sitting, votingNumber: n, date: "2025-01-01",
    title: `Ustawa nr ${n}`, topic: `Temat ${n}`, kind: "ELECTRONIC",
});

// Build 60 votings across 2 sittings to test pagination
const manyVotings: VotingSummary[] = [
    ...Array.from({ length: 30 }, (_, i) => makeVoting(i + 1, 12)),
    ...Array.from({ length: 30 }, (_, i) => makeVoting(i + 1, 11)),
];

describe("VotingsList", () => {
    it("renders header with total count", () => {
        render(<VotingsList votings={manyVotings} />);
        expect(screen.getByText(/głosowań z/i)).toBeInTheDocument();
    });

    it("renders search input", () => {
        render(<VotingsList votings={manyVotings} />);
        expect(screen.getByTestId("voting-search")).toBeInTheDocument();
    });

    it("shows only 50 items by default", () => {
        render(<VotingsList votings={manyVotings} />);
        expect(screen.getByText(/Wyświetlam 50 z 60/i)).toBeInTheDocument();
    });

    it("shows load-more button when more items exist", () => {
        render(<VotingsList votings={manyVotings} />);
        expect(screen.getByTestId("load-more-votings")).toBeInTheDocument();
    });

    it("load-more shows remaining count", () => {
        render(<VotingsList votings={manyVotings} />);
        expect(screen.getByTestId("load-more-votings")).toHaveTextContent("10 pozostałych");
    });

    it("clicking load-more loads all items", async () => {
        const user = userEvent.setup();
        render(<VotingsList votings={manyVotings} />);
        await user.click(screen.getByTestId("load-more-votings"));
        await waitFor(() => {
            expect(screen.queryByTestId("load-more-votings")).not.toBeInTheDocument();
        });
    });

    it("filters by search query", async () => {
        const user = userEvent.setup();
        const specific = [
            makeVoting(1, 1),
            { ...makeVoting(2, 1), title: "Budżet Państwa", topic: "Finanse" },
        ];
        render(<VotingsList votings={specific} />);
        await user.type(screen.getByTestId("voting-search"), "Budżet");
        expect(screen.getByText("Budżet Państwa")).toBeInTheDocument();
        expect(screen.queryByText("Ustawa nr 1")).not.toBeInTheDocument();
    });

    it("shows no-results message for unmatched search", async () => {
        const user = userEvent.setup();
        render(<VotingsList votings={[makeVoting(1)]} />);
        await user.type(screen.getByTestId("voting-search"), "zzznomatch");
        expect(screen.getByText(/Brak wyników/i)).toBeInTheDocument();
    });

    it("each row links to the voting detail page", () => {
        render(<VotingsList votings={[makeVoting(3, 12)]} />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/glosowania/12/3");
    });

    it("does not show load-more when results fit on one page", () => {
        render(<VotingsList votings={[makeVoting(1), makeVoting(2)]} />);
        expect(screen.queryByTestId("load-more-votings")).not.toBeInTheDocument();
    });
});
