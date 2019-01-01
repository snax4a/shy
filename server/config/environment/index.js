/* eslint no-process-env:0 */

import path from 'path';
import nodemailer from 'nodemailer';
import shared from './shared';
import development from './development';
import test from './test';
import production from './production';

// All configurations will extend these options
const all = {
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

  // Browser-sync port for development
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // TODO: remove sequelize property
  // Sequelize options
  sequelize: {
    uri: process.env.DATABASE_URL,
    options: {
      dialect: 'postgres',
      timezone: 'America/New_York',
      native: true,
      pool: {
        max: 5, // default
        min: 0, // default
        acquire: 10000, // milliseconds will try to get a connection before throwing error
        idle: 10000, // milliseconds before being released
        evict: 10000 // milliseconds for evicting stale connections
      },
      logging: false, // use console.log when debugging
      operatorsAliases: false // prevents warning
    }
  },

  // node-postgres(pg) options
  pg: {
    uri: process.env.DATABASE_URL
  },

  // TODO: remove seedDB property
  // By default, do not seed the database
  seedDB: false,

  // Nodemailer settings
  mail: {
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    }, { from: process.env.SMTP_USER }),
    admins: process.env.SMTP_ADMINS // notification go to this group
  },

  // Integrated authentication
  google: {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
  }
};

const environmentConfig = { development, test, production };

// Export merged config object
export default Object.assign({}, all, shared, environmentConfig[process.env.NODE_ENV] || {});
