import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import VotingHistory from "@/app/poslowie/[id]/VotingHistory";
import { VoteRecord } from "@/lib/votes";

const mockVotes: VoteRecord[] = [
    { sitting: 12, votingNumber: 1, date: "2025-01-10", title: "Ustawa budżetowa", topic: "Finanse", kind: "ELECTRONIC", vote: "YES" },
    { sitting: 12, votingNumber: 2, date: "2025-01-10", title: "Nowelizacja prawa", topic: "", kind: "ELECTRONIC", vote: "NO" },
    { sitting: 11, votingNumber: 5, date: "2024-12-15", title: "Projekt ochrony środowiska", topic: "Ekologia", kind: "ELECTRONIC", vote: "ABSTAIN" },
    { sitting: 11, votingNumber: 6, date: "2024-12-15", title: "Ustawa kolejowa", topic: "", kind: "ELECTRONIC", vote: "ABSENT" },
];

describe("VotingHistory (grouped by sitting)", () => {
    it("renders with vote count and sitting count summary", () => {
        render(<VotingHistory votes={mockVotes} />);
        expect(screen.getByText("4 głosowań · 2 posiedzeń")).toBeInTheDocument();
    });

    it("shows empty state when no votes", () => {
        render(<VotingHistory votes={[]} />);
        expect(screen.getByText("Brak danych o ostatnich głosowaniach.")).toBeInTheDocument();
    });

    it("renders posiedzenie groups sorted descending", () => {
        render(<VotingHistory votes={mockVotes} />);
        const headings = screen.getAllByText(/Posiedzenie \d+/);
        expect(headings[0]).toHaveTextContent("Posiedzenie 12");
        expect(headings[1]).toHaveTextContent("Posiedzenie 11");
    });

    it("shows vote tallies in the sitting header", () => {
        render(<VotingHistory votes={mockVotes} />);
        // Posiedzenie 12 has 1 yes and 1 no
        const group12 = screen.getByText("Posiedzenie 12").closest("button")!;
        expect(group12).toHaveTextContent("✓ 1"); // YES count
        expect(group12).toHaveTextContent("✗ 1"); // NO count
    });

    it("voting rows are hidden until sitting is expanded", async () => {
        render(<VotingHistory votes={mockVotes} />);
        expect(screen.queryByText("Ustawa budżetowa")).not.toBeInTheDocument();
    });

    it("expands a sitting and shows vote rows when clicked", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={mockVotes} />);

        const group12Button = screen.getByText("Posiedzenie 12").closest("button")!;
        await user.click(group12Button);

        expect(screen.getByText("Ustawa budżetowa")).toBeInTheDocument();
        expect(screen.getByText("Nowelizacja prawa")).toBeInTheDocument();
        // Sitting 11 still hidden
        expect(screen.queryByText("Projekt ochrony środowiska")).not.toBeInTheDocument();
    });

    it("each expanded row links to the voting detail page", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={mockVotes} />);

        await user.click(screen.getByText("Posiedzenie 12").closest("button")!);

        const links = screen.getAllByRole("link");
        const budgetLink = links.find(l => l.textContent?.includes("Ustawa budżetowa"));
        expect(budgetLink).toHaveAttribute("href", "/glosowania/12/1");
    });

    it("collapses sitting when clicked again", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={mockVotes} />);

        const btn = screen.getByText("Posiedzenie 12").closest("button")!;
        await user.click(btn);
        expect(screen.getByText("Ustawa budżetowa")).toBeInTheDocument();

        await user.click(btn);
        await waitFor(() => {
            expect(screen.queryByText("Ustawa budżetowa")).not.toBeInTheDocument();
        });
    });

    it("shows correct badge for each vote type", async () => {
        const user = userEvent.setup();
        render(<VotingHistory votes={mockVotes} />);
        await user.click(screen.getByText("Posiedzenie 12").closest("button")!);
        expect(screen.getByText("ZA")).toBeInTheDocument();
        expect(screen.getByText("PRZECIW")).toBeInTheDocument();
    });
});
