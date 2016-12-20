'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Subscriber',
    {
      email: {
        type: DataTypes.STRING(80),
        primaryKey: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      firstName: DataTypes.STRING(20),
      lastName: DataTypes.STRING(20),
      phone: DataTypes.STRING(23),
      optout: DataTypes.BOOLEAN
      // indexes: [
      //   {
      //     unique: true,
      //     fields: ['email']
      //   }
      // ]
    }
  );
}
