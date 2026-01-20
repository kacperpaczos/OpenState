const https = require('https');
const fs = require('fs');

const url = 'https://api.sejm.gov.pl/sejm/term10/MP';

console.log('Fetching MP list from Sejm API...');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const mps = JSON.parse(data);
            console.log(`Fetched ${mps.length} MPs.`);

            // Transform raw API data into our needed format
            // We need: name, club, district, id (for photo), maybe email
            const processedMPs = mps.filter(mp => mp.active).map(mp => ({
                id: mp.id,
                name: mp.firstLastName,
                club: mp.club,
                district: mp.districtName,
                votes: mp.numberOfVotes,
                email: mp.email,
                photoUrl: `https://api.sejm.gov.pl/sejm/term10/MP/${mp.id}/photo`
            }));

            const fileContent = `// Dane pobrane z API Sejmu RP (api.sejm.gov.pl)
// Data pobrania: ${new Date().toISOString()}

const realMpsData = ${JSON.stringify(processedMPs, null, 2)};

// Eksportujemy dane, aby były dostępne w innych plikach
if (typeof module !== 'undefined' && module.exports) {
    module.exports = realMpsData;
} else {
    // Dla przeglądarki przypisujemy do zmiennej globalnej
    window.realMpsData = realMpsData;
}
`;

            fs.writeFileSync('real_mps.js', fileContent);
            console.log('Successfully updated real_mps.js with ' + processedMPs.length + ' active MPs.');

        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Network Error: ' + err.message);
});
