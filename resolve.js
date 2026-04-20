const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS

console.log('Resolving... _mongodb._tcp.cluster0.nnnfphv.mongodb.net');

dns.resolveSrv('_mongodb._tcp.cluster0.nnnfphv.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Error:', err);
  } else {
    console.log('SRV Addresses:', addresses);
  }
});

dns.resolveTxt('cluster0.nnnfphv.mongodb.net', (err, records) => {
  if (err) {
    console.error('TXT Error:', err);
  } else {
    console.log('TXT Records:', records);
  }
});
