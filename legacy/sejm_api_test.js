
const https = require('https');

const url = 'https://api.sejm.gov.pl/sejm/term10/MP';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const mps = JSON.parse(data);
      console.log('Total MPs:', mps.length);
      console.log('Sample MP Data:', JSON.stringify(mps[0], null, 2));
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});

