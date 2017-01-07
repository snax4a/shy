'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // FQDN
  fqdn: process.env.DOMAIN,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Sequelize connection opions
  sequelize: {
    uri: process.env.DATABASE_URL,
    options: {
      logging: false,
      dialect: 'postgres'
    }
  },

  // Nodemailer settings
  mail: {
    transport: {
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      secureConnection: 'false', // Use SSL instead of TLS
      tls: {
        ciphers: process.env.SMTP_TLS_CIPHERS || 'SSLv3'
      }
    },
    bcc: process.env.SMTP_BCC || process.env.SMTP_USER
  },

  // Default to not seeding the database unless required
  seedDB: false

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});
