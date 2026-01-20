import { getMPs } from "@/lib/mps";
import { getSenators } from "@/lib/senators";
import MPsList from "./MPsList";

export default async function MPsPage() {
    const [mps, senators] = await Promise.all([getMPs(), getSenators()]);

    // Normalize and merge
    const normalizedMPs = mps.map(mp => ({ ...mp, chamber: 'Sejm' as const }));
    const normalizedSenators = senators.map(s => ({
        id: s.id,
        name: s.name,
        firstLastName: s.name, // Senator data doesn't have split name, use full
        club: s.club,
        district: s.district,
        email: s.email,
        active: true, // Data doesn't have active field, assume true
        photoUrl: s.photoUrl,
        chamber: 'Senat' as const,
        detailUrl: s.detailUrl
    }));

    // @ts-ignore - merged array
    const all = [...normalizedMPs, ...normalizedSenators];

    return (
        // @ts-ignore
        <MPsList initialMPs={all} />
    );
}
