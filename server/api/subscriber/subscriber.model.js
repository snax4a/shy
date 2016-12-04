'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Subscriber',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      firstName: DataTypes.STRING(20),
      lastName: DataTypes.STRING(20),
      address: DataTypes.STRING,
      city: DataTypes.STRING(20),
      state: DataTypes.STRING(2),
      zipCode: DataTypes.STRING(10),
      email: DataTypes.STRING(80),
      phone: DataTypes.STRING(23),
      optout: DataTypes.BOOLEAN
    }
  );
}
