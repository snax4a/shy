'use strict';

// Use local.env.js for environment variables that will be set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  SMTP_USER: 'someuser@somedomain.com',
  SMTP_PASSWORD: 'Password',
  SMTP_HOST: 'smtp.office365.com',
  SMTP_PORT: 587, //secure
  SMTP_TLS_CIPHERS: 'SSLv3',

  DATABASE_URL: 'postgres://user:pass@localhost:5432/dbname',

  BRAINTREE_MERCHANT_ID: 'replace with braintree merchant id',
  BRAINTREE_PUBLIC_KEY: 'replace with braintree public key',
  BRAINTREE_PRIVATE_KEY: 'replace with braintree private key'
};
