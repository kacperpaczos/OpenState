import { NextResponse } from 'next/server';
import { getMPs } from '@/lib/mps';
import { getProcesses } from '@/lib/processes';
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
        getProcesses(),
        getInterpellations(),
        getRclProjects()
    ]);

    const results = [];

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
        if (bill.title.toLowerCase().includes(query) || bill.printNo?.includes(query)) {
            results.push({
                type: 'Ustawa',
                title: bill.title,
                subtitle: `Druk nr ${bill.printNo}`,
                url: `/ustawy` // Ideally deep link if possible
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
                subtitle: p.status,
                url: p.url,
                external: true
            });
        }
    });

    return NextResponse.json({ results: results.slice(0, 20) }); // Limit to 20 results
}
