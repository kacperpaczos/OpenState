const https = require('https');

// Print 1 is usually a safe bet for any term, or just pick one from the list
const URL = 'https://api.sejm.gov.pl/sejm/term10/processes/1';

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('--- PROCESS 1 ---');
            console.log('Stages:', json.stages);
            if (json.stages) {
                console.log('Stage count:', json.stages.length);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', (e) => {
    console.error('Error:', e);
});
