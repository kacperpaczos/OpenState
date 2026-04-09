import { getParliamentMembers } from "@/lib/mps";
import { getVotesForSenator } from "@/lib/votes";
import MPDetailView from "../../poslowie/[id]/MPDetailView";
import VotingHistory from "../../poslowie/[id]/VotingHistory";
import MPStats from "../../poslowie/[id]/MPStats";
import MPTabs from "../../poslowie/[id]/MPTabs";
import MPAboutPanel from "../../poslowie/[id]/MPAboutPanel";
import MPInterpellationsPanel from "../../poslowie/[id]/MPInterpellationsPanel";
import { notFound } from "next/navigation";

export default async function SenatorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const members = await getParliamentMembers();
    const mp = members.find(m => m.id === String(id));

    if (!mp || mp.chamber !== 'Senat') return notFound();

    const votes = await getVotesForSenator(mp.id);

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
