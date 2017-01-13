'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Order', {
    orderNumber: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: true
      }
    },
    gift: DataTypes.BOOLEAN,
    instructions: DataTypes.STRING,
    sendVia: DataTypes.STRING,
    purchaserFirstName: DataTypes.STRING(20),
    purchaserLastName: DataTypes.STRING(20),
    purchaserEmail: {
      type: DataTypes.STRING(80),
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    purchaserPhone: DataTypes.STRING(23),
    last4: DataTypes.STRING(4),
    recipientFirstName: DataTypes.STRING(20),
    recipientLastName: DataTypes.STRING(20),
    recipientAddress: DataTypes.STRING,
    recipientCity: DataTypes.STRING(20),
    recipientState: DataTypes.STRING(2),
    recipientZipCode: DataTypes.STRING(10),
    recipientEmail: {
      type: DataTypes.STRING(80),
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    recipientPhone: DataTypes.STRING(23),
    itemsOrdered: {
      type: DataTypes.JSON,
      validate: {
        notEmpty: true
      }
    }
  }, {
    indexes: [
      { fields: ['orderNumber'] },
      { fields: ['purchaserEmail'] },
      { fields: ['recipientEmail'] },
      { fields: ['purchaserLastName'] },
      { fields: ['purchaserFirstName'] },
      { fields: ['recipientLastName'] },
      { fields: ['recipientFirstName'] },
      { fields: ['last4'] }
    ]
  });
}
