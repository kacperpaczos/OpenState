import { NextResponse } from 'next/server';
import { getMPs } from '@/lib/mps';
import { getBills } from '@/lib/bills';
import { getInterpellations } from '@/lib/interpellations';
import { getRclProjects } from '@/lib/rcl';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const [mps, bills, interpellations, rcl] = await Promise.all([
        getMPs(),
        getBills(),
        getInterpellations(),
        getRclProjects()
    ]);

    const results: Array<{
        type: string;
        title: string;
        subtitle: string;
        url: string;
        external?: boolean;
    }> = [];

    // Search MPs
    mps.forEach(mp => {
        if (mp.name.toLowerCase().includes(query)) {
            results.push({
                type: 'Poseł',
                title: mp.name,
                subtitle: mp.club,
                url: `/poslowie/${mp.id}`
            });
        }
    });

    // Search Bills
    bills.forEach(bill => {
        if (bill.title.toLowerCase().includes(query) || bill.id?.includes(query)) {
            results.push({
                type: 'Ustawa',
                title: bill.title,
                subtitle: `Druk nr ${bill.id}`,
                url: `/ustawy/${bill.id}`
            });
        }
    });

    // Search Interpellations
    interpellations.slice(0, 1000).forEach(i => {
        if (i.title.toLowerCase().includes(query)) {
            results.push({
                type: 'Interpelacja',
                title: i.title,
                subtitle: `Nr ${i.num} • ${i.from.join(', ')}`,
                url: `/interpelacje` // Deep link needs detail page
            });
        }
    });

    // Search RCL
    rcl.forEach(p => {
        if (p.title.toLowerCase().includes(query)) {
            results.push({
                type: 'RCL',
                title: p.title,
                subtitle: p.status || 'RCL Project',
                url: p.url || '/rcl',
                external: true
            });
        }
    });

    return NextResponse.json({ results: results.slice(0, 20) }); // Limit to 20 results
}
