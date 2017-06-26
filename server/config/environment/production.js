/*eslint no-process-env:0*/
'use strict';
import braintree from 'braintree';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.IP
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || 8080,

  // Braintree
  gateway: {
    environment: braintree.Environment.Production,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  },

  // Seed database on startup
  seedDB: false
};
