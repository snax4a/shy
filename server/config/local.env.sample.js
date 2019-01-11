// Use local.env.js for environment variables that will be set when the server starts locally (dev/test - loaded by gulp).
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

export default {
  DOMAIN: 'http://localhost:3000',

  // Authentication
  SESSION_SECRET: 'Something unique and kind of long',
  TEACHER_EMAIL: 'teacher@example.com',
  TEACHER_PASSWORD: 'secret',
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD: 'secret',
  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',

  // Email
  SMTP_API_KEY: 'secret',
  SMTP_SENDER: { email: 'info@example.com', name: 'Company Name' },
  SMTP_ADMINS: 'example@example.com',

  // PostgreSQL connection URL
  DATABASE_URL: 'postgres://user:pass@localhost:5432/dbname',

  // Braintree Payment Gateway
  BRAINTREE_MERCHANT_ID: 'replace with braintree merchant id',
  BRAINTREE_PUBLIC_KEY: 'replace with braintree public key',
  BRAINTREE_PRIVATE_KEY: 'replace with braintree private key',
  BRAINTREE_MERCHANT_ID_SANDBOX: 'replace with braintree merchant id',
  BRAINTREE_PUBLIC_KEY_SANDBOX: 'replace with braintree public key',
  BRAINTREE_PRIVATE_KEY_SANDBOX: 'replace with braintree private key'
};
