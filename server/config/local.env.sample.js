'use strict';

// Use local.env.js for environment variables that will be set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: 'shy-secret',
  // Control debug level for modules using visionmedia/debug
  DEBUG: '',
  BRAINTREE_ENVIRONMENT: 'braintree.Environment.Sandbox', // not to be in quotes - use require
  BRAINTREE_MERCHANT_ID: 'replace with braintree merchant id',
  BRAINTREE_PUBLIC_KEY: 'replace with braintree public key',
  BRAINTREE_PRIVATE_KEY: 'replace with braintree private key',
  GOOGLE_DOCS_SERVICE_ACCT: 'yourserviceaccountemailhere@google.com',
  GOOGLE_DOCS_PRIVATE_KEY: 'your long private key stuff here',
  PAYFLOW_PRO_URL: 'https://payflowpro.paypal.com',
  PAYFLOW_PRO_USER: 'User',
  PAYFLOW_PRO_PASSWORD: 'Password',
  PAYFLOW_PRO_PARTNER: 'PayPal',
  PAYFLOW_PRO_VENDOR: 'Vendor',
  PAYFLOW_PRO_TESTING: true,
  SMTP_USER: 'someuser@somedomain.com',
  SMTP_PASSWORD: 'Password',
  SMTP_HOST: 'smtp.office365.com',
  SMTP_PORT: 587, //secure
  SMTP_TLS_CIPHERS: 'SSLv3'
};
