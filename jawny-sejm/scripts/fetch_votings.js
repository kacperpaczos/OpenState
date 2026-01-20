const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data/votings');
const API_URL = 'https://api.sejm.gov.pl/sejm/term10/votings';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function fetchVotings() {
    console.log('[INFO] Fetching records...');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(response.statusText);

        let sittings = await response.json();
        sittings.sort((a, b) => b.sitting - a.sitting);

        // Just take the very last sitting for now to be safe and fast
        const lastSitting = sittings[0];
        const sittingNum = lastSitting.sitting;

        console.log(`[INFO] Processing Sitting ${sittingNum}...`);

        const sittingRes = await fetch(`${API_URL}/${sittingNum}`);
        const votings = await sittingRes.json();

        // Take last 5 votings
        const targetVotings = votings.reverse().slice(0, 5);

        for (const v of targetVotings) {
            const votingNum = v.votingNumber;
            const file = path.join(DATA_DIR, `${sittingNum}_${votingNum}.json`);

            console.log(`Fetching ${sittingNum}/${votingNum}...`);
            const detailRes = await fetch(`${API_URL}/${sittingNum}/${votingNum}`);
            const detail = await detailRes.json();

            const simplified = {
                sitting: sittingNum,
                votingNumber: votingNum,
                date: detail.date,
                title: detail.title,
                topic: detail.topic,
                kind: detail.kind,
                votes: detail.votes ? detail.votes.map(vote => ({
                    mpId: vote.MP,
                    vote: vote.vote
                })) : []
            };

            fs.writeFileSync(file, JSON.stringify(simplified));
        }
        console.log('[SUCCESS] Done.');

    } catch (error) {
        console.error('[ERROR]', error);
    }
}

fetchVotings();
