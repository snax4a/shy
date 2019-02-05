/*eslint no-process-env:0*/

import braintree from 'braintree';

// Test specific configuration
// ===========================
export default {
  googleUser: {
    email: process.env.GOOGLE_EMAIL
  },

  student: {
    email: process.env.STUDENT_EMAIL,
    password: process.env.STUDENT_PASSWORD
  },

  teacher: {
    email: process.env.TEACHER_EMAIL,
    password: process.env.TEACHER_PASSWORD
  },

  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },

  // Braintree
  gateway: {
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID_SANDBOX,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY_SANDBOX,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY_SANDBOX
  }
};
