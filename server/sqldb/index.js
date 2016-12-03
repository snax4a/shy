/**
 * Sequelize initialization module
 */

'use strict';

//import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Order = db.sequelize.import('../api/order/order.model');

module.exports = db;
