'use strict';
import config from '../config/environment';
import Sequelize from 'sequelize';

let db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Imported model definitions
db.User = db.sequelize.import('../api/user/user.model');
db.Order = db.sequelize.import('../api/order/order.model');
db.Announcement = db.sequelize.import('../api/announcement/announcement.model');
db.Schedule = db.sequelize.import('../api/schedule/schedule.model');
db.Purchase = db.sequelize.import('../api/user/purchase.model');
db.Attendance = db.sequelize.import('../api/user/attendance.model');

// Associations
db.Purchase.belongsTo(db.User, { onDelete: 'cascade', hooks: true });
db.Attendance.belongsTo(db.User, { onDelete: 'cascade', hooks: true });
db.User.hasMany(db.Purchase, { onDelete: 'cascade', hooks: true });
db.User.hasMany(db.Attendance, { onDelete: 'cascade', hooks: true });

module.exports = db;
