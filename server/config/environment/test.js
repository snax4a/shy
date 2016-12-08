'use strict';
/*eslint no-process-env:0*/

// Test specific configuration
// ===========================
module.exports = {
  sequelize: {
    uri: process.env.DATABASE_URL,
    options: {}
  },

  // Seed database on startup
  seedDB: true
};
