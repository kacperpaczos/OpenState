const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'mps.json');
const API_URL = 'https://api.sejm.gov.pl/sejm/term10/MP';

// Check if data exists and is fresh (e.g., less than 24h old)
// The user explicitly requested smart refreshing to avoid unnecessary calls.
function shouldFetch() {
    if (!fs.existsSync(OUTPUT_FILE)) return true;

    // Check for --force flag
    if (process.argv.includes('--force')) return true;

    const stats = fs.statSync(OUTPUT_FILE);
    const now = new Date();
    const ageInHours = (now - stats.mtime) / (1000 * 60 * 60);

    if (ageInHours < 24) {
        console.log(`[INFO] MPs data is fresh (${ageInHours.toFixed(1)}h old). Use --force to overwrite.`);
        return false;
    }
    return true;
}

async function fetchMPs() {
    if (!shouldFetch()) return;

    console.log('[INFO] Fetching MPs from Sejm API...');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const data = await response.json();
        console.log(`[INFO] Fetched ${data.length} MPs.`);

        // Transform data to match our schema needs
        // We need: id, name, club, district, email (if available), photoUrl
        const mps = data.map(mp => ({
            id: mp.id.toString(),
            name: `${mp.firstName} ${mp.lastName}`,
            firstLastName: mp.firstLastName,
            club: mp.club,
            district: typeof mp.districtName === 'string' ? `${mp.districtName} (nr ${mp.districtNum})` : `Okręg ${mp.districtNum}`,
            email: mp.email || '',
            active: mp.active,
            photoUrl: `https://api.sejm.gov.pl/sejm/term10/MP/${mp.id}/photo`
        }));

        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mps, null, 2));
        console.log(`[SUCCESS] Saved ${mps.length} MPs to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('[ERROR] Failed to fetch MPs:', error);
        process.exit(1);
    }
}

fetchMPs();
