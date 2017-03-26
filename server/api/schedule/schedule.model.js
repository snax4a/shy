'use strict';

export default function(sequelize, DataTypes) {
  const attributes = {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    location: {
      type: DataTypes.STRING(20),
      validate: {
        notEmpty: true
      }
    },

    day: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    },

    title: {
      type: DataTypes.STRING(100),
      validate: {
        notEmpty: true
      }
    },

    teacher: {
      type: DataTypes.STRING(40),
      validate: {
        notEmpty: true
      }
    },

    startTime: {
      type: DataTypes.TIME,
      validate: {
        notEmpty: true
      }
    },

    endTime: {
      type: DataTypes.TIME,
      validate: {
        notEmpty: true
      }
    },

    canceled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  };

  const options = {
    indexes: [
      { fields: ['location', 'day', 'startTime'] }
    ]
  };

  let Schedule = sequelize.define('Schedule', attributes, options);

  return Schedule;
}
