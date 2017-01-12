'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Subscriber', {
    email: {
      type: DataTypes.STRING(80),
      primaryKey: true,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    firstName: DataTypes.STRING(20),
    lastName: DataTypes.STRING(20),
    phone: DataTypes.STRING(23),
    optOut: DataTypes.BOOLEAN
  }, {
    indexes: [
      { fields: ['email'] },
      { fields: ['lastName'] },
      { fields: ['firstName'] }
    ]
  });
}
