import { getMP } from "@/lib/mps";
import { getVotesForMP } from "@/lib/votes";
import MPDetailView from "./MPDetailView";
import VotingHistory from "./VotingHistory";
import MPStats from "./MPStats";
import { notFound } from "next/navigation";

export default async function MPPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const mp = await getMP(id);

    if (!mp) {
        return notFound();
    }

    // Convert string ID to number for voting lookup
    const mpIdNum = parseInt(id, 10);
    const votes = !isNaN(mpIdNum) ? await getVotesForMP(mpIdNum) : [];

    return (
        <>
            <MPDetailView mp={mp} />
            <div className="max-w-4xl mx-auto pb-20 fade-in -mt-16 px-8 md:px-12">
                <MPStats votes={votes} />
                <VotingHistory votes={votes} />
            </div>
        </>
    );
}

