/**
 * Sequelize initialization module
 */

'use strict';

//import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

let db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Test the connection
db.sequelize
  .authenticate()
  .then(err => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
  });

// Insert models below
db.Order = db.sequelize.import('../api/order/order.model');

// Implement: check the database for results using a promise

module.exports = db;
