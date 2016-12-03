'use strict';

export default (sequelize, DataTypes) =>
  sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    placedOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    orderNumber: DataTypes.STRING,
    grandTotal: DataTypes.DECIMAL,
    instructions: DataTypes.STRING,
    forSomeoneElse: DataTypes.BOOLEAN,
    methodToSend: DataTypes.STRING,
    purchaserFirstName: DataTypes.STRING,
    purchaserLastName: DataTypes.STRING,
    purchaserAddress: DataTypes.STRING,
    purchaserCity: DataTypes.STRING,
    purchaserZipCode: DataTypes.STRING,
    purchaserEmail: DataTypes.STRING,
    purchaserPhone: DataTypes.STRING,
    recipientFirstName: DataTypes.STRING,
    recipientLastName: DataTypes.STRING,
    recipientAddress: DataTypes.STRING,
    recipientCity: DataTypes.STRING,
    recipientZipCode: DataTypes.STRING,
    recipientEmail: DataTypes.STRING,
    recipientPhone: DataTypes.STRING,
    itemsOrdered: DataTypes.JSON
  }
);
