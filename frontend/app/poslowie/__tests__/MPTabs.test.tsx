import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import MPTabs from "@/app/poslowie/[id]/MPTabs";

const Voting = () => <div data-testid="voting-content">Głosowania panel</div>;
const About = () => <div data-testid="about-content">O Pośle panel</div>;
const Interp = () => <div data-testid="interp-content">Interpelacje panel</div>;

function renderTabs() {
    return render(
        <MPTabs
            votingPanel={<Voting />}
            aboutPanel={<About />}
            interpellationsPanel={<Interp />}
        />
    );
}

describe("MPTabs", () => {
    it("renders three tab buttons", () => {
        renderTabs();
        expect(screen.getByTestId("tab-glosowania")).toBeInTheDocument();
        expect(screen.getByTestId("tab-oposeł")).toBeInTheDocument();
        expect(screen.getByTestId("tab-interpelacje")).toBeInTheDocument();
    });

    it("shows Głosowania panel by default", () => {
        renderTabs();
        expect(screen.getByTestId("voting-content")).toBeInTheDocument();
        expect(screen.queryByTestId("about-content")).not.toBeInTheDocument();
        expect(screen.queryByTestId("interp-content")).not.toBeInTheDocument();
    });

    it("switches to O Pośle panel on click", async () => {
        const user = userEvent.setup();
        renderTabs();

        await user.click(screen.getByTestId("tab-oposeł"));
        expect(screen.queryByTestId("voting-content")).not.toBeInTheDocument();
        expect(screen.getByTestId("about-content")).toBeInTheDocument();
    });

    it("switches to Interpelacje panel on click", async () => {
        const user = userEvent.setup();
        renderTabs();

        await user.click(screen.getByTestId("tab-interpelacje"));
        expect(screen.queryByTestId("voting-content")).not.toBeInTheDocument();
        expect(screen.getByTestId("interp-content")).toBeInTheDocument();
    });

    it("can switch back to Głosowania after switching away", async () => {
        const user = userEvent.setup();
        renderTabs();

        await user.click(screen.getByTestId("tab-oposeł"));
        await user.click(screen.getByTestId("tab-glosowania"));
        expect(screen.getByTestId("voting-content")).toBeInTheDocument();
        expect(screen.queryByTestId("about-content")).not.toBeInTheDocument();
    });

    it("active tab button has highlighted styling", async () => {
        const user = userEvent.setup();
        renderTabs();

        const aboutTab = screen.getByTestId("tab-oposeł");
        await user.click(aboutTab);
        expect(aboutTab.className).toContain("bg-accent-blue");
    });

    it("inactive tabs do not have highlighted styling", () => {
        renderTabs();
        const aboutTab = screen.getByTestId("tab-oposeł");
        expect(aboutTab.className).not.toContain("bg-accent-blue");
    });
});
