'use strict';
/*eslint no-process-env:0*/

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

  // Sequelize
  sequelize: {
    uri: process.env.SEQUELIZE_URL_HEROKU,
    options: {}
  },

  // Seed database on startup
  seedDB: false
};
