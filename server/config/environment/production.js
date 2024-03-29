/*eslint no-process-env:0*/

import braintree from 'braintree';

// Production-specific configuration
export default {
  // Server port (Heroku uses random ports)
  port: process.env.PORT || undefined,

  // Braintree
  gateway: {
    environment: braintree.Environment.Production,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  }
};
