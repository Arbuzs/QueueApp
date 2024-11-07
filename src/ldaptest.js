const ldap = require('ldapjs');

const client = ldap.createClient({
  url: 'ldap://10.84.132.3'
});

const bindDN = 'CN=LDAP Authentication,OU=BIO,OU=NA,OU=UserAccounts,DC=agc,DC=jp';
const bindCredentials = 'H41ry!C4t';
const searchBase = 'OU=CPH,OU=DK,OU=BIO,OU=NA,OU=UserAccounts,DC=agc,DC=jp';
const searchFilter = '(uid={{username}})';

client.bind(bindDN, bindCredentials, (err) => {
  if (err) {
    console.error('Bind failed:', err);
    return;
  }

  console.log('Bind successful');

  client.search(searchBase, { filter: searchFilter, scope: 'sub' }, (err, res) => {
    if (err) {
      console.error('Search failed:', err);
      return;
    }

    res.on('searchEntry', (entry) => {
      console.log('Entry:', entry.object);
    });

    res.on('searchReference', (referral) => {
      console.log('Referral:', referral.uris.join());
    });

    res.on('error', (err) => {
      console.error('Search error:', err);
    });

    res.on('end', (result) => {
      console.log('Search ended with status:', result.status);
      client.unbind((err) => {
        if (err) {
          console.error('Unbind failed:', err);
        } else {
          console.log('Unbind successful');
        }
      });
    });
  });
});
