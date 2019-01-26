/*eslint no-process-env:0*/

import braintree from 'braintree';

// Development specific configuration
// ==================================
export default {
  // Braintree
  gateway: {
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID_SANDBOX,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY_SANDBOX,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY_SANDBOX
  },

  // Browser-sync port for development
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000
};
