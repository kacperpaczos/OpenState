import { getSenators } from "@/lib/senators";
import { getVotesForSenator } from "@/lib/votes";
import SenatorDetailView from "./SenatorDetailView";
import VotingHistory from "../../poslowie/[id]/VotingHistory";
import { notFound } from "next/navigation";

export default async function SenatorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const senators = await getSenators();
    const senator = senators.find(s => s.id === id);

    if (!senator) {
        return notFound();
    }

    const votes = await getVotesForSenator(id);

    return (
        <>
            <SenatorDetailView senator={senator} />
            <div className="max-w-4xl mx-auto pb-20 fade-in -mt-16 px-8 md:px-12 relative z-20">
                <VotingHistory votes={votes} />
            </div>
        </>
    );
}
