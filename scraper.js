const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

https.get('https://140.150.30.128:5030/home/promote?id=460998434&active=directData', { agent }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = data.match(/src=["']([^"']*)["']/g);
    console.log('Matches:', urls);
  });
}).on('error', err => console.error(err));
