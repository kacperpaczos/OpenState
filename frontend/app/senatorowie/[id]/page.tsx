import { getSenators } from "@/lib/senators";
import SenatorDetailView from "./SenatorDetailView";
import { notFound } from "next/navigation";

export default async function SenatorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const senators = await getSenators();
    const senator = senators.find(s => s.id === id);

    if (!senator) {
        return notFound();
    }

    return <SenatorDetailView senator={senator} />;
}
