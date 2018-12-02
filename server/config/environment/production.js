/*eslint no-process-env:0*/
'use strict';
import braintree from 'braintree';

// Production-specific configuration
module.exports = {
  // Server IP
  ip: process.env.IP || undefined,

  // Server port
  port: process.env.PORT || 8080,

  // Braintree
  gateway: {
    environment: braintree.Environment.Production,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  },

  // Never seed production database!
  seedDB: false
};
