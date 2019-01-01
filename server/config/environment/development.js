/*eslint no-process-env:0*/

import braintree from 'braintree';

// Development specific configuration
// ==================================
module.exports = {
  // Braintree
  gateway: {
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID_SANDBOX,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY_SANDBOX,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY_SANDBOX
  },

  // Seed database on startup
  seedDB: false
};
