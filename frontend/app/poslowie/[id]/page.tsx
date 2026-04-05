import { getMP } from "@/lib/mps";
import { getVotesForMP } from "@/lib/votes";
import MPDetailView from "./MPDetailView";
import VotingHistory from "./VotingHistory";
import MPStats from "./MPStats";
import MPTabs from "./MPTabs";
import MPAboutPanel from "./MPAboutPanel";
import MPInterpellationsPanel from "./MPInterpellationsPanel";
import { notFound } from "next/navigation";

export default async function MPPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const mp = await getMP(id);

    if (!mp) return notFound();

    const mpIdNum = parseInt(id, 10);
    const votes = !isNaN(mpIdNum) ? await getVotesForMP(mpIdNum) : [];

    const votingPanel = (
        <>
            <MPStats votes={votes} />
            <VotingHistory votes={votes} />
        </>
    );

    const aboutPanel = <MPAboutPanel mp={mp} />;

    const interpellationsPanel = <MPInterpellationsPanel mpName={mp.name} />;

    return (
        <>
            <MPDetailView mp={mp} />
            <div className="max-w-4xl mx-auto pb-20 fade-in -mt-16 px-8 md:px-12">
                <MPTabs
                    votingPanel={votingPanel}
                    aboutPanel={aboutPanel}
                    interpellationsPanel={interpellationsPanel}
                />
            </div>
        </>
    );
}
