const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'bills.json');
const API_URL = 'https://api.sejm.gov.pl/sejm/term10/processes';

function shouldFetch() {
    if (!fs.existsSync(OUTPUT_FILE)) return true;
    if (process.argv.includes('--force')) return true;

    const stats = fs.statSync(OUTPUT_FILE);
    const now = new Date();
    const ageInHours = (now - stats.mtime) / (1000 * 60 * 60);

    if (ageInHours < 24) {
        console.log(`[INFO] Processes data is fresh (${ageInHours.toFixed(1)}h old). Use --force to overwrite.`);
        return false;
    }
    return true;
}

async function fetchProcesses() {
    if (!shouldFetch()) return;

    console.log('[INFO] Fetching Legislative Processes from Sejm API...');

    try {
        // 1. Fetch List
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        let data = await response.json();
        console.log(`[INFO] Fetched list of ${data.length} processes. Fetching details...`);

        // Limit to 50 for now to be polite and fast, or take all if small
        data = data.slice(0, 50);

        // 2. Fetch Details for each
        const processes = [];
        for (const p of data) {
            try {
                // Use UE or number. API usually works with number for standard bills.
                // processes/{UE} or processes/{id}
                const id = p.UE === 'YES' ? `UE_${p.number}` : p.number;
                const url = `${API_URL}/${p.number}`; // Assuming number works for detail lookup

                const detailRes = await fetch(url);
                if (!detailRes.ok) {
                    console.warn(`[WARN] Failed to fetch details for ${p.number}`);
                    continue;
                }
                const detail = await detailRes.json();

                processes.push({
                    id: p.UE === 'YES' ? `UE_${p.number}` : p.number.toString(),
                    eli: detail.ELI,
                    title: detail.title,
                    description: detail.description,
                    documentType: detail.documentType,
                    isEU: detail.UE === 'YES' || detail.UE === 'YES/NO',
                    date: detail.documentDate,
                    term: detail.term,
                    urgency: detail.urgencyStatus,
                    stages: detail.stages ? detail.stages.map(s => ({
                        stageName: s.stageName,
                        date: s.date,
                        children: s.children ? s.children.map(c => ({
                            stageName: c.stageName,
                            date: c.date,
                            decision: c.decision
                        })) : []
                    })) : []
                });

                // Small delay to be polite
                await new Promise(r => setTimeout(r, 100));
                process.stdout.write('.');

            } catch (e) {
                console.error(`Error fetching ${p.number}:`, e);
            }
        }
        console.log(''); // Newline

        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processes, null, 2));
        console.log(`[SUCCESS] Saved ${processes.length} detailed processes to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('[ERROR] Failed to fetch processes:', error);
        process.exit(1);
    }
}

fetchProcesses();
