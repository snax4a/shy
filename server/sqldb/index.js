/**
 * Sequelize initialization module
 */

'use strict';

import config from '../config/environment';
import Sequelize from 'sequelize';

let db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.User = db.sequelize.import('../api/user/user.model');
db.Order = db.sequelize.import('../api/order/order.model');
db.Announcement = db.sequelize.import('../api/announcement/announcement.model');

module.exports = db;
