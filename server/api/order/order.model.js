'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Order',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      orderNumber: DataTypes.STRING(12),
      grandTotal: DataTypes.DECIMAL(10, 2),
      instructions: DataTypes.STRING,
      forSomeoneElse: DataTypes.BOOLEAN,
      methodToSend: DataTypes.STRING,
      purchaserFirstName: DataTypes.STRING(20),
      purchaserLastName: DataTypes.STRING(20),
      purchaserAddress: DataTypes.STRING,
      purchaserCity: DataTypes.STRING(20),
      purchaserState: DataTypes.STRING(2),
      purchaserZipCode: DataTypes.STRING(10),
      purchaserEmail: DataTypes.STRING(80),
      purchaserPhone: DataTypes.STRING(23),
      recipientFirstName: DataTypes.STRING(20),
      recipientLastName: DataTypes.STRING(20),
      recipientAddress: DataTypes.STRING,
      recipientCity: DataTypes.STRING(20),
      recipientState: DataTypes.STRING(2),
      recipientZipCode: DataTypes.STRING(10),
      recipientEmail: DataTypes.STRING(80),
      recipientPhone: DataTypes.STRING(23),
      itemsOrdered: DataTypes.JSON
    }
  );
}
