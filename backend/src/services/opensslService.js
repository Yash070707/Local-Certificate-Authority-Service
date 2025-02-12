const openssl = require('openssl-nodejs');

exports.generateCSR = (csrDetails) => {
  return new Promise((resolve, reject) => {
    const { commonName, organization, country, state, city, email } = csrDetails;

    const subj = `/CN=${commonName}/O=${organization}/C=${country}/ST=${state}/L=${city}/emailAddress=${email}`;

    // OpenSSL command to generate a private key and CSR
    const opensslCmd = [
      'req', '-new',
      '-newkey', 'rsa:2048',
      '-nodes',
      '-keyout', '/dev/stdout',
      '-out', '/dev/stdout',
      '-subj', subj
    ];

    openssl(opensslCmd, (err, buffer) => {
      if (err) return reject(new Error('OpenSSL CSR generation failed'));

      // OpenSSL outputs both the private key and CSR together
      const output = buffer.toString();
      const privateKeyMatch = output.match(/(-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----)/);
      const csrMatch = output.match(/(-----BEGIN CERTIFICATE REQUEST-----[\s\S]+?-----END CERTIFICATE REQUEST-----)/);

      if (!privateKeyMatch || !csrMatch) {
        return reject(new Error('Failed to parse OpenSSL output'));
      }

      resolve({
        privateKey: privateKeyMatch[1],
        csr: csrMatch[1]
      });
    });
  });
};
