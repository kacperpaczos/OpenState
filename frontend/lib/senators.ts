import { db } from "@/src/db";
import { deputies, type Deputy } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export interface Senator {
    id: string;
    name: string;
    party: string;
    club: string;
    district: string;
    email?: string;
    photoUrl?: string;
    detailsUrl?: string;
    type: 'Senator';
}

export async function getSenators(): Promise<Senator[]> {
    try {
        const dbSenators = await db.select().from(deputies).where(eq(deputies.type, 'Senator'));
        return dbSenators.map((s: Deputy) => ({
            id: s.id.toString(),
            name: s.name,
            party: s.party || 'Niezależny',
            club: s.club || '',
            district: s.district || '',
            email: s.email || undefined,
            photoUrl: s.photoUrl || undefined,
            type: 'Senator' as const
        }));
    } catch (e) {
        console.error("Database error fetching senators:", e);
        throw e;
    }
}
