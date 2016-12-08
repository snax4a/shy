'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    uri: process.env.DATABASE_URL,
    options: {}
  },

  // Seed database on startup
  seedDB: true
};
