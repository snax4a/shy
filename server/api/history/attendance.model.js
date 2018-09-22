'use strict';

export default function(sequelize, DataTypes) {
  const attributes = {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    attended: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    // Next three attributes are intentionally not normalized.
    // Administratively, these are managed via JSON files rather than tables.
    // The simplified queries outweigh the storage savings.

    location: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    classTitle: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    // Stored as last name, first name
    teacher: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  };

  const options = {
    indexes: [
      { fields: ['UserId'] },
      { fields: ['attended'] },
      { fields: ['location'] },
      { fields: ['classTitle'] },
      { fields: ['teacher'] }
    ]
  };

  let Attendance = sequelize.define('Attendance', attributes, options);

  return Attendance;
}
