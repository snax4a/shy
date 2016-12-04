'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    uri: process.env.SEQUELIZE_URI,
    options: {}
  },

  // Seed database on startup
  seedDB: true
};
