/* eslint no-process-env:0 */

import path from 'path';
import development from './development';
import test from './test';
import production from './production';

// All configurations will extend these options
const common = {
  env: process.env.NODE_ENV,

  // Server port
  port: process.env.PORT || 9000,

  // Website URL
  domain: process.env.DOMAIN || 'http://localhost:3000',

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SESSION_SECRET
  },

  userRoles: ['student', 'teacher', 'admin'],

  // node-postgres(pg) options
  pg: {
    uri: process.env.DATABASE_URL
  },

  // By default, do not seed the database
  seedDB: false,

  // Email settings
  mail: {
    apiKey: process.env.SMTP_API_KEY,
    sender: JSON.parse(process.env.SMTP_SENDER),
    admins: process.env.SMTP_ADMINS // notification go to this group email
  },

  // Integrated authentication
  google: {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
  }
};

const environmentConfigurations = { development, test, production };
const activeConfig = Object.assign(common, environmentConfigurations[process.env.NODE_ENV] || {});

// Export merged config object
export default activeConfig;
