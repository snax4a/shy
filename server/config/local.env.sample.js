// Use local.env.js for environment variables that will be set when the server starts locally (dev/test - loaded by gulp).
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:3000',
  SESSION_SECRET: 'Something unique and kind of long',

  // Authentication
  TEACHER_EMAIL: 'teacher@example.com',
  TEACHER_PASSWORD: 'secret',
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD: 'secret',
  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',

  // Nodemailer
  SMTP_USER: 'someuser@somedomain.com',
  SMTP_PASSWORD: 'Password',
  SMTP_HOST: 'smtp.office365.com',
  SMTP_ADMINS: 'nul@bitbucket.com, foo@bitbucket.com',

  // Sequelize or node-postgres (pg) connection to PostgreSQL
  DATABASE_URL: 'postgres://user:pass@localhost:5432/dbname',

  // Braintree Payment Gateway
  BRAINTREE_MERCHANT_ID: 'replace with braintree merchant id',
  BRAINTREE_PUBLIC_KEY: 'replace with braintree public key',
  BRAINTREE_PRIVATE_KEY: 'replace with braintree private key',
  BRAINTREE_MERCHANT_ID_SANDBOX: 'replace with braintree merchant id',
  BRAINTREE_PUBLIC_KEY_SANDBOX: 'replace with braintree public key',
  BRAINTREE_PRIVATE_KEY_SANDBOX: 'replace with braintree private key'
};
