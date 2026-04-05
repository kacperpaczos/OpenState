import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next/navigation for notFound
jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

// Mock the data-loading functions
jest.mock("../../../lib/votings", () => ({
    getVotingDetails: jest.fn(),
    getSittingVotings: jest.fn(),
}));

import { getVotingDetails, getSittingVotings } from "../../../lib/votings";
import VotingDetailPage from "../[sitting]/[voting]/page";

const mockGetVotingDetails = getVotingDetails as jest.Mock;
const mockGetSittingVotings = getSittingVotings as jest.Mock;

const mockDetails = {
    title: "Ratyfikacja Umowy o Partnerstwie z UE",
    topic: "Polityka zagraniczna",
    date: "2025-03-15",
    kind: "ELECTRONIC",
    votes: [
        { MP: 442, vote: "YES", club: "Razem" },
        { MP: 195, vote: "NO", club: "KO" },
        { MP: 100, vote: "ABSTAIN", club: "PSL" },
        { MP: 200, vote: "ABSENT", club: "PiS" },
    ],
};

describe("VotingDetailPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the voting title and date", async () => {
        mockGetVotingDetails.mockResolvedValue(mockDetails);
        const page = await VotingDetailPage({ params: Promise.resolve({ sitting: "12", voting: "3" }) });
        render(page);

        expect(screen.getByText("Ratyfikacja Umowy o Partnerstwie z UE")).toBeInTheDocument();
        expect(screen.getByText("2025-03-15 · ELECTRONIC")).toBeInTheDocument();
    });

    it("shows posiedzenie and voting numbers", async () => {
        mockGetVotingDetails.mockResolvedValue(mockDetails);
        const page = await VotingDetailPage({ params: Promise.resolve({ sitting: "12", voting: "3" }) });
        render(page);

        expect(screen.getByText(/Posiedzenie 12/)).toBeInTheDocument();
        expect(screen.getByText(/Głosowanie nr 3/)).toBeInTheDocument();
    });

    it("renders result bars section", async () => {
        mockGetVotingDetails.mockResolvedValue(mockDetails);
        const page = await VotingDetailPage({ params: Promise.resolve({ sitting: "12", voting: "3" }) });
        render(page);

        expect(screen.getByText("Wynik głosowania")).toBeInTheDocument();
        expect(screen.getByText("Za")).toBeInTheDocument();
        expect(screen.getByText("Przeciw")).toBeInTheDocument();
        expect(screen.getByText("Wstrzymało się")).toBeInTheDocument();
        expect(screen.getByText("Nieobecni")).toBeInTheDocument();
    });

    it("shows accepted badge when yes > no", async () => {
        const passedDetails = {
            ...mockDetails, votes: [
                { MP: 1, vote: "YES" }, { MP: 2, vote: "YES" }, { MP: 3, vote: "NO" }
            ]
        };
        mockGetVotingDetails.mockResolvedValue(passedDetails);
        const page = await VotingDetailPage({ params: Promise.resolve({ sitting: "12", voting: "3" }) });
        render(page);

        expect(screen.getByText("✓ Przyjęto")).toBeInTheDocument();
    });

    it("shows rejected badge when no > yes", async () => {
        const rejectedDetails = {
            ...mockDetails, votes: [
                { MP: 1, vote: "YES" }, { MP: 2, vote: "NO" }, { MP: 3, vote: "NO" }
            ]
        };
        mockGetVotingDetails.mockResolvedValue(rejectedDetails);
        const page = await VotingDetailPage({ params: Promise.resolve({ sitting: "12", voting: "3" }) });
        render(page);

        expect(screen.getByText("✗ Odrzucono")).toBeInTheDocument();
    });

    it("each person's vote links to their MP profile", async () => {
        mockGetVotingDetails.mockResolvedValue(mockDetails);
        const page = await VotingDetailPage({ params: Promise.resolve({ sitting: "12", voting: "3" }) });
        render(page);

        const link = screen.getByRole("link", { name: /Poseł #442/ });
        expect(link).toHaveAttribute("href", "/poslowie/442");
    });

    it("shows fallback when voting details not found but basic info exists", async () => {
        mockGetVotingDetails.mockResolvedValue(null);
        mockGetSittingVotings.mockResolvedValue([
            { votingNumber: 3, title: "Głosowanie podstawowe", topic: "", date: "2025-01-01", kind: "ELECTRONIC", sitting: 12 }
        ]);
        const page = await VotingDetailPage({ params: Promise.resolve({ sitting: "12", voting: "3" }) });
        render(page);

        expect(screen.getByText("Głosowanie podstawowe")).toBeInTheDocument();
        expect(screen.getByText(/Szczegółowe dane o głosujących/)).toBeInTheDocument();
    });
});
