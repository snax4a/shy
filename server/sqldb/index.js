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
db.Schedule = db.sequelize.import('../api/schedule/schedule.model');
db.Purchase = db.sequelize.import('../api/user/purchase.model');
db.Attendance = db.sequelize.import('../api/user/attendance.model');

module.exports = db;
