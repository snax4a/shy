'use strict';

// Use local.env.js for environment variables that will be set when the server starts locally.
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
  FACEBOOK_ID: 'app-id',
  FACEBOOK_SECRET: 'secret',
  TWITTER_ID: 'app-id',
  TWITTER_SECRET: 'secret',
  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',

  // Nodemailer
  SMTP_USER: 'someuser@somedomain.com',
  SMTP_PASSWORD: 'Password',
  SMTP_HOST: 'smtp.office365.com',
  SMTP_ADMINS: 'nul@bitbucket.com, foo@bitbucket.com',

  // Sequelize PostgreSQL
  DATABASE_URL: 'postgres://user:pass@localhost:5432/dbname',

  // node-postgres (pg) uses same environmental variables as libq (and Herok)
  PGHOST: 'localhost', // default
  PGPORT: 5432, // default
  PGUSER: 'user', // default is process.env.USER
  PGPASSWORD: 'password', // default is null
  PGDATABASE: 'dbname', // default is process.env.USER

  // Braintree Payment Gateway
  BRAINTREE_MERCHANT_ID: 'replace with braintree merchant id',
  BRAINTREE_PUBLIC_KEY: 'replace with braintree public key',
  BRAINTREE_PRIVATE_KEY: 'replace with braintree private key',
  BRAINTREE_MERCHANT_ID_SANDBOX: 'replace with braintree merchant id',
  BRAINTREE_PUBLIC_KEY_SANDBOX: 'replace with braintree public key',
  BRAINTREE_PRIVATE_KEY_SANDBOX: 'replace with braintree private key'
};
