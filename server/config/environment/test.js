'use strict';
/*eslint no-process-env:0*/
import braintree from 'braintree';

// Test specific configuration
// ===========================
module.exports = {
  sequelize: {
    uri: process.env.DATABASE_URL,
    options: {}
  },

  gateway: {
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID_SANDBOX,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY_SANDBOX,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY_SANDBOX
  },

  // Seed database on startup
  seedDB: true
};
