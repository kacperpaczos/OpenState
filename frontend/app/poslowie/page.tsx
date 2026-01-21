import { getMPs } from "@/lib/mps";
import { getSenators } from "@/lib/senators";
import MPsList from "./MPsList";

export default async function MPsPage() {
    const [mps, senators] = await Promise.all([getMPs(), getSenators()]);

    // Normalize and merge
    const normalizedMPs = mps.map(mp => ({ ...mp, chamber: 'Sejm' as const }));
    const normalizedSenators = senators.map(s => ({
        ...s,
        firstLastName: s.name,
        active: true,
        chamber: 'Senat' as const,
    }));

    // @ts-ignore - merged array
    const all = [...normalizedMPs, ...normalizedSenators];

    return (
        // @ts-ignore
        <MPsList initialMPs={all} />
    );
}
