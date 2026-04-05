import { getAllVotings } from "@/lib/votings";
import VotingsList from "./VotingsList";

export default async function VotingsPage() {
    const votings = await getAllVotings();
    return <VotingsList votings={votings} />;
}
