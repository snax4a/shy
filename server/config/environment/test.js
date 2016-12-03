'use strict';
/*eslint no-process-env:0*/

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  // mongo: {
  //   uri: 'mongodb://localhost/shy-test'
  // },
  sequelize: {
    uri: 'postgres://user:pass@example.com:5432/dbname',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
};
