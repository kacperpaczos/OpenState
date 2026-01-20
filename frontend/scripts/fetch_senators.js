const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const SENATE_LIST_URL = 'https://www.senat.gov.pl/sklad/senatorowie/';
// Output relative to this script: ../public/data/senators.json (since script is in jawny-sejm/scripts)
const OUTPUT_FILE = path.join(__dirname, '../public/data/senators.json');

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
    // Inspect showed: .senator-kontener
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
        let id = 'unknown';
        const idMatch = detailUrl.match(/senator,(\d+)/);
        if (idMatch) {
            id = idMatch[1];
        } else {
            id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }

        console.log(`Processing: ${name} (ID: ${id})`);

        // 4. Fetch Details
        // To speed up, we can skip fetching details if not strictly necessary for the list view,
        // but the requirements asked for Club/District/Email which seem to be on detail page.
        // However, fetching 100 pages might be slow.
        // Let's implement it but maybe limits for testing or parallelize slightly.
        const detailsHtml = await fetchHtml(detailUrl);
        let email = '';
        let club = '';
        let district = '';

        if (detailsHtml) {
            const detailDom = new JSDOM(detailsHtml);
            const dDoc = detailDom.window.document;

            // Email
            const emailLink = dDoc.querySelector('a[href^="mailto:"]');
            if (emailLink) email = emailLink.textContent.trim();

            // Club
            const clubLink = dDoc.querySelector('a[href*="/sklad/kluby-i-kola/"]');
            if (clubLink) club = clubLink.textContent.trim();

            // District (Okręg wyborczy) - typically in info
            // Looking for text "Okręg wyborczy nr X"
            const bodyText = dDoc.body.textContent;
            const districtMatch = bodyText.match(/Okręg wyborczy nr (\d+)/);
            if (districtMatch) district = districtMatch[1];
        }

        senators.push({
            id,
            name,
            email,
            club,
            district,
            photoUrl,
            detailUrl
        });

        // Small delay to be polite
        // await new Promise(r => setTimeout(r, 50));
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
