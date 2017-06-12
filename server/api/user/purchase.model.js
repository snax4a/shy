'use strict';

export default function(sequelize, DataTypes) {
  const attributes = {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    UserId: {
      type: DataTypes.INTEGER
    },

    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    },

    // Intentionally not normalized as a separate table
    // Payment methods change from time to time - too much of an admin hassle
    method: {
      type: DataTypes.STRING(16),
      validate: {
        notEmpty: true
      }
    },

    notes: {
      type: DataTypes.STRING(256)
    }
  };

  const options = {
    indexes: [
      { fields: ['createdAt'] },
      { fields: ['UserId']}
    ]
  };

  let Purchase = sequelize.define('Purchase', attributes, options);

  return Purchase;
}
