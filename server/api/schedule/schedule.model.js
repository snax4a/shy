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
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    teacher: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },

    endTime: {
      type: DataTypes.TIME,
      allowNull: false
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
