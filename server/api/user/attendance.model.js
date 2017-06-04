'use strict';

export default function(sequelize, DataTypes) {
  const attributes = {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    },

    attended: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true
      }
    },

    // Next three attributes are intentionally not normalized.
    // Administratively, these are managed via JSON files rather than tables.
    // The simplified queries outweigh the storage savings.

    location: {
      type: DataTypes.STRING(20),
      validate: {
        notEmpty: true
      }
    },

    classTitle: {
      type: DataTypes.STRING(80),
      validate: {
        notEmpty: true
      }
    },

    // Stored as last name, first name
    teacher: {
      type: DataTypes.STRING(40),
      validate: {
        notEmpty: true
      }
    }
  };

  const options = {
    indexes: [
      { fields: ['userId', 'attended', 'location', 'classTitle', 'teacher'] }
    ]
  };

  let Attendance = sequelize.define('Attendance', attributes, options);

  return Attendance;
}
