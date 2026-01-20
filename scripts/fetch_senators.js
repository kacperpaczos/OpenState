const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const SENATE_LIST_URL = 'https://www.senat.gov.pl/sklad/senatorowie/';
// We need to fetch 'all' senators. Inspect showed 'Zobacz wszystkich', but often main url has pagination or loads all.
// Let's assume the main URL might be paginated or we need a parameter.
// Actually, 'https://www.senat.gov.pl/sklad/senatorowie/?kadencja=11' usually works.
// Or we check if there is a 'show all' link.
// Based on typical browsing, often the main list is paginated.
// Let's try to fetch the main page and see if we can find 'Zobacz wszystkich' link to follow, or just iterate pages.
// BUT for simplicity, looking at the URL structure /sklad/senatorowie/ usually lists or has pagination.
// Let's assume we fetch the main one and check for pagination.

// Actually, easier strategy: The main page lists *some*. The "Zobacz wszystkich" link usually points to a view with all.
// I'll implement a simple fetcher that gets the main page, looks for "Zobacz wszystkich", fetches that if exists, otherwise uses current page.

const OUTPUT_FILE = path.join(__dirname, '../jawny-sejm/public/data/senators.json');

async function fetchHtml(url) {
    console.log(`Fetching ${url}...`);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
        return await response.text();
    } catch (e) {
        console.error(`Error fetching ${url}:`, e);
        return null;
    }
}

async function scrapeSenators() {
    // 1. Get Main List
    let html = await fetchHtml(SENATE_LIST_URL);
    if (!html) return;

    let dom = new JSDOM(html);
    let doc = dom.window.document;

    // Check for "Zobacz wszystkich"
    // Inspect showed: <a ...>Zobacz wszystkich</a>
    const seeAllLink = Array.from(doc.querySelectorAll('a')).find(a => a.textContent.includes('Zobacz wszystkich'));
    if (seeAllLink) {
        let seeAllUrl = seeAllLink.href;
        if (seeAllUrl.startsWith('/')) seeAllUrl = 'https://www.senat.gov.pl' + seeAllUrl;
        console.log(`Found 'See All' link: ${seeAllUrl}`);
        html = await fetchHtml(seeAllUrl);
        if (html) {
            dom = new JSDOM(html);
            doc = dom.window.document;
        }
    }

    // 2. Identify Senators
    // Inspect said: .senator-kontener
    const senatorContainers = doc.querySelectorAll('.senator-kontener');
    console.log(`Found ${senatorContainers.length} senator containers.`);

    const senators = [];

    // 3. Process each
    for (const container of senatorContainers) {
        const linkEl = container.querySelector('a');
        const imgEl = container.querySelector('.zdjecie img');

        if (!linkEl) continue;

        let name = linkEl.textContent.trim();
        let detailUrl = linkEl.href;
        if (detailUrl.startsWith('/')) detailUrl = 'https://www.senat.gov.pl' + detailUrl;

        let photoUrl = imgEl ? imgEl.src : '';
        if (photoUrl && photoUrl.startsWith('/')) photoUrl = 'https://www.senat.gov.pl' + photoUrl;

        // ID from URL (e.g., senator,951,11,rafal-ambrozik.html -> 951) or just slug
        // logic: .../senator,[ID],...
        let id = 'unknown';
        const idMatch = detailUrl.match(/senator,(\d+)/);
        if (idMatch) {
            id = idMatch[1];
        } else {
            id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }

        console.log(`Processing: ${name} (ID: ${id})`);

        // 4. Fetch Details
        const detailsHtml = await fetchHtml(detailUrl);
        let email = '';
        let club = '';

        if (detailsHtml) {
            const detailDom = new JSDOM(detailsHtml);
            const dDoc = detailDom.window.document;

            // Email
            const emailLink = dDoc.querySelector('a[href^="mailto:"]');
            if (emailLink) email = emailLink.textContent.trim();

            // Club
            // Inspect: a[href*="/sklad/kluby-i-kola/"]
            const clubLink = dDoc.querySelector('a[href*="/sklad/kluby-i-kola/"]');
            if (clubLink) club = clubLink.textContent.trim();
        }

        senators.push({
            id,
            name,
            email,
            club,
            photoUrl,
            detailUrl
        });

        // Be nice
        // await new Promise(r => setTimeout(r, 100)); 
    }

    // 5. Save
    console.log(`Saving ${senators.length} senators to ${OUTPUT_FILE}...`);

    // Ensure dir exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(senators, null, 2), 'utf-8');
    console.log("Done.");
}

scrapeSenators();
